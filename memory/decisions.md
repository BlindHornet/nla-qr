# Architectural Decisions

Tracks the "why" behind major choices. When Claude sees a decision here,
it should not suggest changing it without a strong reason.

---

## Format

```
### [Decision title]
**Date:** YYYY-MM-DD
**Decision:** What was chosen
**Alternatives considered:** What else was evaluated
**Reason:** Why this was chosen over the alternatives
**Consequences:** What this means going forward
```

---

## Decisions

### State Management — React Context (no external library)

**Date:** Project start
**Decision:** Use React Context + useReducer for global state
**Alternatives considered:** Zustand, Redux Toolkit, Jotai
**Reason:** App complexity doesn't justify an external library. Context is sufficient and keeps the dependency list small.
**Consequences:** If state logic grows significantly, revisit Zustand. For now, keep it simple.

### Styling — Tailwind CSS v4 utility-first, no component library

**Date:** Project start
**Decision:** Tailwind CSS v4 only — no shadcn, no Radix, no MUI
**Alternatives considered:** shadcn/ui, MUI, Chakra
**Reason:** Full control over design. No dependency on third-party component APIs. Faster to customize.
**Consequences:** Must build all UI components from scratch. Invest time in a small internal component library as the project grows.

### Build Tool — Vite

**Date:** Project start
**Decision:** Vite for dev server and production build
**Alternatives considered:** Create React App (deprecated), Next.js
**Reason:** Fastest dev server, native ESM, no server-side rendering needed for this project.
**Consequences:** All env vars must use `import.meta.env.VITE_*` prefix.

<!-- Add new decisions above this line -->
