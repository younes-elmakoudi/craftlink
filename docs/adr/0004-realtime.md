# ADR 0004: one WebSocket gateway, presence in memory

**Status:** accepted

**Decision.** A single Socket.IO gateway inside the backend process serves real-time updates, notifications, chat and
presence. Rooms are per user (`user:<id>`). Presence is an in-memory map. No Redis.

**Why.** One backend instance is enough for this project; Redis would add a service to run, secure and explain without
adding value. Everything real-time shares one connection and one authentication path.

**Consequences.** Not horizontally scalable as is (documented limitation). Events are emitted after the database commit.
