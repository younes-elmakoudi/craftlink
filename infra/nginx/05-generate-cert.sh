#!/bin/sh
# Runs automatically when the nginx container starts.
# Generates a self-signed certificate if none exists in /etc/nginx/certs.
# To use a locally TRUSTED certificate (no browser warning, needed for the PWA), create it
# with mkcert and put server.crt / server.key in infra/certs/ (see README).
set -e
CERT_DIR=/etc/nginx/certs
mkdir -p "$CERT_DIR"
if [ ! -f "$CERT_DIR/server.crt" ] || [ ! -f "$CERT_DIR/server.key" ]; then
  echo "[cert] Generating a self-signed certificate for localhost..."
  openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$CERT_DIR/server.key" -out "$CERT_DIR/server.crt" \
    -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
fi
