# realtime

WebSocket gateway (Socket.IO): authentication, rooms, presence, event emission. Owned by the Tech Lead.

## Planned endpoints
All paths are prefixed by `/api`. Full request / response contract: `docs/api-contract.md`.

- `WS events: see docs/api-contract.md`

## Folder layout (follow it)
```
realtime/
├── realtime.module.ts        # already registered in AppModule: do not touch AppModule
├── realtime.controller.ts    # HTTP only: parse input, call the service, return output
├── realtime.service.ts       # business rules and database access (Prisma)
├── dto/                    # one class per request body / query (class-validator + @nestjs/swagger)
└── *.spec.ts               # unit tests next to the code
```

## Rules
- Controllers contain no business logic; services never touch `req` / `res`.
- Throw `AppError` with a code from `src/common/error-codes.ts`.
- Protect routes explicitly; document every route with `@ApiTags` and `@ApiOperation`.
- Need to change another module's behaviour or the Prisma schema? Ask in the issue first.
