# Viva Impact Frontend

This React application analyzes ads using an n8n workflow.

## Environment Variables

The application expects a webhook URL available in the environment under the
`REACT_APP_N8N_WEBHOOK_URL` variable.

### Local development

Create a `.env` file in the project root:

```
REACT_APP_N8N_WEBHOOK_URL=<url>
```

Replace `<url>` with the webhook endpoint to be used. After setting the value,
start the development server with `npm start`.

### Production build

When building or running the application in production, supply the variable in
the environment:

```
REACT_APP_N8N_WEBHOOK_URL=<url> npm run build
```

Hosting services usually provide a way to define environment variables for
runtime.

### Continuous integration / other environments

Set `REACT_APP_N8N_WEBHOOK_URL` in the relevant environment configuration (for
example as a secret or CI variable) before running the build or tests.

