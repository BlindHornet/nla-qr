# Data Schema

Read this file when working on data fetching, state shape, API calls,
or anything touching how data is structured in this project.

---

## Data Source

<!-- Describe where data comes from -->
<!-- Examples: Firebase Firestore, REST API, Supabase, localStorage, etc. -->

**Type:**
**Base URL / Location:**
**Auth required:**

---

## Core Data Shapes

<!-- Document the shape of each major data object in the app -->
<!-- Use plain JS object examples — no TypeScript types -->

### Example — User

```js
{
  id: 'abc123',        // string — unique identifier
  name: 'Jane Doe',  // string
  email: 'adam@example.com',
  role: 'admin',       // 'admin' | 'user' | 'guest'
  createdAt: '2026-01-01T00:00:00Z'
}
```

### [Add your data shapes here]

```js
{
  // ...
}
```

---

## Collections / Endpoints

<!-- List every collection (Firebase) or endpoint (REST API) and what it does -->

| Name | Path / Endpoint | Description |
| ---- | --------------- | ----------- |
|      |                 |             |

---

## Key Relationships

<!-- Describe how data objects relate to each other -->
<!-- Examples: foreign keys, nested collections, join patterns -->

---

## Critical Rules

<!-- Rules Claude must never break when reading or writing data -->
<!-- Examples: ID types, comparison rules, write guards, batch limits -->

- [ ] Add rules here as you discover them

---

## Known Gotchas

<!-- Data-specific traps that have caused bugs before -->

- [ ] Add gotchas here as you encounter them
