# Contributing to CraftLink

This is how we work. It exists so five people can build one product in parallel without stepping on each other.
Read it once fully, then keep the [cheat-sheet](#cheat-sheet) at hand.

## 1. One-time setup

```bash

git clone https://github.com/younes-elmakoudi/craftlink.git
cd craftlink
make setup          # creates .env, installs dependencies
make up             # full stack on https://localhost:8443  (see README for local dev with hot reload)
```

Accept the repository invitation you received by email / on GitHub, and install the recommended VS Code extensions
(`.vscode/extensions.json`).

## 2. The golden rules

1. **`main` always works.** It is protected: nobody pushes to it, everything arrives through a reviewed pull request.
2. **One issue = one branch = one pull request.** Small, focused, mergeable in a day.
3. **Everything starts from an issue** with acceptance criteria. No issue, no work (ask for one).
4. **Stay inside your area.** Each feature has its own folder, so there are no conflicts. Need a change in a shared file? Small dedicated PR.
5. **If it is not green, it does not merge.** CI must pass.
6. **Never commit secrets** (`.env`, keys, passwords, personal data).
7. **Ask early.** Blocked for more than 30 minutes? Say it in the team channel.

## 3. Daily routine

1. Morning: `git switch main && git pull`, look at the board, pick or continue an issue.
2. Work in your branch, commit small and often, push at least at the end of the day (a pushed branch is a backed-up branch).
3. Before opening a PR: merge the latest `main` into your branch, run `make check`.
4. Review at least one teammate's PR per day: **reviews are part of your job, not a favour.**

## 4. Branches

Branch from an up-to-date `main`. Name: `type/short-description` in lowercase with hyphens.

| Prefix | Use | Example |
|---|---|---|
| `feat/` | new feature | `feat/chat-send-message` |
| `fix/` | bug fix | `fix/request-status-transition` |
| `refactor/` | restructuring, no behaviour change | `refactor/search-query-builder` |
| `chore/` | tooling, dependencies, config | `chore/add-react-hook-form` |
| `docs/` | documentation | `docs/readme-instructions` |
| `test/` | tests only | `test/health-controller` |

```bash
git switch main && git pull
git switch -c feat/chat-send-message
```

Delete your branch after the merge (GitHub does it for you; locally: `git branch -d <name>`).

## 5. Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description in the imperative, lowercase, no final dot
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `build`, `ci`.

**Scopes** (the area you touch): `auth`, `users`, `craftsmen`, `requests`, `reviews`, `friends`, `chat`, `notifications`,
`uploads`, `admin`, `realtime`, `i18n`, `ui`, `pwa`, `db`, `infra`, `ci`, `docs`, `deps`.

| Good | Bad |
|---|---|
| `feat(requests): add status transition endpoint` | `update` |
| `fix(chat): prevent sending to non-friends` | `fix bug` |
| `feat(ui): add Modal component` | `Added modal and also fixed some things` |
| `chore(deps): add react-hook-form` | `changes` |

Rules: one logical change per commit · the message says **what and why**, not "wip" · never commit generated or
local files (`node_modules`, `dist`, `.env`, `uploads`).

Optional body for context:

```
feat(requests): add status transition endpoint

Enforces the state machine in docs/api-contract.md. The status update, the history
row and the notification are written in a single transaction.
```

## 6. Pull requests

- **Title** = `type(scope): description`. It becomes the commit message on `main` (squash merge), and CI checks it.
- **Description:** what and why, how to test, screenshots for UI. Write `Closes #<issue number>`.
- **Size:** aim for under ~400 changed lines. Bigger? Split it.
- **Before opening:** `make check` passes, no console errors, texts in the 3 locale files, no leftover `console.log`.
- **Draft PR:** open early as *Draft* if you want feedback on direction.
- **Merge:** after CI is green, **1 approval** and all conversations resolved → **Squash and merge**. You merge your own PR once approved.
- Do not push new commits after approval without telling the reviewer (the approval is dismissed anyway).

### Keeping your branch up to date

```bash
git fetch origin
git merge origin/main        # resolve conflicts if any, run make check, then:
git push
```

### Resolving a conflict (do not panic)

1. `git merge origin/main` stops and lists conflicted files.
2. Open each file, find `<<<<<<<`, `=======`, `>>>>>>>`, keep the right content (talk to the other author if unsure), delete the markers.
3. `git add <file>` for each, then `git commit` (the default message is fine).
4. Run `make check`, push.

Conflicts are rare if you stay in your own folders. If one appears in a **shared** file, tell the Tech Lead.

## 7. Code review

**As the author:** keep the PR small, explain it, answer comments, push fixes as new commits, resolve the threads you handled.

**As the reviewer** (check within a few hours, not days):

- Does it do what the issue asks (acceptance criteria)? Pull the branch and try it.
- Is it readable? Naming, small functions, no dead code, no duplicated logic.
- Backend: validation on the DTO, authorization checks (who is allowed?), errors use `AppError`, transactions where several writes go together.
- Frontend: uses `components/ui`, handles loading / error / empty states, no hard-coded texts or colors.
- Security: no secret, no trusting the client, no sensitive data in logs.
- Be kind and specific: *"What do you think about extracting this into a function?"* beats *"this is bad"*. Approve when it is good enough, not perfect.

## 8. Shared files: special rules

| File / folder | Rule |
|---|---|
| `backend/prisma/schema.prisma` + `migrations/` | Tech Lead owns it. Ask in the issue, then a dedicated PR `feat(db): ...` including the migration. **Never edit a migration already on `main`**: create a new one |
| `package.json` / lock files | Adding a dependency = a short PR of its own (`chore(deps): add x`), never inside a feature PR |
| `docker-compose.yml`, `infra/`, `.github/` | Small PR, Tech Lead reviews |
| `backend/src/common/`, `frontend/src/lib/` | Shared helpers: small PR, explain why |
| `docs/api-contract.md` | Update it when you change an endpoint, in the same PR |

## 9. Conventions

**Backend**
- Controller = HTTP only. Service = business logic. Never use Prisma in a controller.
- One DTO class per body/query, with `class-validator` decorators (unknown fields are rejected).
- Throw `AppError('CODE', status)`; add new codes to `error-codes.ts` and to the 3 frontend translation files.
- Several writes that must succeed together → `prisma.$transaction`.
- Document each route (`@ApiTags`, `@ApiOperation`).

**Frontend**
- Server data through TanStack Query hooks in the feature's `api.ts`; no `fetch` in components.
- Visible text through `t()`; keys in the feature's `locales/{en,fr,es}.json`.
- Style with design tokens and `components/ui`; no raw hex colors in features.
- Forms: `react-hook-form` + Zod; show field errors from the backend (`details`).
- Every screen handles loading, error and empty states.

**Both**
- TypeScript: no `any` unless unavoidable (and commented).
- No `console.log` left in committed code.
- Prettier formats the code (`make format`); the editor does it on save.

## 10. Definition of done

A task is done when: acceptance criteria met · works locally and in Docker · `make check` green · no console error or warning ·
texts translated · API docs updated · reviewed and merged · the issue is closed (moves to **Done** automatically).

## 11. Things you must never do

- `git push --force` on a shared branch, or any push to `main`
- Commit `.env`, secrets, `node_modules`, build output, uploads, personal data
- Edit someone else's feature folder without talking to them
- Merge your own PR without approval, or bypass CI
- Leave a PR waiting for review for more than a day without pinging

## Cheat-sheet

```bash
git status                         # what changed?
git switch main && git pull        # update main
git switch -c feat/x               # new branch
git add -p                         # stage chosen parts (review what you commit)
git commit -m "feat(x): ..."       # commit
git fetch origin && git merge origin/main   # bring main into your branch
git push -u origin feat/x          # first push of the branch
git push                           # next pushes
git log --oneline --graph -15      # recent history
git restore <file>                 # discard local changes of a file
git stash / git stash pop          # put changes aside / bring them back
```
