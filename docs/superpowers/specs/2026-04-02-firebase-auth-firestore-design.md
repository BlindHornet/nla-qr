# Firebase Auth + Firestore Persistence Design

**Date:** 2026-04-02

## Overview

Add Firebase Authentication (email + password, invite-only) and Firestore persistence for groups and contacts. All authenticated users share one global dataset. The app gates behind a login screen; unauthenticated visitors see only the login page.

---

## Environment

A `.env.local` file (git-ignored) holds Firebase config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

`.gitignore` is updated to exclude `.env.local` and `.env*.local`.

---

## Firebase Initialization — `src/lib/firebase.ts`

Exports three singletons consumed by all other modules:

| Export | Type | Purpose |
|--------|------|---------|
| `app` | `FirebaseApp` | Root Firebase app instance |
| `auth` | `Auth` | Firebase Authentication |
| `db` | `Firestore` | Firestore database |

Reads all config from `import.meta.env.VITE_FIREBASE_*`.

---

## Authentication — `src/state/AuthContext.tsx`

Exposes `{ user, loading, signIn, signOut }` via React context.

- Subscribes to `onAuthStateChanged` on mount; unsubscribes on unmount
- `loading` is true until the first auth state event fires
- `signIn(email, password)` calls `signInWithEmailAndPassword` — throws on invalid credentials
- `signOut()` calls Firebase `signOut`

### `src/features/auth/LoginPage.tsx`

Centered card with:
- Email input
- Password input
- "Sign In" button (calls `signIn`, shows inline error on failure)
- No registration form — accounts are created in the Firebase console by an admin

### App routing

- `AuthProvider` is added to `main.tsx`, wrapping the entire tree (outside `AppDataProvider`)
- `AppDataProvider` only renders when `user` is non-null, inside `App.tsx`
- If `loading`: full-page centered spinner
- If `!user`: render `<LoginPage />`
- If `user`: render existing app shell normally

---

## Firestore Data Layer

### Collections

| Collection | Document shape |
|------------|---------------|
| `groups` | `{ id, name, description, expiresAt? }` |
| `contacts` | `{ id, firstName, lastName, email, groupIds[] }` |

Document IDs match the `id` field (no auto-generated IDs).

### `AppDataContext` changes

`useState` for `groups` and `contacts` is replaced with `onSnapshot` real-time listeners on the two collections. Both listeners are set up on mount and torn down on unmount.

A `loading: boolean` field is added to the context value — true until both snapshots have fired at least once.

Each mutation method becomes a direct Firestore write — no local `setState`. State flows back through the listeners automatically.

| Method | Firestore operation |
|--------|-------------------|
| `addGroup(payload)` | `setDoc` on `groups/{id}` with `crypto.randomUUID()` id |
| `updateGroup(id, payload)` | `updateDoc` on `groups/{id}` |
| `deleteGroup(id)` | Batch: `deleteDoc` on `groups/{id}` + `updateDoc` on every contact that had this `groupId` |
| `addContact(payload)` | `setDoc` on `contacts/{id}` |
| `importContacts(rows, groupId?)` | `writeBatch`: one `setDoc` per contact |
| `updateContactGroups(contactId, groupIds)` | `updateDoc` on `contacts/{contactId}` |

The hardcoded `initialGroups` array is removed — Firestore is the source of truth.

`settings` remains in local state (not persisted to Firestore in this iteration).

---

## Files Changed

| Action | File |
|--------|------|
| Create | `.env.local` (git-ignored, user fills in values) |
| Update | `.gitignore` (add `.env*.local`) |
| Create | `src/lib/firebase.ts` |
| Create | `src/state/AuthContext.tsx` |
| Create | `src/features/auth/LoginPage.tsx` |
| Modify | `src/main.tsx` (wrap with `AuthProvider`) |
| Modify | `src/App.tsx` (auth gate: spinner → login → app) |
| Modify | `src/state/AppDataContext.tsx` (replace useState with onSnapshot, mutations → Firestore writes) |
