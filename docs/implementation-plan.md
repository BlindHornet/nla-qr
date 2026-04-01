# NLA QR Implementation Plan

## Phase 1 — App Shell and Routing (current)
- Initialize Vite + React + TypeScript structure.
- Add permanent sidebar navigation for the 5 core sections.
- Create placeholder pages for QR Codes, Groups, Contacts, Send Email, and Settings.
- Add QR landing route (`/qr/:id`) placeholder.

## Phase 2 — Firestore Schema and Data Hooks
- Map TypeScript interfaces to Firestore collections/documents.
- Implement typed data access helpers for contacts, groups, qrCodes, and settings.
- Replace placeholder hooks with real-time Firestore subscriptions.

## Phase 3 — Contacts and Groups
- Build Contacts table and Contact form (multi-email + primary selection).
- Build CSV import flow with skipped-row summary.
- Build Groups grid/detail with add/remove members and inline contact creation.

## Phase 4 — QR Code Management
- Build QR stats and filterable table.
- Implement generate/regenerate/delete QR workflows.
- Add download/view actions and state badges.

## Phase 5 — Email Sending
- Implement Gmail OAuth settings flow.
- Build Send Email page with Group and Individual modes.
- Implement preview + Gmail send helper + `emailSentAt` updates.

## Phase 6 — Landing Page and Deploy Targets
- Build valid/expired/invalid landing states.
- Split build targets for admin vs landing.
- Add hosting/deployment configuration for Netlify + Firebase.
