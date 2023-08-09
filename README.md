
# KMH-Testapplication

Das Ziel der Testaufgabe war es ein simples Frontend und Backen zu entwickeln, dass eine Nutzervarwaltung darstellt.
Da ein Nutzer ohne weiteren Anwendungsfall keine vielfältigen Permission-Scopes soll das Projekt von mir um eine Blogpostverwaltung erweitert werden.

Da es an einer der wichtigsten Stellen bei der Entwicklung der Api gescheitert ist konnte das Projekt nicht abgeschlossen werden und zog sich in die Länge.

Gescheitert ist es an der Integration eines komplexen Filtersystems, das dem von [Directus](https://docs.directus.io/reference/filter-rules.html) nachempfunden ist.

## Technologien / Tools
- Node.js
- TypeScript
- fastify
- knex
- postgres
- docker
- Vue / Quasar
- Insomnia

## Entwicklungsstrategien
- API-first
- Monorepo

## API
Die API und die Controller sind stark denen aus dem Directus Projekt nachempfunden.
Jedoch in schlankerer Form. Bspw. entfällt Ausgabe von 02M/M2M relationalen Objekten. Die API kann mittels des Insomnia Clients getestet werden hierfür muss die Repository mit dem Klient geklont werden.

## Lokale installation

### Voraussetzungen
- Node V18 & npm
- Docker & docker-compose CLI

#### Anleitung
Klonen der Repository

`git clone https://github.com/bytesnackscgn/kmh-testapplication.git`

Kopieren der .env.example

`cp .env.example .env.development && cp .env.example .env.staging && cp .env.example .env.production`

Befüllen aller Umgebungsvariabeln

`...`

Installieren von npm Packages

`cd api && npm install --save && cd ../app && npm install --save && cd ..`

Container mit Postgres Image hochfahren

`chmod +x ./docker/start-db.sh && sh ./docker/start-db.sh ../.env.development`

Datenbankmigrationen durchführen. Das beinhaltet auch das initiale aufsetzen aller Tabellen.

`cd api && npm run db:migrate`

Beispieldaten und defaults einspielen
Das Seeding erstellt die Rollen admin editor und guest.
Erstellt 4 Benutzer (admin, editor, gast und einen user der den status suspended hat)

`npm run db:seed`

Starten des api dev servers

`npm run dev`

Öffnen eines weiteren Terminal. Navigiere zu app und führe folgenden befehl aus um aus um auch den dev server für die Frontendumgebung zu Starten

`npm run dev`

## Deployement
Eine vorgesehene Deployement Strategie mittels Containerisierung der einzelnen Services konnte leider bisher nicht integriert werden.

