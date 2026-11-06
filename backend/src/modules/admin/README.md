# admin

User management (CRUD, roles) and moderation of listings and reviews. Admin role only.

## Planned endpoints
All paths are prefixed by `/api`. Full request / response contract: `docs/api-contract.md`.

- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`
- `PATCH /admin/listings/:id/moderation`
- `PATCH /admin/reviews/:id/moderation`

## Folder layout (follow it)
```
admin/
├── admin.module.ts        # already registered in AppModule: do not touch AppModule
├── admin.controller.ts    # HTTP only: parse input, call the service, return output
├── admin.service.ts       # business rules and database access (Prisma)
├── dto/                    # one class per request body / query (class-validator + @nestjs/swagger)
└── *.spec.ts               # unit tests next to the code
```

## Rules
- Controllers contain no business logic; services never touch `req` / `res`.
- Throw `AppError` with a code from `src/common/error-codes.ts`.
- Protect routes explicitly; document every route with `@ApiTags` and `@ApiOperation`.
- Need to change another module's behaviour or the Prisma schema? Ask in the issue first.
