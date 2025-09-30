# Server

## Database & Prisma

- Ensure Postgres is running:

```
cd server
cp .env.example .env
docker compose up -d
```

- Install deps once (Node LTS recommended):

```
cd server
npm i
```

- Prisma commands:

```
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

Deno runs the app and imports Prisma Client via `npm:`. Prisma CLI (generate/migrate/studio) runs with Node.

## Run Deno server

```
deno task start
```

GET `/tests` to read, POST `/seed` to insert a row.
