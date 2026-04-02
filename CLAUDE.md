# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app does

School QR-code email tool. Staff sign in, manage contact groups, and send personalized emails with QR codes to parents. Invite-only — admin creates accounts in the Firebase console; no self-registration.

## Commands

```bash
npm run dev        # Dev server
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint, zero warnings allowed
npx tsc --noEmit   # Type-check only (no test framework exists)
```

## Architecture

### Auth + data flow

`main.tsx` mounts `BrowserRouter → AuthProvider → App`. `App.tsx` is the auth gate: while `AuthContext.loading` is true it shows a spinner; if no user it renders `LoginPage`; when authenticated it mounts `AppDataProvider` wrapping the full route tree.

`AppDataContext` opens two Firestore `onSnapshot` listeners (`groups`, `contacts`) on mount and exposes a `loading: boolean` that is `true` until both have fired. **All mutations write directly to Firestore — there are no local `setState` calls for data.** State flows back automatically through the listeners. Mutation methods return `Promise<void>`; callers fire-and-forget.

### Group expiration

`GroupItem.expiresAt?: string` is an ISO date. Expired groups (date in the past) render at `opacity: 0.45` with an "Expired" label in `GroupsGrid`, and are filtered out of the Send Email recipient selector in `SendEmailPage` via a local `activeGroups` derived value.

`deleteGroup` uses a Firestore `writeBatch` that deletes the group document **and** strips the `groupId` from every contact that referenced it, using the current `contacts` state from the closure.

### CSS

Global classes in `styles.css`: `page-card`, `btn`/`btn-primary`/`btn-secondary`, `app-shell`, `main`. Components use inline styles for one-off layout; global classes for recurring patterns. No Tailwind utility classes in components.

### TypeScript

Strict mode: `strict`, `noUnusedLocals`, `noUnusedParameters`. No `any`. `import.meta.env.VITE_*` vars are cast to `string` in `src/lib/firebase.ts`.

## Environment

`.env.local` (git-ignored) must contain:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```
