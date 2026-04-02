---
allowed-tools: ReadFile, ls, Bash(find:*), EditFile(tasks/todo.md)
description: Technical architecture and phased implementation strategy
---

## Your Task

Act as a Lead Systems Architect. Analyze the codebase and the user's request to create a bulletproof implementation plan. **Do not write any application code.**

### Execution Steps

1. **Discovery:** Use `ls` and `ReadFile` to audit the current Supabase schemas, types, and React components related to the request.
2. **Impact Mapping:** List every file that will be modified and any new files that need to be created (e.g., a new `useBudget` hook or a `transactions` migration).
3. **The "Elegant" Check:** Evaluate if there is a more performant way to handle the state or if a Supabase RLS policy could replace a complex React filter.
4. **Task Extraction:** Write a prioritized, phased plan into `tasks/todo.md`. Use `[ ]` for pending tasks.

### Plan Structure (in tasks/todo.md)

- **Phase 1: Database/Backend** (Supabase migrations, Edge Functions, RLS)
- **Phase 2: Core Logic** (Hooks, Utils, Type definitions)
- **Phase 3: UI/Components** (Tailwind v4 styling, React components)
- **Phase 4: Verification** (Unit tests, Manual build check)

### Critical Rules

- **No Implementation:** If you start writing `export function...` before the plan is approved, you have failed.
- **Context Awareness:** Reference existing naming conventions (e.g., `camelCase` for variables, `PascalCase` for components).
- **Vite/Tailwind v4:** Ensure the plan respects the CSS-variable-first theme structure.
