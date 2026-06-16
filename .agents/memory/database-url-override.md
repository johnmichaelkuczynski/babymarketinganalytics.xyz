---
name: DATABASE_URL platform override
description: The app's DATABASE_URL resolves to a Replit platform DB and shadows any user-set DATABASE_URL secret.
---

# DATABASE_URL is platform-injected (shadows user secrets)

In this project `process.env.DATABASE_URL` resolves to host `helium`, db `heliumdb` — a Replit-platform-injected value. There is **no** `.env` or code that sets it.

- A user can add a `DATABASE_URL` *secret* (e.g. an external Neon URL), but the platform-injected `DATABASE_URL` **wins**, so the app keeps using `heliumdb`. The user's external URL is then unreadable from env/shell/sandbox because it's shadowed everywhere.
- `checkDatabase()` may report `provisioned: false` even though the app has a fully working database at `heliumdb` (the skill's provisioning check and the app's actual `DATABASE_URL` are not the same source of truth).
- The agent has **no tool to deprovision** the platform DB. Switching the app to a user's external DB requires the user to remove the platform database in the Database pane so their secret takes effect — it cannot be done agent-side.

**Why:** explains the confusing case where a user insists "use my external DATABASE_URL" but the app won't. **How to apply:** classify the live `DATABASE_URL` host (print host/dbname only, never the password) before assuming which DB is in use; don't trust `checkDatabase()` alone.

**Update (verified live):** the shadow is NOT permanent. As of the latest check the live `DATABASE_URL` resolved to the user's external **Neon** DB (`*.neon.tech`, db `neondb`), not `helium/heliumdb`, and the app seeds/serves from it normally (lib/db enables SSL `rejectUnauthorized:false` for non-local hosts). So once the platform DB is gone (or otherwise not injected), a user-set Neon secret DOES take effect. Always re-verify the live host rather than assuming `helium` still wins.
