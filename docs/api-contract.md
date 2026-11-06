# API contract

Frontend and backend agree on this document **before** writing code. The live, always-correct version
is Swagger (`/api/docs`); this file is the plan and the rules. If an endpoint changes, update both in the same PR.

## Conventions

| Topic | Rule |
|---|---|
| Base path | `/api` (nginx and the Vite dev proxy forward it to the backend) |
| Format | JSON; dates are ISO 8601 UTC strings; ids are UUID strings |
| Authentication | JWT in an **httpOnly cookie** set by `POST /auth/login`. The browser sends it automatically (`credentials: 'include'`) |
| Naming | plural nouns, lowercase, no verbs in paths (`/requests`, not `/getRequests`) |
| Lists | `?page=1&pageSize=20` → `{ items, page, pageSize, total }` |
| Success codes | `200` read/update, `201` create, `204` delete or no body |
| Errors | always `{ statusCode, code, message, details?, path, timestamp }`. The frontend translates `code` (`errors.<CODE>`); `details` for validation = `{ field: [messages] }` |
| Validation | unknown fields are rejected (`400 VALIDATION_ERROR`) |

Error codes: see `backend/src/common/error-codes.ts`. Add a code there **and** its translations in
`frontend/src/i18n/locales/*.json` in the same PR.

## Roles

`GUEST` (not logged in) · `CUSTOMER` · `CRAFTSMAN` · `ADMIN`. "Auth" below is the minimum requirement.

## Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create account `{ email, password, displayName, role: CUSTOMER\|CRAFTSMAN }`, logs in |
| POST | `/auth/login` | public | `{ email, password }` → user, sets cookie |
| POST | `/auth/logout` | any | Clears the cookie (`204`) |
| GET | `/auth/me` | any | Current user (`401` if not logged in) |
| GET | `/auth/github` | public | Starts the OAuth flow |
| GET | `/auth/github/callback` | public | OAuth callback, then redirects to the app |
| POST | `/auth/oauth/complete` | logged in | First OAuth login: choose the role `{ role }` |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/:id` | any | Public profile (name, avatar, role, online status for friends) |
| PATCH | `/users/me` | any | Update `displayName`, `phone`, `preferredLanguage` |

### Craftsmen, listings, trades
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/trades` | public | All trades |
| GET | `/craftsmen` | public | Search. Query: `query`, `trade`, `city`, `minRating`, `available`, `minPrice`, `maxPrice`, `sort` (`rating`\|`price`\|`recent`), `page`, `pageSize` |
| GET | `/craftsmen/:id` | public | Profile with rating and listings |
| PATCH | `/craftsmen/me` | CRAFTSMAN | Update `bio`, `city` |
| PATCH | `/craftsmen/me/availability` | CRAFTSMAN | `{ isAvailable }` (emits a realtime event) |
| GET | `/craftsmen/:id/listings` | public | Listings of a craftsman |
| POST | `/listings` | CRAFTSMAN | Create a listing |
| GET | `/listings/:id` | public | Listing detail |
| PATCH | `/listings/:id` | owner | Update |
| DELETE | `/listings/:id` | owner | Delete (`204`) |

### Requests (service request lifecycle)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/requests` | CUSTOMER | `{ listingId, title, description, address, city, preferredDate? }`. `409 REQUEST_CRAFTSMAN_UNAVAILABLE` if the craftsman is not available |
| GET | `/requests` | logged in | My requests (customer: the ones I sent; craftsman: the ones I received). `?status&page&pageSize`. Also serves the job history |
| GET | `/requests/:id` | participant | Detail |
| PATCH | `/requests/:id/status` | participant | `{ status }`, see the state machine below |
| GET | `/requests/:id/history` | participant | Status history |

**State machine** (anything else = `409 REQUEST_INVALID_TRANSITION`, nothing is written):

| From | To | Who |
|---|---|---|
| PENDING | ACCEPTED, DECLINED | craftsman of the request |
| PENDING | CANCELLED | customer of the request |
| ACCEPTED | IN_PROGRESS | craftsman |
| ACCEPTED | CANCELLED | customer |
| IN_PROGRESS | COMPLETED | craftsman |

Every transition runs in **one database transaction**: update status + insert history row + create the other
party's notification. The realtime event is emitted after the commit.

