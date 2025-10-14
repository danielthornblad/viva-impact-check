# Autentisering och sessionshantering

Det här dokumentet beskriver hur autentiseringstjänsten för Viva Impact är
uppbyggd, hur databasen hålls synkad mellan miljöer och hur du sår initial data
för att administratörer ska kunna logga in.

## Databasschema

D1-databasen definieras av migrationen `db/migrations/0001_create_auth_tables.sql`
och innehåller följande huvudtabeller:

- `allowed_google_accounts` – allow-list för e-postadresser som får logga in.
- `roles` – roller som kan tilldelas ett konto (t.ex. `admin`).
- `account_roles` – kopplingstabell mellan konton och roller.
- `sessions` – persistenta sessionsposter för Viva Impact-frontenden.

Migrationen skapar även index och seedar grundrollerna `admin` och `analyst` så
att de finns tillgängliga i alla miljöer.

## Köra migrationer

1. Kontrollera att `wrangler.toml` pekar på rätt D1-databas för din miljö.
   Uppdatera `database_id` (och `preview_database_id` för utveckling) med värdena
   från `wrangler d1 list`.
2. Skapa databasen om den inte finns: `wrangler d1 create viva-impact-auth`.
3. Applicera migrationerna:

   ```bash
   # Mot lokal emulator
   wrangler d1 migrations apply viva-impact-auth --local

   # Mot en remote-miljö (t.ex. production)
   wrangler d1 migrations apply viva-impact-auth --remote
   ```

4. Vid behov av nya ändringar, skapa en migration med
   `wrangler d1 migrations create viva-impact-auth <namn>` och checka in filen i
   `db/migrations/`.

## Seed-data

Använd `db/seed/seed_allowed_google_accounts.sql` för att lägga till den första
administratören i en ny miljö. Uppdatera id, e-postadress och namn i filen och
kör sedan:

```bash
wrangler d1 execute viva-impact-auth --local --file=./db/seed/seed_allowed_google_accounts.sql
# eller mot remote
wrangler d1 execute viva-impact-auth --remote --file=./db/seed/seed_allowed_google_accounts.sql
```

Scriptet är idempotent och kan köras flera gånger. Säkerställ att kontot som
lägger till den första administratören har matchande e-postadress för Google
Identity Services.

## Miljövariabler

Följande variabler måste sättas i Pages/Workers-miljön:

- `GOOGLE_CLIENT_ID` – klient-ID för Google Identity Services som används i
  frontenden.

Frontenden använder följande variabler (t.ex. i `.env`):

```bash
VITE_AUTH_LOGIN_URL=/api/auth/sign-in
VITE_AUTH_VERIFY_URL=/api/auth/session
VITE_AUTH_LOGOUT_URL=/api/auth/sign-out
VITE_ADMIN_ACCOUNTS_URL=/api/admin/accounts
VITE_AUTH_DEV_PAUSE=false # valfri: sätt till true för att hoppa över auth i dev-läge
```

## Cloudflare Pages Functions

Autentiserings-API:t exponeras via Pages Functions i `functions/api/`:

- `POST /api/auth/sign-in` – verifierar Google ID-token och skapar session.
- `POST /api/auth/session` – validerar befintlig session och returnerar användare.
- `POST /api/auth/sign-out` – rensar sessionen.
- `GET/POST /api/admin/accounts` – hantera allow-listen (endast admin).
- `PUT/DELETE /api/admin/accounts/:id` – uppdatera eller ta bort konton.

Kom ihåg att deploya Pages-projektet tillsammans med uppdaterad `wrangler.toml`
och migrations för att hålla alla miljöer i synk.
