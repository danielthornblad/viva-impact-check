# D1 migrations och seedning

Den här applikationen använder Cloudflare D1 för att spara autentiseringsdata. För att hålla
miljöer i synk följer du samma flöde oavsett om du arbetar lokalt eller mot ett moln-
databas.

## 1. Konfigurera databindningen

1. Skapa en D1-databas i Cloudflare och kopiera dess `database_id`.
2. Uppdatera `wrangler.toml` med korrekt `database_id` (och eventuella miljö-specifika namn)
   under `[[d1_databases]]`.
3. Publicera känsliga variabler såsom `GOOGLE_CLIENT_ID` via `wrangler secret put` eller
   miljövariabler i CI. Standardvärdena i `wrangler.toml` är endast platshållare.

## 2. Kör migrationer

Migrationerna versioneras i `db/migrations/`. Använd Wranglers inbyggda kommandon för att
applicera dem:

```bash
# Lokalt mot en temporär SQLite-fil
wrangler d1 migrations apply DB --local

# Mot en fjärrdatabas (t.ex. staging)
wrangler d1 migrations apply DB --remote
```

`DB` är namnet på D1-bindningen som definieras i `wrangler.toml`. Kommandot ser till att
varje migration endast körs en gång per databas.

## 3. Ladda eventuell seed-data

Seed-skript placeras i `db/seed/`. Anropa dem med `wrangler d1 execute` så att seedningen
kan repeteras när nya miljöer sätts upp.

```bash
# Exempel: kör en SQL-seedfil mot den lokala databasen
d1_file="db/seed/local_seed.sql"
wrangler d1 execute DB --local --file "$d1_file"
```

Säkerställ att seedskript är idempotenta (de ska kunna köras flera gånger utan att skapa
inkonsekvent data).

## 4. Automatisk körning i CI/CD

Lägg till motsvarande `wrangler d1 migrations apply` och seed-kommandon i pipeline-steg för
staging/produktion så att nya miljöer automatiskt får rätt schema och data.
