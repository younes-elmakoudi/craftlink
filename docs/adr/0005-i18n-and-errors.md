# ADR 0005: the backend sends codes, the frontend translates

**Status:** accepted

**Decision.** API errors carry a stable `code`; notifications are stored as `type + params`. Translation files are split per
feature and merged automatically.

**Why.** Texts in the database or in API messages cannot follow the user's language. Per-feature files mean two developers
never edit the same JSON file.

**Consequences.** Every new error code needs its translation keys in the same PR.
