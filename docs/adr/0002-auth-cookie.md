# ADR 0002: JWT in an httpOnly cookie

**Status:** accepted

**Decision.** The access token is a JWT stored in an httpOnly, Secure, SameSite=Lax cookie. Passwords are hashed with argon2.

**Why.** JavaScript cannot read the cookie, which removes the main theft route (XSS reading localStorage). The same cookie
authenticates REST calls and the Socket.IO handshake. With a single origin behind nginx, SameSite=Lax also limits CSRF.

**Consequences.** The frontend uses `credentials: 'include'`. In local development without HTTPS, `COOKIE_SECURE=false`.
