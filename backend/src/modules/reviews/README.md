# reviews

Rating and review of a completed request, rating recomputation.

## Planned endpoints
All paths are prefixed by `/api`. Full request / response contract: `docs/api-contract.md`.

- `POST /requests/:id/review`
- `GET /craftsmen/:id/reviews`

## Folder layout (follow it)
```
reviews/
├── reviews.module.ts        # already registered in AppModule: do not touch AppModule
├── reviews.controller.ts    # HTTP only: parse input, call the service, return output
├── reviews.service.ts       # business rules and database access (Prisma)
├── dto/                    # one class per request body / query (class-validator + @nestjs/swagger)
└── *.spec.ts               # unit tests next to the code
```

## Rules
- Controllers contain no business logic; services never touch `req` / `res`.
- Throw `AppError` with a code from `src/common/error-codes.ts`.
- Protect routes explicitly; document every route with `@ApiTags` and `@ApiOperation`.
- Need to change another module's behaviour or the Prisma schema? Ask in the issue first.
