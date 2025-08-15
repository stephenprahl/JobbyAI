Render deployment notes

- This repo contains a Dockerfile that uses Bun. Render will detect the Dockerfile and build a container.
- The `bin/start.sh` script runs `prisma generate`, attempts `prisma migrate deploy` if `DATABASE_URL` is set, then starts the server with `bun run src/server/index.ts`.

Required environment variables (set in Render Web Service settings):

- DATABASE_URL (Postgres connection string)
- JWT_SECRET
- FRONTEND_URL (e.g., <https://jobby-ai-lovat.vercel.app>)
- CORS_ORIGIN
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
- GOOGLE_GEMINI_API_KEY (if using Gemini)

Tips:

- Make sure to set the `PORT` env var if you want a non-default port; Render sets this automatically.
- If you prefer Render's automated Node build instead of Docker, the `render.yaml` contains build/start commands using `bunx`. However, Bun is best packaged via Docker to ensure runtime parity.
