# syntax=docker/dockerfile:1
# Build context = repository ROOT (see docker-compose.yml), so the image can use infra/nginx.

# 1) build the static site
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) nginx: serves the site over HTTPS and proxies /api and /socket.io to the backend
FROM nginx:1.27-alpine
RUN apk add --no-cache openssl
COPY infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/05-generate-cert.sh /docker-entrypoint.d/05-generate-cert.sh
RUN chmod +x /docker-entrypoint.d/05-generate-cert.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 443
