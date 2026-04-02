# Firebase Auth + Firestore Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Firebase email/password authentication with a login screen and replace all in-memory state with Firestore real-time listeners.

**Architecture:** Firebase is already installed. A new `src/lib/firebase.ts` initializes the app singleton. `AuthContext` gates the app behind a login screen. `AppDataContext` swaps `useState` for `onSnapshot` listeners; all mutations become Firestore writes. All users share one global Firestore dataset.

**Tech Stack:** React 18, TypeScript (strict), Vite, Firebase 11 (Auth + Firestore), no test framework — use `npx tsc --noEmit` for verification.

---

## File Map

| Action | File |
|--------|------|
| Create | `.env.local` |
| Modify | `.gitignore` |
| Create | `src/lib/firebase.ts` |
| Create | `src/state/AuthContext.tsx` |
| Create | `src/features/auth/LoginPage.tsx` |
| Modify | `src/main.tsx` |
| Modify | `src/App.tsx` |
| Modify | `src/state/AppDataContext.tsx` |

---

### Task 1: Environment setup

**Files:**
- Create: `.env.local`
- Modify: `.gitignore`

- [ ] **Step 1: Create `.env.local` with placeholder values**

  Create `f:/Coding/Active/nla-qr/nla-qr/.env.local` with this content (user fills in real values from Firebase console):

  ```
  VITE_FIREBASE_API_KEY=your-api-key-here
  VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_APP_ID=your-app-id
  ```

- [ ] **Step 2: Update `.gitignore` to exclude env files**

  Replace the entire `.gitignore` with:

  ```
  node_modules
  .env.local
  .env*.local
  ```

- [ ] **Step 3: Commit**

  ```bash
  cd f:/Coding/Active/nla-qr/nla-qr
  git add .gitignore
  git commit -m "chore: ignore .env.local files"
  ```

  Note: Do NOT `git add .env.local` — it must never be committed.

---

### Task 2: Firebase initialization

**Files:**
- Create: `src/lib/firebase.ts`

- [ ] **Step 1: Create `src/lib/firebase.ts`**

  ```ts
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  };

  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  ```

- [ ] **Step 2: Verify types compile**

  ```bash
  cd f:/Coding/Active/nla-qr/nla-qr && npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/firebase.ts
  git commit -m "feat: initialize Firebase app, auth, and Firestore"
  ```

---

### Task 3: AuthContext

**Files:**
- Create: `src/state/AuthContext.tsx`

- [ ] **Step 1: Create `src/state/AuthContext.tsx`**

  ```tsx
  import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
  import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
  } from 'firebase/auth';
  import { auth } from '../lib/firebase';

  interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextValue | undefined>(undefined);

  export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
      await firebaseSignOut(auth);
    };

    return (
      <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
  }
  ```

- [ ] **Step 2: Verify types compile**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/state/AuthContext.tsx
  git commit -m "feat: add AuthContext with email/password sign-in"
  ```

---

### Task 4: LoginPage

**Files:**
- Create: `src/features/auth/LoginPage.tsx`

- [ ] **Step 1: Create `src/features/auth/LoginPage.tsx`**

  ```tsx
  import { FormEvent, useState } from 'react';
  import { useAuth } from '../../state/AuthContext';

  export function LoginPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      try {
        await signIn(email, password);
      } catch {
        setError('Invalid email or password.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f1f5f9',
        }}
      >
        <div className="page-card" style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.25rem' }}>Sign In</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p style={{ color: '#dc2626', margin: 0, fontSize: '0.875rem' }}>{error}</p>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify types compile**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/LoginPage.tsx
  git commit -m "feat: add LoginPage with email/password form"
  ```

---

### Task 5: Wire auth into `main.tsx` and `App.tsx`

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/main.tsx`**

  Remove `AppDataProvider` (it moves into `App.tsx` behind the auth gate). Add `AuthProvider`.

  ```tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import App from './App';
  import './styles.css';
  import { AuthProvider } from './state/AuthContext';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  ```

