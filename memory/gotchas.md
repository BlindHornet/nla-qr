# Known Gotchas

## Tailwind CSS v4

- Config is now in CSS via `@import "tailwindcss"` and `@theme {}` — NO tailwind.config.js
- `bg-opacity-*` is removed — use `bg-black/50` syntax instead
- Arbitrary values still work but prefer design tokens in `@theme`
- JIT is always on — no purge config needed

## Vite

- Use `import.meta.env.VITE_*` for env vars — not `process.env`
- Dynamic imports for code splitting: `lazy(() => import('./Page'))`
- `vite.config.ts` aliases: set `@/` → `src/` for clean imports

## React 18

- `StrictMode` double-invokes effects in dev — expected behavior
- `useEffect` cleanup is critical — always return cleanup for subscriptions
