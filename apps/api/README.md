# Viva Impact API (Cloudflare Workers/Pages Functions)

This directory will hold the edge runtime that powers the Viva Impact experience.
The plan is to build the backend with Cloudflare Workers and Pages Functions so
that the web client can call serverless endpoints for ad analysis, storage and
workflow orchestration.

## Getting started

1. Place Workers source files inside a `functions/` directory (compatible with
   Cloudflare Pages Functions) or the standard `src/` directory for standalone
   Workers deployments.
2. Update `wrangler.toml` with the project name and bindings once the service is
   ready.
3. Use the npm scripts below as a reminder for running local development and
   triggering infrastructure-as-code deployments.

```sh
# Start a local Workers emulator once functions exist
npm run dev

# Trigger a deploy through the IaC pipeline (e.g. GitHub Actions + Wrangler)
npm run deploy:preview
npm run deploy:production
```
