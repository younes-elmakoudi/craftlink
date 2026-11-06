#!/bin/sh
# Container start-up: apply migrations, optionally seed demo data, start the API.
set -e

echo "[entrypoint] Applying database migrations..."
npx prisma migrate deploy

if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] Seeding demo data (idempotent)..."
  node dist/database/seed.js
fi

echo "[entrypoint] Starting API..."
exec node dist/main.js
