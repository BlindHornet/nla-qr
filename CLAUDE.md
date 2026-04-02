# NLA QR — Project Guide for Claude

## Project Overview

A school QR-code email tool. Staff sign in, manage contact groups, and send personalized emails with QR codes to parents/contacts. Built with React 18 + TypeScript + Vite. Data lives in Firebase Firestore; auth is Firebase email/password (invite-only).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, TypeScript (strict), inline styles |
| Routing | React Router v6 |
| State | React Context (`AppDataContext`, `AuthContext`) |
| Backend | Firebase 11 — Firestore (data) + Auth (email/password) |
| Build | Vite |
| Lint | ESLint (`--max-warnings 0`) |

No test framework is installed. Use `npx tsc --noEmit` to verify types.

---

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Type-check + production build
npm run lint      # ESLint (zero warnings allowed)
npx tsc --noEmit  # Type-check only
```

---

## Project Structure

```
src/
  App.tsx                    # Auth gate: spinner → LoginPage → app shell
  main.tsx                   # Entry: BrowserRouter + AuthProvider
  styles.css                 # Global styles (page-card, btn, app-shell, etc.)
  state/
    AppDataContext.tsx        # Firestore onSnapshot listeners; all data mutations
    AuthContext.tsx           # Firebase Auth state, signIn, signOut
  features/
    auth/LoginPage.tsx        # Email/password login form
    groups/                   # Groups CRUD (GroupsPage, GroupsGrid, GroupFormModal)
    contacts/                 # Contacts CRUD + CSV import
    send-email/               # Compose + send emails with QR codes
    qr-codes/                 # QR code management
    settings/                 # App settings (branding, Gmail)
  lib/
    firebase.ts               # Firebase app/auth/db singletons (reads .env.local)
    firestore.ts              # Firestore type definitions (Contact, Group, QRCode)
    gmail.ts                  # Gmail integration helpers
    qrcode.ts                 # QR code generation
    csv.ts                    # CSV parsing
  components/
    layout/                   # Sidebar, PageHeader
    ui/                       # Button, Modal, Badge, Avatar, EmptyState, SearchInput
  hooks/
    useGroups.ts              # Thin wrapper around useAppData
    useContacts.ts
    useSettings.ts
    useGmailAuth.ts
  pages/
    qr-landing/               # Public QR landing page (/qr/:id)
```

---

## Key Architecture Decisions

### Data flow
- `AppDataContext` subscribes to Firestore `groups` and `contacts` collections via `onSnapshot` on mount.
- All mutations (`addGroup`, `deleteGroup`, etc.) write directly to Firestore — no local `setState`. State updates flow back through the snapshot listeners automatically.
- `loading: boolean` in the context is `true` until both snapshots have fired.

### Auth gate
- `AuthProvider` (in `main.tsx`) wraps the whole app.
- `App.tsx` checks `useAuth()`: loading spinner → `LoginPage` → `AppDataProvider` + app shell.
- `AppDataProvider` only mounts when a user is authenticated.

### Groups
- `GroupItem` has optional `expiresAt?: string` (ISO date).
- Expired groups (`expiresAt` past today) render faded on the Groups page and are hidden from the Send Email recipient selector.
- Deleting a group uses a Firestore batch write that also strips the groupId from every affected contact.

### No self-registration
- Accounts are created by an admin in the Firebase console.
- `LoginPage` is login-only — no sign-up form.

---

## Environment

Credentials live in `.env.local` (git-ignored). Required variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

---

## CSS Conventions

Global classes defined in `styles.css`:
- `page-card` — white card with padding/shadow
- `btn`, `btn-primary`, `btn-secondary` — button styles
- `app-shell` — sidebar + main layout grid
- `main` — scrollable main content area

Components use inline styles for one-off layout; global classes for recurring patterns.

---

## TypeScript Notes

- Strict mode enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`
- No `any` — use proper types or `unknown`
- Mutation methods in `AppDataContext` return `Promise<void>`; callers fire-and-forget (no `await` needed)
- `import.meta.env.VITE_*` variables are cast to `string` in `src/lib/firebase.ts`

---

## Workflow Preferences

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- Use subagents to keep the main context window clean
- After corrections: update `tasks/lessons.md` with the pattern
- Never mark a task complete without proving it works (`npx tsc --noEmit` at minimum)
- Prefer editing existing files over creating new ones
- Do not add features, comments, or error handling beyond what was asked
