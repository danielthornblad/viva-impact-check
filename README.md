# Viva Impact Monorepo

The project is now organised as a multi-package workspace to host the web
frontend, Cloudflare Pages Functions backend and shared libraries in one place.

## Directory layout

- `apps/web` – React frontend served to end users.
- `apps/api` – Wrangler configuration and npm scripts for the backend runtime.
- `functions` – Cloudflare Pages Functions that implement the API endpoints.
- `packages/shared` – Domain-level utilities consumable by any app.
- `packages/ui` – Reusable UI helpers and future component library.
- `packages/configs` – Centralised lint/test/vite configuration exports.
- `db/migrations` – Versioned database schema changes.
- `db/seed` – Seed scripts to populate non-production databases.
- `infra` – Infrastructure-as-code definitions and deployment hooks.
- `scripts` – Automation scripts executed locally or in CI/CD.
- `docs` – High-level documentation and architecture notes.
- `.github/workflows` – GitHub Actions automation for CI/CD.

## Getting started

Install dependencies for every workspace:

```sh
npm install
```

Run the frontend locally:

```sh
npm run start:web
```

Build the production bundle:

```sh
npm run build:web
```

Run the frontend tests once (CI-style):

```sh
npm run test:web
```

Each workspace can also be targeted directly with `npm run <script> --workspace <name>`.

## Adding backend functionality

1. Place Worker or Pages Function files inside the repository root `functions/`
   directory. The folder structure below it maps directly to the live routes
   (for example, `functions/auth/login.js` becomes `/auth/login`).
2. Use `apps/api/wrangler.toml` to manage bindings, environment-specific
   settings and the shared `pages_functions_dir` reference.
3. Develop locally via `npm run dev --workspace @viva/api`, which proxies
   `wrangler pages dev` against the root-level `functions/` directory.
4. Store shared models or logic in `packages/shared` so the frontend and backend
   stay in sync.
5. Version database migrations under `db/migrations` and reference them from
   CI/CD scripts inside `scripts/`.

Refer to the READMEs in each directory for more detailed expectations as the
project grows.
