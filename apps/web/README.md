# Viva Impact Frontend

This React application analyzes ads using an n8n workflow. The project now lives
inside the monorepo under `apps/web` and is managed through npm workspaces from
the repository root.

## Environment Variables

The application expects a webhook URL available in the environment under the
`VITE_N8N_WEBHOOK_URL` variable.

### Local development

Create a `.env` file next to this README (`apps/web/.env`):

```
VITE_N8N_WEBHOOK_URL=<url>
```

Replace `<url>` with the webhook endpoint to be used. After setting the value,
start the development server from the repo root:

```
npm run start:web
```

#### Pausa autentisering i dev-läge

Om backendens autentiseringstjänst inte körs lokalt kan du sätta flaggan
`VITE_AUTH_DEV_PAUSE=true` i `.env`. När flaggan används i kombination med
Vites `npm run start:web` (som körs i dev-läge) hoppar frontenden över alla
anrop till auth-API:t, markerar användaren som inloggad med en stubprofil och
visar en banner som påminner om att autentisering är pausad.

### Production build

When building or running the application in production, supply the variable in
the environment:

```
VITE_N8N_WEBHOOK_URL=<url> npm run build:web
```

Hosting services usually provide a way to define environment variables for
runtime. Cloud builds can also call the workspace script with
`npm run build --workspace @viva/web` if more convenient.

### Continuous integration / other environments

Set `VITE_N8N_WEBHOOK_URL` in the relevant environment configuration (for
example as a secret or CI variable) before running the build or tests:

```
npm run test:web
```
