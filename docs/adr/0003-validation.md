# ADR 0003: validation libraries

**Status:** accepted

**Decision.** Backend request DTOs use `class-validator` (with the Swagger plugin). Environment variables use Zod.
Frontend forms use `react-hook-form` + Zod.

**Why.** With NestJS, class-validator DTOs are the idiomatic path and the Swagger plugin turns them into accurate API
documentation automatically, which is the contract the frontend relies on. Zod is the simplest tool for typed
environment parsing and for form schemas.

**Consequences.** Validation is always done on both sides (frontend for UX, backend for security).
