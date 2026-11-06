# reviews

Rate and review a completed request, display reviews.

## Layout (follow it)
```
reviews/
├── routes.tsx      # route objects of this feature (already registered in app/router.tsx)
├── pages/          # one component per route
├── components/     # components used only by this feature
├── api.ts          # functions calling the backend + TanStack Query hooks
├── types.ts        # types of this feature
└── locales/        # en.json, fr.json, es.json  (namespace "reviews": useTranslation('reviews'))
```

## Rules
- Reuse components from `@/components/ui`; do not restyle them locally.
- Every visible text goes through `t()`; add keys to all three locale files of this feature.
- Server data: TanStack Query hooks in `api.ts`. No `fetch` inside components.
- Import other features only through their public exports, never deep paths.