### Reviews
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/requests/:id/review` | customer of the request | `{ rating 1-5, comment? }`. Only when `COMPLETED`, once (`403 REVIEW_NOT_ALLOWED`). Recomputes the craftsman's average rating |
| GET | `/craftsmen/:id/reviews` | public | Visible reviews, paginated |

### Friends
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/friends` | logged in | Accepted friends with `online` flag |
| GET | `/friends/requests` | logged in | Incoming pending requests |
| POST | `/friends/requests` | logged in | `{ addresseeId }` (`409 FRIENDSHIP_ALREADY_EXISTS`) |
| PATCH | `/friends/requests/:id` | addressee | `{ action: 'accept'\|'decline' }` |
| DELETE | `/friends/:userId` | logged in | Remove a friend (`204`) |

### Chat
**Who can chat**: `canChat(a, b)` is true when `a ≠ b`, both accounts are active, and either they are accepted friends
or they share a service request (one is the customer, the other the craftsman). Otherwise `403 CHAT_NOT_ALLOWED`.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/chat/conversations` | logged in | My conversations with last message and unread count |
| POST | `/chat/conversations` | logged in | `{ userId }` → get or create (checks `canChat`) |
| GET | `/chat/conversations/:id/messages` | participant | `?cursor&limit` (newest first) |
| POST | `/chat/conversations/:id/messages` | participant | `{ content }` (the socket event `message.send` calls the same service) |
| POST | `/chat/conversations/:id/read` | participant | Marks incoming messages as read |

### Notifications
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | logged in | `?unread=true&page&pageSize` |
| GET | `/notifications/unread-count` | logged in | `{ count }` |
| PATCH | `/notifications/:id/read` | owner | Mark one as read |
| POST | `/notifications/read-all` | logged in | Mark all as read |

A notification is `{ id, type, params, requestId?, readAt, createdAt }`. **No text is stored**: the frontend builds the
sentence from `type` + `params` and translates it.

### Uploads
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/uploads/avatar` | logged in | multipart field `file`; replaces the current avatar |
| POST | `/uploads/portfolio/:listingId` | listing owner | multipart `file` |
| POST | `/uploads/request/:requestId` | participant | multipart `file` |
| GET | `/uploads/:id` | allowed users | Streams the file (access control) |
| DELETE | `/uploads/:id` | owner | `204` |

Rules: `image/jpeg`, `image/png`, `image/webp` only; max `MAX_UPLOAD_MB` (default 5). Errors: `UPLOAD_INVALID_TYPE`, `UPLOAD_TOO_LARGE`.

### Admin (ADMIN only)
| Method | Path | Description |
|---|---|---|
| GET | `/admin/users` | `?role&query&page&pageSize` |
| PATCH | `/admin/users/:id` | Change `role`, `status`, profile fields |
| DELETE | `/admin/users/:id` | Delete a user (`204`) |
| PATCH | `/admin/listings/:id/moderation` | `{ status: VISIBLE\|HIDDEN, reason? }` |
| PATCH | `/admin/reviews/:id/moderation` | `{ status: VISIBLE\|HIDDEN, reason? }` |

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | public | `{ status, database, uptime }` |

## Realtime events (Socket.IO)

Connection: same origin, path `/socket.io`, cookie authentication. After connecting, the server puts the socket in
the room `user:<userId>`; every event below is sent to the room(s) listed.

**Server → client**
| Event | Room | Payload |
|---|---|---|
| `request.created` | craftsman | `{ requestId }` |
| `request.statusChanged` | customer + craftsman | `{ requestId, status, previousStatus }` |
| `notification.created` | recipient | `{ notification }` |
| `presence.changed` | each friend | `{ userId, online }` |
| `friend.requested` / `friend.accepted` | recipient | `{ friendshipId, userId }` |
| `message.received` | recipient | `{ message }` |
| `message.read` | sender | `{ conversationId, readerId }` |

**Client → server**
| Event | Payload | Acknowledgement |
|---|---|---|
| `message.send` | `{ toUserId, content }` | `{ ok: true, message }` or `{ ok: false, code }` |
| `message.read` | `{ conversationId }` | `{ ok: true }` |

## Changing the contract
1. Open or update the issue; 2. change this file + Swagger decorators; 3. tell the other side in the PR.
Never change the meaning of an existing field silently: add a new one.
