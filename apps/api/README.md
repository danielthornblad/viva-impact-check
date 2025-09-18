# Viva Impact API (Cloudflare Workers/Pages Functions)

Detta paket innehåller wrangler-konfiguration och dokumentation för Viva Impact
API:t. Själva Cloudflare Pages Functions-koden ligger nu i repo-rotens
`./functions` (från denna katalog når du den via `../../functions`). D1 lagrar
användare och sessioner, Workers KV cachar sessionstillstånd och Cloudflare
Turnstile skyddar alla inloggnings- och adminflöden mot botar.

## Getting started

1. Lägg Workers-källkod i rotens `./functions/` (Pages Functions) eller `src/`
   för en fristående Worker.
2. Uppdatera `wrangler.toml` med rätt projektnamn och riktiga bindingar innan
   driftsättning.
3. Använd npm-skriptet `dev` (kör `wrangler pages dev ../../functions`) för
   lokal utveckling och `deploy:*` för att trigga IaC/CI-flöden.

```sh
# Starta lokal Workers-emulator
npm run dev

# Deploy-kommandon triggas normalt via CI
npm run deploy:preview
npm run deploy:production
```

## Runtime bindings

`wrangler.toml` definierar följande bindingar som måste ersättas med riktiga IDn
per miljö:

| Binding | Typ | Beskrivning |
| --- | --- | --- |
| `DB` | Cloudflare D1 | Databasen för användare & sessioner. Kör `db/migrations/0001_auth_schema.sql` vid provisionering. |
| `SESSION_CACHE` | Workers KV | Snabbcache av aktiva sessioner. |
| `SESSION_COOKIE_NAME` | Miljövariabel | Namnet på session-cookien (standard `viva_session`). |
| `SESSION_TTL_SECONDS` | Miljövariabel | Sessionens livslängd i sekunder (default 604800 = 7 dagar). |
| `TURNSTILE_SECRET_KEY` | Worker Secret | Hemlig nyckel för Turnstile-validering (`wrangler secret put`). |

## API-ytor

- `POST /api/auth/login` – verifierar Turnstile, kontrollerar e-post/lösenord,
  återställer misslyckade försök och skapar en session-cookie.
- `POST /api/auth/logout` – revokerar nuvarande session och nollställer cookien.
- `GET /api/auth/me` – returnerar aktiv användare om sessionen är giltig.
- `GET /api/admin/users` – listar användare med status och aktiva sessioner.
- `POST /api/admin/users` – skapar ny användare (kräver Turnstile-token).
- `POST /api/admin/users/:id/reset-password` – sätter nytt lösenord och stänger
  alla sessioner för användaren.
- `POST /api/admin/users/:id/toggle` – aktiverar eller inaktiverar ett konto.
- `DELETE /api/admin/sessions/:id` – revokerar en specifik session.

Samtliga admin-endpoints kräver att sessionens roll är `admin`.

## Provisionera första administratören

1. Kör migreringen i `db/migrations/0001_auth_schema.sql` mot din D1-instans.
2. Skapa ett hash med samma format som backend använder:
   ```sh
   node -e "const crypto=require('crypto');const pwd='StarktLosenord!123';const iter=310000;const salt=crypto.randomBytes(16);crypto.pbkdf2(pwd,salt,iter,32,'sha256',(err,derived)=>{if(err)throw err;console.log(`pbkdf2$${iter}$${salt.toString('base64')}$${derived.toString('base64')}`);});"
   ```
3. Infoga en rad i `users`-tabellen med `role = 'admin'`, hashat lösenord och
   `is_active = 1`.
4. Logga in med kontot och lägg till övriga användare via adminpanelen.

## Säkerhetsnoteringar

- Turnstile måste vara aktiverat i både frontend (`REACT_APP_TURNSTILE_SITE_KEY`)
  och backend (`TURNSTILE_SECRET_KEY`).
- Sessions lagras i D1 för uthållighet och i KV för snabb validering. Alla
  cookies är HTTP-only, `Secure` och `SameSite=Lax`.
- Konton låses temporärt efter fem misslyckade försök (15 minuter).
