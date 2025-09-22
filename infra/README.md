# Infrastructure as Code

Terraform, Pulumi or other IaC definitions for Viva Impact belong in this
folder. The goal is to version and review every infrastructure change, tying
into the GitHub Actions workflows defined under `.github/workflows/`.

Cloudflare Pages deployments should consume the shared `functions/` directory in
the repository root, matching the configuration stored in `apps/api/wrangler.toml`.
