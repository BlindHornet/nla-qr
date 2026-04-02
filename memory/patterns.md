# Code Patterns

Reusable patterns that work well in this project. Claude should follow these
instead of inventing new approaches for the same problem.

---

## React Component Structure

Standard order inside every component file:

```jsx
// 1. Imports
import { useState, useEffect } from "react";

// 2. Component (named export)
export function MyComponent({ label, onClick }) {
  // a. State
  const [isOpen, setIsOpen] = useState(false);

  // b. Derived values / memos
  const displayLabel = label.trim();

  // c. Effects
  useEffect(() => {
    // cleanup required for subscriptions/timers
    return () => {};
  }, []);

  // d. Handlers
  function handleClick() {
    onClick();
    setIsOpen(false);
  }

  // e. Render
  return <button onClick={handleClick}>{displayLabel}</button>;
}
```

---

## Custom Hook Pattern

Extract logic from components when it has more than one piece of state
or a side effect:

```jsx
// hooks/useAsync.js
export function useAsync(fn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function execute() {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, execute };
}
```

---

## Error + Loading State Pattern

Every async operation must handle all three states — never leave loading
or error unhandled:

```jsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} />;
if (!data) return null;
return <MainContent data={data} />;
```

---

## Environment Variables

Always use `import.meta.env.VITE_*` — never `process.env`:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

Never access env vars inside components directly. Centralize them:

```js
// src/config/env.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
};
```

---

## Tailwind CSS v4 Theme Tokens

Define design tokens in CSS, not in a config file:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-brand: #2563eb;
  --color-brand-dark: #1d4ed8;
  --font-sans: "Inter", sans-serif;
  --radius-card: 0.75rem;
}
```

Use them in components via Tailwind utilities:

```jsx
<div className="bg-brand text-white rounded-card" />
```

---

## Folder Conventions

| Folder            | What goes here                                    |
| ----------------- | ------------------------------------------------- |
| `src/components/` | Reusable UI — no business logic, no data fetching |
| `src/features/`   | Feature-scoped components + hooks (co-located)    |
| `src/hooks/`      | Shared custom hooks used across features          |
| `src/utils/`      | Pure functions — no side effects, no React        |
| `src/config/`     | App configuration, env vars, constants            |

---

<!-- Add new patterns above this line as the project evolves -->