- [ ] **Step 2: Replace `src/App.tsx`**

  Add auth gate: spinner while loading, `LoginPage` when unauthenticated, app shell when authenticated. `AppDataProvider` moves here, wrapping only authenticated content.

  ```tsx
  import { Navigate, Route, Routes } from 'react-router-dom';
  import { Sidebar } from './components/layout/Sidebar';
  import { QRCodesPage } from './features/qr-codes/QRCodesPage';
  import { GroupsPage } from './features/groups/GroupsPage';
  import { ContactsPage } from './features/contacts/ContactsPage';
  import { SendEmailPage } from './features/send-email/SendEmailPage';
  import { SettingsPage } from './features/settings/SettingsPage';
  import { QRLandingPage } from './pages/qr-landing/QRLandingPage';
  import { useAuth } from './state/AuthContext';
  import { AppDataProvider } from './state/AppDataContext';
  import { LoginPage } from './features/auth/LoginPage';

  export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <p>Loading…</p>
        </div>
      );
    }

    if (!user) {
      return <LoginPage />;
    }

    return (
      <AppDataProvider>
        <Routes>
          <Route path="/qr/:id" element={<QRLandingPage />} />
          <Route
            path="/*"
            element={
              <div className="app-shell">
                <Sidebar />
                <main className="main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/qr-codes" replace />} />
                    <Route path="/qr-codes" element={<QRCodesPage />} />
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/send-email" element={<SendEmailPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </AppDataProvider>
    );
  }
  ```

