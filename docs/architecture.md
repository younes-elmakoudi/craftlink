# Architecture

## Big picture

```
 Browser (React SPA)
     │  HTTPS (https://localhost:8443)
     ▼
 ┌────────────────────────── nginx (container "web") ──────────────────────────┐
 │  /            → static files of the React build                              │
 │  /api/*       → proxy → backend:3000                                         │
 │  /socket.io/* → proxy (WebSocket upgrade) → backend:3000                     │
 └──────────────────────────────────────────────────────────────────────────────┘
                                     │ plain HTTP inside the Docker network
                                     ▼
                      ┌──────────── backend (NestJS) ────────────┐
                      │ controllers → services → PrismaService   │
                      │ Socket.IO gateway (same process)         │
                      └───────────────┬──────────────────────────┘
                                      ▼
                              PostgreSQL (container "db")
                              uploads volume (files)
```

Only nginx is exposed. The browser sees **one origin**, so there is no CORS in production and the auth cookie is first-party.

## Backend layers

| Layer | Role | Rule |
|---|---|---|
| Controller | HTTP: read input (DTO), call a service, return output | No business logic, no Prisma |
| Service | Business rules, transactions, calls Prisma | No `req`/`res`; throws `AppError(code, status)` |
| DTO | Shape and validation of input (class-validator) | One class per body/query; documented by the Swagger plugin |
| Prisma | Data access | Schema owned by the Tech Lead; use `$transaction` when several writes must succeed together |
| Gateway | WebSocket entry point | Emits events *after* the database commit |

Cross-module calls go through the other module's **service** (exported by its module), never through its tables
by copy-paste. `NotificationsService.create(...)` is the single way to create a notification.

## Key flows

**Authentication.** `POST /auth/login` verifies the argon2 hash and answers with a JWT in an httpOnly,
SameSite=Lax, Secure cookie. A guard reads the cookie on REST calls and on the Socket.IO handshake. The
frontend never sees or stores the token.

**Request status change.** `PATCH /requests/:id/status` → check the state machine and the actor → one
transaction (update + history + notification) → emit `request.statusChanged` and `notification.created`.

**Presence.** The gateway keeps an in-memory map `userId → number of sockets`. First socket = online, last socket
gone = offline (and `lastSeenAt` is saved). Single backend instance, so no Redis is needed.

## Frontend structure

```
src/
├── app/          providers, router (registers each feature's routes), layout
├── components/ui design system (no business logic)
├── features/<x>/ pages, components, api hooks, locales: one folder per business area
├── lib/          api client, socket, query client, helpers
├── i18n/         i18next setup + common translations
└── styles/       design tokens
```

Server state = TanStack Query. Local UI state = React state. No global store unless a real need appears.

## Internationalization

Three languages (en, fr, es). Backend never sends sentences: it sends error **codes** and notification
**types + params**; the frontend translates. Each feature owns `locales/{en,fr,es}.json`, merged automatically.

## Conventions that prevent merge conflicts

- Domain modules and feature routes are pre-registered: nobody edits `app.module.ts` or `router.tsx`.
- Each feature owns its folder and its locale files.
- Shared files (`schema.prisma`, `docker-compose.yml`, `package.json`, `src/common`, `src/lib`) are changed in
  small dedicated PRs, reviewed by the Tech Lead.
- Dependencies: adding an npm package = a short PR of its own (so the lock file never conflicts inside a feature PR).

## Decisions

See `docs/adr/`.
