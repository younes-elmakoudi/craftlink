# syntax=docker/dockerfile:1
# Multi-stage build: small final image, no dev dependencies, runs as non-root.

FROM node:22-bookworm-slim AS base
WORKDIR /app
# Prisma needs OpenSSL at runtime. We use Debian (not Alpine) so argon2 installs without compiling.
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# 1) all dependencies (needed to build)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) compile TypeScript
FROM deps AS build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build

# 3) production dependencies only
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

# 4) final image
FROM base AS runtime
ENV NODE_ENV=production
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh \
 && mkdir -p uploads \
 && chown -R node:node /app
USER node
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
