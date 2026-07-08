---
name: Google OAuth + Replit proxy
description: Two production-breaking gotchas when wiring Google OAuth through Replit's reverse proxy with connect-pg-simple sessions.
---

## Rule 1 — OAuth callback path must be under the artifact's routed prefix

Replit's reverse proxy routes requests to each artifact server based on `paths` in `artifact.toml`. If the api-server only exposes `paths = ["/api"]`, any callback registered at `/auth/google/callback` is **never received by the API server** in production — it is served by the frontend's static file handler instead. The session is never saved, and the login loops forever.

**Fix:** Register the OAuth callback under the same prefix the artifact owns:
```
CALLBACK_PATH = "/api/auth/google/callback"
```
Update Google Cloud Console Authorized Redirect URIs to match.

**Why:** The proxy does not do path rewriting; each artifact only receives requests whose path matches its own `paths` entries. `/auth/...` ≠ `/api`, so it silently falls through to the catch-all static handler.

**How to apply:** Any time you add a non-`/api` route to the api-server (webhooks, OAuth callbacks, etc.) that must work in production, either add that path prefix to `artifact.toml [[services]] paths` or keep the route under `/api`.

---

## Rule 2 — connect-pg-simple `createTableIfMissing: true` breaks in esbuild bundles

`connect-pg-simple` implements `createTableIfMissing` by reading a `table.sql` file from its package directory at runtime. esbuild bundles the JS but does not copy the SQL file, so the path `/dist/table.sql` does not exist → `ENOENT` error on every session write → sessions are never persisted → login loop.

**Fix:** Set `createTableIfMissing: false` and pre-create the table yourself before initializing the session store:
```ts
await pool.query(`
  CREATE TABLE IF NOT EXISTS "user_sessions" (
    "sid"    varchar       NOT NULL COLLATE "default",
    "sess"   json          NOT NULL,
    "expire" timestamp(6)  NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
  ) WITH (OIDS=FALSE);
  CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire");
`);
```
This requires `setupAuth` to be `async` and the calling code to `await` it.

**Why:** esbuild bundles only what is imported by JS; static data files referenced by string paths at runtime are invisible to the bundler.

**How to apply:** Any time a Node package reads a bundled data file at runtime by path (not via `import`/`require`), assume esbuild will drop it and pre-load or inline the data explicitly.
