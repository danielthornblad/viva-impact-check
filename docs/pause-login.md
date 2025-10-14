# Pausa inloggningen i en Cloudflare Pages-deploy

Den här guiden beskriver hur du tillfälligt stänger av inloggningen i Viva
Impact-frontenden genom att aktivera den inbyggda pausfunktionen. Guiden är
skriven för nybörjare och utgår från att du deployar projektet via Cloudflare
Pages.

## Översikt

Frontenden läser miljövariabeln `VITE_AUTH_PAUSE`. När den är satt till ett
"sant" värde (t.ex. `true`) hoppar klienten över alla anrop mot
autentiserings-API:t, loggar in en stubbanvändare lokalt och visar en banner som
påminner om att inloggningen är pausad. När variabeln tas bort eller sätts till
`false` återgår allt till det normala.

## Steg-för-steg i Cloudflare Pages

1. **Logga in i Cloudflare**
   - Gå till [dash.cloudflare.com](https://dash.cloudflare.com) och logga in med
ditt konto.
   - Välj kontot och projektet som hör till Viva Impact.

2. **Öppna projektets Pages-inställningar**
   - Navigera till *Pages* i sidmenyn och klicka på ditt projekt.

3. **Gå till "Environment Variables"**
   - Under fliken *Settings*, scrolla ner till avsnittet *Environment Variables*.
   - Klicka på *Edit variables* för den miljö du vill uppdatera (t.ex. *Production*
eller *Preview*).

4. **Lägg till eller uppdatera variabeln**
   - Klicka på *Add variable*.
   - Sätt **Name** till `VITE_AUTH_PAUSE`.
   - Sätt **Value** till `true` (andra värden som `1`, `yes` eller `on` fungerar
     också).
   - Spara ändringen.

5. **Trigga en ny deploy**
   - När miljövariabler ändras behöver Pages bygga om projektet.
   - Klicka på *Save and deploy* om dialogen erbjuder det, eller gå till fliken
     *Deployments* och starta en ny deploy manuellt (t.ex. genom att trycka på
     *Retry deployment* på den senaste byggnaden).

6. **Verifiera resultatet**
   - När den nya deployen är klar, öppna sidan i webbläsaren.
   - Du ska nu se en gul banner med texten "Autentisering är pausad" och du kan
     använda gränssnittet utan att behöva logga in.

## Återaktivera inloggningen

1. Följ samma steg som ovan för att öppna *Environment Variables*.
2. Ta bort variabeln `VITE_AUTH_PAUSE` eller sätt värdet till `false`.
3. Spara och trigga en ny deploy.
4. När deployen är klar krävs inloggning igen som vanligt.

> **Tips:** Behåll gärna ett internt anteckningsdokument där du noterar varför
> inloggningen pausades och när den ska aktiveras igen, så att inget råkar glömmas
> bort.

## Vanliga frågor

- **Påverkas API:et eller backend-sessioner?**
  Nej, pausläget sker helt i frontenden. Backend fortsätter fungera men får inga
  autentiseringsanrop från webben så länge flaggan är aktiv.
- **Måste jag göra en kodändring för att pausa?**
  Nej, allt styrs via miljövariabler. Det räcker med att uppdatera
  `VITE_AUTH_PAUSE` i Cloudflare.
- **Fungerar detta i lokala miljöer?**
  Ja, sätt `VITE_AUTH_PAUSE=true` i din `.env` eller använd den tidigare flaggan
  `VITE_AUTH_DEV_PAUSE=true` för att bara aktivera pausen när Vite körs i dev-läge.

