# Viva Impact Frontend

This React application analyzes ads using an n8n workflow. The project now lives
inside the monorepo under `apps/web` and is managed through npm workspaces from
the repository root.

## Environment Variables

The application expects a webhook URL available in the environment under the
`REACT_APP_N8N_WEBHOOK_URL` variable.

### Local development

Create a `.env` file next to this README (`apps/web/.env`):

```
REACT_APP_N8N_WEBHOOK_URL=<url>
REACT_APP_TURNSTILE_SITE_KEY=<cloudflare-turnstile-site-key>
```

Replace `<url>` with the webhook endpoint to be used. After setting the value,
start the development server from the repo root:

```
npm run start:web
```

### Production build

When building or running the application in production, supply the variable in
the environment:

```
REACT_APP_N8N_WEBHOOK_URL=<url> \
REACT_APP_TURNSTILE_SITE_KEY=<cloudflare-turnstile-site-key> \
  npm run build:web
```

Hosting services usually provide a way to define environment variables for
runtime. Cloud builds can also call the workspace script with
`npm run build --workspace @viva/web` if more convenient.

### Continuous integration / other environments

Set `REACT_APP_N8N_WEBHOOK_URL` and `REACT_APP_TURNSTILE_SITE_KEY` in the
relevant environment configuration (for example as secrets or CI variables)
before running the build or tests:

```
npm run test:web
```

## Authentication & administration

The frontend is protected by the Viva Impact login system. Users must be
created by an administrator i adminpanelen innan de kan använda
annonsanalysen. Under utveckling kan du mocka API-svaren genom att stubba
`/api/auth/me`.

Administratörer får en genväg till adminpanelen via sidhuvudet efter inloggning
och kan där skapa användare, återställa lösenord samt aktivera/inaktivera
konton. Alla administrativa åtgärder kräver att Cloudflare Turnstile är
konfigurerat med `REACT_APP_TURNSTILE_SITE_KEY` (frontend) och den hemliga
nyckeln i backend.