- [ ] **Step 3: Verify types compile**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/main.tsx src/App.tsx
  git commit -m "feat: add auth gate — login page, loading spinner, AppDataProvider behind auth"
  ```

---

### Task 6: Replace AppDataContext with Firestore listeners

**Files:**
- Modify: `src/state/AppDataContext.tsx`

- [ ] **Step 1: Replace the entire file**

  ```tsx
  import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
  import {
    collection,
    deleteField,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    writeBatch,
  } from 'firebase/firestore';
  import { db } from '../lib/firebase';

  export interface GroupItem {
    id: string;
    name: string;
    description: string;
    expiresAt?: string;
  }

  export interface ContactItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    groupIds: string[];
  }

  interface CSVRow {
    firstName: string;
    lastName: string;
    email: string;
  }

  interface AppSettings {
    appName: string;
    gmailEmail: string;
    gmailConnected: boolean;
  }

  interface AppDataContextValue {
    contacts: ContactItem[];
    groups: GroupItem[];
    settings: AppSettings;
    loading: boolean;
    addGroup: (payload: { name: string; description: string; expiresAt?: string }) => Promise<void>;
    updateGroup: (id: string, payload: { name: string; description: string; expiresAt?: string }) => Promise<void>;
    deleteGroup: (id: string) => Promise<void>;
    addContact: (payload: { firstName: string; lastName: string; email: string; groupIds: string[] }) => Promise<void>;
    importContacts: (rows: CSVRow[], groupId?: string) => Promise<void>;
    updateContactGroups: (contactId: string, groupIds: string[]) => Promise<void>;
    updateSettings: (next: Partial<AppSettings>) => void;
  }

  const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

  export function AppDataProvider({ children }: PropsWithChildren) {
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [settings, setSettings] = useState<AppSettings>({
      appName: 'NLA QR',
      gmailEmail: '',
      gmailConnected: false,
    });
    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const [contactsLoaded, setContactsLoaded] = useState(false);

    useEffect(() => {
      const unsubGroups = onSnapshot(collection(db, 'groups'), (snap) => {
        setGroups(snap.docs.map((d) => d.data() as GroupItem));
        setGroupsLoaded(true);
      });
      const unsubContacts = onSnapshot(collection(db, 'contacts'), (snap) => {
        setContacts(snap.docs.map((d) => d.data() as ContactItem));
        setContactsLoaded(true);
      });
      return () => {
        unsubGroups();
        unsubContacts();
      };
    }, []);

    const loading = !groupsLoaded || !contactsLoaded;

    const value = useMemo<AppDataContextValue>(
      () => ({
        contacts,
        groups,
        settings,
        loading,
        addGroup: async ({ name, description, expiresAt }) => {
          const id = crypto.randomUUID();
          const data: GroupItem = { id, name, description };
          if (expiresAt) data.expiresAt = expiresAt;
          await setDoc(doc(db, 'groups', id), data);
        },
        updateGroup: async (id, payload) => {
          await updateDoc(doc(db, 'groups', id), {
            name: payload.name,
            description: payload.description,
            expiresAt: payload.expiresAt ?? deleteField(),
          });
        },
        deleteGroup: async (id) => {
          const batch = writeBatch(db);
          batch.delete(doc(db, 'groups', id));
          for (const contact of contacts) {
            if (contact.groupIds.includes(id)) {
              batch.update(doc(db, 'contacts', contact.id), {
                groupIds: contact.groupIds.filter((gid) => gid !== id),
              });
            }
          }
          await batch.commit();
        },
        addContact: async ({ firstName, lastName, email, groupIds }) => {
          const id = crypto.randomUUID();
          await setDoc(doc(db, 'contacts', id), { id, firstName, lastName, email, groupIds });
        },
        importContacts: async (rows, groupId) => {
          const batch = writeBatch(db);
          for (const row of rows) {
            const id = crypto.randomUUID();
            batch.set(doc(db, 'contacts', id), {
              id,
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email,
              groupIds: groupId ? [groupId] : [],
            });
          }
          await batch.commit();
        },
        updateContactGroups: async (contactId, groupIds) => {
          await updateDoc(doc(db, 'contacts', contactId), { groupIds });
        },
        updateSettings: (next) => {
          setSettings((current) => ({ ...current, ...next }));
        },
      }),
      [contacts, groups, settings, loading]
    );

    return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
  }

  export function useAppData() {
    const ctx = useContext(AppDataContext);
    if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
    return ctx;
  }
  ```

- [ ] **Step 2: Verify types compile cleanly**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors. If you see errors about callers not awaiting the now-async mutation methods, they are fire-and-forget calls and TypeScript does not require `await` on `Promise<void>` returns — no changes needed in callers.

- [ ] **Step 3: Commit**

  ```bash
  git add src/state/AppDataContext.tsx
  git commit -m "feat: replace AppDataContext useState with Firestore onSnapshot listeners"
  ```

---

### Task 7: Manual smoke test

- [ ] **Step 1: Fill in real Firebase credentials**

  Open `.env.local` and replace placeholder values with your Firebase project config from the Firebase console (Project Settings → Your apps → Firebase SDK snippet → Config).

  Also ensure Firebase Authentication has the **Email/Password** provider enabled (Firebase console → Authentication → Sign-in method).

  Create at least one user in Firebase console (Authentication → Users → Add user).

- [ ] **Step 2: Start the dev server**

  ```bash
  cd f:/Coding/Active/nla-qr/nla-qr && npm run dev
  ```

- [ ] **Step 3: Verify these scenarios**

  1. Opening the app shows the **Sign In** screen (not the app shell)
  2. Entering wrong credentials shows "Invalid email or password."
  3. Entering correct credentials shows the app shell
  4. Refreshing the page stays logged in (auth persists)
  5. Creating a group saves to Firestore (check Firebase console → Firestore → groups collection)
  6. Creating a contact saves to Firestore (contacts collection)
  7. Editing a group updates the Firestore document
  8. Deleting a group removes the document and strips the groupId from contacts
  9. Opening a second browser tab — changes made in one tab appear in the other (real-time sync)
  10. Opening DevTools → Application → Local Storage: no sensitive credentials stored
