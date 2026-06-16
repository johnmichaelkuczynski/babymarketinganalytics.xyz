---
name: Removing an artifact
description: How to delete an artifact when its workflow is platform-managed and removeWorkflow is blocked.
---

# Removing an artifact

There is **no `deleteArtifact` callback**. To remove an artifact, `rm -rf artifacts/<slug>` the directory — the platform then auto-reconciles: it removes the artifact from the registry AND removes its managed workflow. You'll see `Removed artifact: ...` in the automatic updates.

**Why:** `removeWorkflow({name})` fails for artifact workflows with `PROHIBITED_ACTION` ("managed by an artifact and cannot be deleted via deleteRunWorkflow"). The workflow is owned by the artifact, so you delete the artifact (its dir), not the workflow.

**How to apply:** When asked to delete/destroy an artifact: (1) `rm -rf` its directory; (2) do NOT try removeWorkflow first — it's blocked; (3) afterward clean up stragglers the deletion does NOT touch: `pnpm install` to drop the stale `pnpm-lock.yaml` importer sections, `.agents/agent_assets_metadata.toml` entries pointing at the removed dir, and any prose references in README.md / BLUEPRINT.md. pnpm-workspace.yaml needs no edit (it globs `artifacts/*`).
