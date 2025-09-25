# Viva Impact API (Cloudflare Workers/Pages Functions)

This directory holds the Wrangler configuration and npm scripts for the
serverless backend that powers the Viva Impact experience. The actual request
handlers live in the repository root `functions/` directory so that both local
runs and production deploys share the same entrypoints.

## Getting started

1. Create or update function files inside `../../functions/`. The folder
   structure maps to URL routes, e.g. `functions/auth/login.js` serves
   `/auth/login`.
2. Update `wrangler.toml` with the project name, bindings and any environment
   specific settings. The `pages_functions_dir` already points at the shared
   `../../functions` path.
3. Use the npm scripts below for local development and to trigger
   infrastructure-as-code driven deployments.

```sh
# Start a local Workers emulator against the shared functions directory
npm run dev

# Trigger a deploy through the IaC pipeline (e.g. GitHub Actions + Wrangler)
npm run deploy:preview
npm run deploy:production
```
