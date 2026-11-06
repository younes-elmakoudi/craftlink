# components/ui, the design system

Reusable, feature-agnostic components. Rules:

1. **No business logic, no API calls**: only props in, UI out.
2. **Design tokens only** (`src/styles/tokens.css`): no hard-coded colors or sizes.
3. Every component has: variants (if useful), disabled / loading / error states when relevant, keyboard accessibility.
4. Every component is exported by `index.ts` and shown on the `/design-system` page.
5. `Button.tsx` is the reference implementation: copy its structure.

Target list: Button, Input, Select, Textarea, Modal, Card, Badge, Avatar, Toast, Tabs, Pagination, Spinner, EmptyState, Icon.
