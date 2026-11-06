# ADR 0001: one repository, GitHub Flow, squash merge

**Status:** accepted

**Decision.** One monorepo (`backend/`, `frontend/`, `infra/`, `docs/`). Single long-lived branch `main`, always
working. All work happens in short-lived branches merged by pull request with **squash merge** only.

**Why.** Small team and short deadline: the simplest model with the fewest ways to go wrong. A monorepo keeps the API
contract, the schema and the UI in one review. Squash gives one clean Conventional Commit per PR (the PR title) and keeps
each author's attribution.

**Consequences.** `main` is protected (PR + 1 approval + CI). No direct pushes. PR titles are validated by CI.
