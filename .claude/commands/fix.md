---
allowed-tools: Bash(npm run:*), Bash(git diff:*), ReadFile, ls, Bash(grep:*), commit
description: Autonomous bug identification, root-cause analysis, and resolution
---

## Your Task

A bug has been reported. Act as a Debugging Specialist. Identify the failure, trace the root cause, and implement a minimal, high-integrity fix. **Do not refactor unrelated code.**

### The "Zero Hand-Holding" Protocol

1. **Reproduce (MANDATORY):**
   - Run `npm run test` if tests exist
   - If no tests, inspect logs via `grep`, `ReadFile`, or console output
   - Identify EXACT failure message before proceeding
   - DO NOT continue without confirming the failure signal

2. **Trace (Root Cause Analysis):**
   - Identify the exact file and line causing the issue
   - Explain why the current logic fails
   - Classify the issue:
     - State bug (React state, hooks, async)
     - Data bug (Supabase, API, schema mismatch)
     - UI bug (Tailwind, layout, rendering)
     - Build/runtime bug (Vite, imports, env)

3. **Fix:**
   - Change ONLY the lines required to resolve the issue
   - Do NOT introduce new abstractions or refactors
   - If more than ~10 lines are changed, justify why

4. **Test:**
   - If a related test exists → update or extend it
   - If no test exists → create a minimal test
     - Test happy paths
     - Test edge cases
     - Test error states
   - Focus on testing behavior and public API's rather than implemtnation details.

- Test must FAIL before fix and PASS after fix

1. **Verify:**
   - Run `npm run build`
   - Run `npm run test`
   - If UI-related: verify no console errors and correct rendering

2. **Commit:**
   - Use `/commit`
   - Format: `fix(scope): concise description`
   - Scope must match affected area

### Critical Rules

- **No Side Quests:** Do not modify unrelated code
- **No Guessing:** Always identify a real failure signal first
- **One-Pass Discipline:** Fix one root cause at a time
- **Supabase Check:** Validate RLS, schema, and network logs for data issues
- **Environment Awareness:** Ensure fix does not break Vite HMR

## Output

Briefly state:

1. **The Symptom:** What was breaking.
2. **The Root Cause:** Why it was breaking.
3. **The Solution:** What you changed.
   Then, run the commit.
