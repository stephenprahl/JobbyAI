#!/bin/sh
set -e

# Default PORT provided by Render
PORT=${PORT:-3001}
export PORT

echo "-> Running Prisma generate (if applicable)"
if [ -f ./prisma/schema.prisma ]; then
  bunx prisma generate || true
fi

# Run migrations in deploy mode (safe for production)
echo "-> Applying Prisma migrations (deploy)"
if [ -n "$DATABASE_URL" ]; then
  bunx prisma migrate deploy || true
else
  echo "-> DATABASE_URL not set; skipping migrations"
fi

# Start the server
echo "-> Starting server"
exec bun run src/server/index.ts
