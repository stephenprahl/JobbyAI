# Render deployment (step-by-step)

This file contains a compact, copy-ready guide to deploy the Elysia backend to Render using Docker.

Overview

- The backend code lives in `src/server` and uses Prisma for database migrations.
- The repository includes a `Dockerfile` which runs `bun install`, compiles TypeScript, runs Prisma migrations (`prisma migrate deploy`) and starts the Elysia server.

Steps

1) Create the Render service

- In Render: New -> Web Service -> Connect GitHub repo -> Choose Docker
- Use `main` (or your primary branch) and allow Render to build the Dockerfile at the repo root.

2) Create/attach a Postgres database

- In Render: Databases -> Create PostgreSQL (starter) or attach an external Postgres
- Copy the provided connection string (Render will give you a `DATABASE_URL`)

3) Add environment variables to the Render service

- `DATABASE_URL` = (Render Postgres URL)
- `JWT_SECRET` = (secure random string)
- `FRONTEND_URL` = `https://jobby-ai-lovat.vercel.app`
- `CORS_ORIGIN` = `https://jobby-ai-lovat.vercel.app`
- Optional mail settings: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
- Optional: `GOOGLE_GEMINI_API_KEY`

4) Build & Deploy

- Trigger a deploy in Render. The Docker image build will run the Dockerfile and start the container.
- The container runs `bunx prisma migrate deploy` at startup which applies pending migrations.

5) Smoke tests

- Health check:

```bash
curl -sS https://<your-render-service>.onrender.com/api/health | jq
```

- Registration test (create a test user):

```bash
curl -i -H "Content-Type: application/json" \
  -d '{"email":"render-test+1@example.com","password":"TestPass123!"}' \
  https://<your-render-service>.onrender.com/api/auth/register
```

6) Switch frontend to Render

- In the Vercel project settings (Environment Variables), set:
  - `VITE_API_BASE_URL` = `https://<your-render-service>.onrender.com/api`
- Re-deploy the frontend so the new value is baked into the build.

Optional: use the Vercel proxy as a transitional step

- There's a proxy at `api/proxy/[...path].ts` you can use while rolling out the full backend.
- To use it temporarily:
  - Set Vercel env `BACKEND_URL` = `https://<your-render-service>.onrender.com`
  - Set Vercel env `VITE_API_BASE_URL` = `https://jobby-ai-lovat.vercel.app/api/proxy`
  - Re-deploy the frontend. Calls to `/api/auth/*` will be forwarded to the Render backend.

Optional: remove demo Vercel handler

- The repository includes a demo `api/auth/register.ts` that returns a demo user for Vercel serverless runtime.
- If you want the frontend to always call the real backend, I can remove this demo file (or make it a proxy) — tell me which.

Notes and troubleshooting

- If Prisma migrations fail due to shadow DB errors (examples: enums/types already exist), the safe fallback is:
  1. Create a SQL migration manually that performs the ALTER / DROP steps, then run `prisma db execute --file=...` to apply it.
  2. Run `prisma migrate resolve --applied <migration-name>` to mark the migration applied.
  (This repo already contains a manual migration to drop `firstName` / `lastName` added earlier.)

- If Render build fails due to missing environment variables, check the build and runtime env separately — Render exposes separate settings for build-time and runtime envs.

If you'd like I can now:

- Remove the demo `api/auth/register.ts` and replace it with a proxy that forwards to the Render backend, or
- Keep the demo endpoint and instead update the Vercel env + frontend to use the Render backend directly.

Which should I do next?
