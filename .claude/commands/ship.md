---
allowed-tools: Bash(npm run:*), Bash(git status:*), Bash(git diff:*), EditFile(tasks/todo.md), commit
description: Pre-deployment verification and automated shipping workflow
---

## Your Task

Execute the high-integrity shipping sequence for the current work. **Stop immediately if any step fails.**

### Step 1: Quality Control

Run the following commands in order:

1. `npm run lint` — If errors exist, fix them automatically or report them.
2. `npm run build` — Confirm no TypeScript or Vite build errors.
3. `npm run test` — Ensure all unit/integration tests pass.

### Step 2: Verification

- Review the `git diff`.
- Ensure no sensitive **Supabase keys** or `console.log` statements are being staged.
- Check for any `TODO:` comments left in the code.

### Step 3: Persistence

- **Commit:** Use the `/commit` command to create a conventional commit based on the changes.
- **Documentation:** Open `tasks/todo.md` and mark the relevant items as completed with a [x].

### Critical Rules

- **Hard Stop:** If `npm run build` or `npm run test` fails, **DO NOT PROCEED** to the commit phase. Report the error to the user.
- **Tailwind v4 Check:** Ensure no legacy `tailwind.config.js` was accidentally recreated during the build.
