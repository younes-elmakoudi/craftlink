# auth

Registration, login/logout, JWT cookie, current user, OAuth, role selection after first OAuth login.

## Planned endpoints
All paths are prefixed by `/api`. Full request / response contract: `docs/api-contract.md`.

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /auth/github`
- `GET /auth/github/callback`
- `POST /auth/oauth/complete`

## Folder layout (follow it)
```
auth/
├── auth.module.ts        # already registered in AppModule: do not touch AppModule
├── auth.controller.ts    # HTTP only: parse input, call the service, return output
├── auth.service.ts       # business rules and database access (Prisma)
├── dto/                    # one class per request body / query (class-validator + @nestjs/swagger)
└── *.spec.ts               # unit tests next to the code
```

## Rules
- Controllers contain no business logic; services never touch `req` / `res`.
- Throw `AppError` with a code from `src/common/error-codes.ts`.
- Protect routes explicitly; document every route with `@ApiTags` and `@ApiOperation`.
- Need to change another module's behaviour or the Prisma schema? Ask in the issue first.
