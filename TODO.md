# TODO - Code Improvements

This file tracks improvements to be made to the MEHC codebase.

## Priority 1 - Critical Bugs (Will Cause Runtime Errors)

- [x] **Fix type conversion bugs in admin actions**
  - File: `src/routes/admin/+page.server.ts`
  - Lines: 24, 29-31, 36, 42
  - Issue: FormData returns strings but functions expect numbers
  - Fix: Add `parseInt()` conversions
  - ✅ COMPLETED: Added proper type conversions with `parseInt()` and `as string` casts

- [x] **Fix empty array crash in vote counting**
  - File: `src/routes/results/+page.server.ts:11`
  - File: `src/routes/api/nbvotes.json/+server.ts:7`
  - Issue: `.reduce()` will fail if suspects array is empty
  - Fix: Add default value or check for empty array
  - ✅ COMPLETED: Added default value `0` to reduce() and `?? 0` fallback for null cases

- [x] **Fix database connection leak**
  - File: `src/hooks.server.ts:7-10`
  - Issue: Creates new connection on every request, never closes it
  - Fix: Create single connection at module level or implement proper cleanup
  - ✅ COMPLETED: Created single database connection at module level that is reused for all requests

- [x] **Fix type mismatch in app.d.ts**
  - File: `src/app.d.ts:5-6`
  - Issue: Imports `sqlite3` types but code uses `better-sqlite3`
  - Fix: Change import to `better-sqlite3` types
  - ✅ COMPLETED: Changed import to use proper Database type from better-sqlite3

- [x] **Fix createSuspect missing real_name**
  - File: `src/lib/sqliteClient.ts:40-42`
  - Issue: Only sets `name`, not `real_name` - breaks admin display
  - Fix: Add `real_name` parameter or default to same as `name`
  - ✅ COMPLETED: Updated INSERT to set both real_name and name to the same value

## Priority 2 - Error Handling & Robustness

- [x] **Add error handling to database operations**
  - Files: All functions in `src/lib/sqliteClient.ts`
  - Issue: No try-catch blocks, app will crash on DB errors
  - Fix: Add error handling with proper error messages
  - ✅ COMPLETED: Added try-catch blocks to all database functions with descriptive error messages

- [x] **Add form data validation**
  - Files: All `+page.server.ts` files with actions
  - Issue: No validation of user input (empty strings, invalid IDs, etc.)
  - Fix: Add validation before database operations
  - ✅ COMPLETED: Added validation for all admin actions (status, IDs, names) and voting action

- [x] **Add transaction support for vote counting**
  - File: `src/lib/sqliteClient.ts:88-99`
  - Issue: Race condition on concurrent votes
  - Fix: Use database transactions
  - ✅ COMPLETED: Wrapped vote counting in better-sqlite3 transaction for atomic updates

## Priority 3 - Code Quality

- [x] **Remove unnecessary async keywords**
  - File: `src/lib/sqliteClient.ts` (all functions)
  - Issue: Functions marked `async` but use synchronous API
  - Fix: Remove `async` keywords and `await` calls
  - ✅ COMPLETED: Removed all async/await from sqliteClient and all calling code

- [x] **Extract vote counting to helper function**
  - Files: `src/routes/results/+page.server.ts:11`, `src/routes/api/nbvotes.json/+server.ts:7`
  - Issue: Duplicate code
  - Fix: Create helper function in sqliteClient
  - ✅ COMPLETED: Created getTotalVotes() helper function, updated all usages

- [ ] **Remove commented/debug code**
  - `src/lib/sqliteClient.ts:36` - console.log
  - `src/routes/results/+page.server.ts:25` - commented code
  - `src/routes/admin/+page.svelte:77-85` - commented delete button
  - `src/routes/api/status.json/+server.ts:1` - commented import

- [x] **Standardize type annotations**
  - Files: All `+page.server.ts` files
  - Issue: Mix of JSDoc and TypeScript syntax
  - Fix: Use consistent TypeScript syntax throughout
  - ✅ COMPLETED: Replaced JSDoc with TypeScript types (PageServerLoad, Actions) across all server files

## Priority 4 - Performance Optimizations

- [ ] **Reduce polling frequency or use SSE/WebSockets**
  - File: `src/routes/results/+page.svelte:35-40`
  - Issue: Polls nbvotes every 1 second - excessive
  - Fix: Increase interval or implement server-sent events

- [ ] **Add database indexes**
  - File: `init.sql`
  - Issue: No indexes on frequently queried columns
  - Fix: Add index on `is_playing` and `votes` columns

- [ ] **Cache database connection**
  - Related to connection leak fix above
  - Implement proper connection reuse

## Priority 5 - Nice to Have

- [ ] **Add empty state handling in UI**
  - Files: `src/routes/results/+page.svelte`, Graph component
  - Issue: No friendly message if no suspects/votes
  - Fix: Add conditional rendering for empty states

- [ ] **Add input validation for picture uploads**
  - File: `src/routes/admin/[id=integer]/+page.server.ts`
  - Issue: No size/format validation
  - Fix: Validate file type and size

- [ ] **Add admin authentication**
  - Files: Admin routes
  - Issue: Publicly accessible
  - Fix: Add simple password protection or auth middleware

## Notes

- Start with Priority 1 items - they will cause actual runtime errors
- Priorities 2-3 improve stability and maintainability
- Priorities 4-5 are optimizations and enhancements
- Test each change individually to avoid breaking working functionality
