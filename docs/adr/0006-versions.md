# ADR 0006: pinned major versions

**Status:** accepted

**Decision.** NestJS 11 and Prisma 6 (classic client), React 19, Vite, Tailwind CSS 4, TanStack Query 5, Node 22.

**Why.** Newer majors of some tools exist, but the team is new to this stack: the previous, widely documented majors have
far more tutorials, answers and examples. Stability beats novelty for a short project.

**Consequences.** Do not upgrade a major version during the project. Dependency changes go through their own PR.
