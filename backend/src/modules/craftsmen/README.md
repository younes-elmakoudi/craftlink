# craftsmen

Craftsman profiles, listings, trades, availability and advanced search.

## Planned endpoints
All paths are prefixed by `/api`. Full request / response contract: `docs/api-contract.md`.

- `GET /trades`
- `GET /craftsmen`
- `GET /craftsmen/:id`
- `PATCH /craftsmen/me`
- `PATCH /craftsmen/me/availability`
- `POST /listings`
- `GET /listings/:id`
- `PATCH /listings/:id`
- `DELETE /listings/:id`
- `GET /craftsmen/:id/listings`

## Folder layout (follow it)
```
craftsmen/
├── craftsmen.module.ts        # already registered in AppModule: do not touch AppModule
├── craftsmen.controller.ts    # HTTP only: parse input, call the service, return output
├── craftsmen.service.ts       # business rules and database access (Prisma)
├── dto/                    # one class per request body / query (class-validator + @nestjs/swagger)
└── *.spec.ts               # unit tests next to the code
```

## Rules
- Controllers contain no business logic; services never touch `req` / `res`.
- Throw `AppError` with a code from `src/common/error-codes.ts`.
- Protect routes explicitly; document every route with `@ApiTags` and `@ApiOperation`.
- Need to change another module's behaviour or the Prisma schema? Ask in the issue first.
