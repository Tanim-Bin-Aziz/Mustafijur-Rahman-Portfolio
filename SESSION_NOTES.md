# Session Notes — Dashboard Project Upload System

**Status:** Code complete and verified. Blocked on one manual step (SQL migration).
**Date:** 2026-09-10

---

## ⏭️ WHERE TO PICK UP

### The one blocking step

The Supabase tables **do not exist yet** — verified by querying the REST API,
which returns `Could not find the table 'public.categories'`.

**Do this first:**

1. Open Supabase → **SQL Editor** → New query
2. Paste all of `lib/supabase/migrations/001_init.sql`
3. **Run**

Then verify:

```sql
select count(*) from categories;   -- expect 4
select count(*) from projects;     -- expect 12
```

This creates the tables, RLS policies, 3 storage buckets, and **seeds the
existing 4 categories + 12 projects** from `public/`, so no content is lost.

### After that — test the flow

```bash
npm run dev
```

1. `/login` → sign in
2. Navbar now shows a **Dashboard** link (signed-in only)
3. `/dashboard/projects` → pick a category → **Add project**
4. Upload cover + gallery images + PDF → **Publish**
5. Confirm it appears at `/portfolio/academic-hons/<slug>`
6. Test edit and delete

---

## ✅ What was completed this session

**Navbar (earlier in session)**
- `components/Nav.tsx` — tracks auth state via Supabase; shows **Dashboard**
  link + logout button when signed in, login icon when signed out
- `app/dashboard/layout.tsx` — now uses the shared `Nav` (not a separate
  dashboard-only nav)
- `app/dashboard/sidebar.tsx` — restyled to match the frontend palette

**Upload system**
- `lib/supabase/migrations/001_init.sql` — schema, RLS, buckets, seed data
- `lib/projects.ts` — Supabase data layer (replaces `data/projects.ts`)
- `lib/supabase/storage.ts` — upload helpers for cover / images / PDF
- `app/dashboard/projects/actions.ts` — create, update, delete server actions
- `app/dashboard/projects/page.tsx` — category grid with counts
- `app/dashboard/projects/[category]/page.tsx` — project list + edit/delete
- `app/dashboard/projects/[category]/new/page.tsx` — create form
- `app/dashboard/projects/[category]/[slug]/page.tsx` — edit form
- `components/dashboard/ProjectForm.tsx` — full upload form
- `components/dashboard/ConfirmSubmit.tsx` — confirm-before-delete button
- Frontend pages switched from static data to Supabase
- `next.config.ts` — allows `**.supabase.co` images

**Verification already done**
- `npx tsc --noEmit` → clean
- `npx next build` → succeeds, all 6 dashboard routes registered
- `/portfolio` → HTTP 200, renders without crashing even with no tables
- `/dashboard/projects` → HTTP 307 redirect to `/login` (route protection works)

---

## 🔧 Decisions made

- **Database-only** frontend — `/portfolio` reads from Supabase, no static
  fallback. Consequence: it shows an **empty archive** until the SQL is run.
  *Open option:* add a fallback to `data/projects.ts` if the DB is empty.
- **Data migrated** — existing projects are seeded via SQL rather than re-uploaded.

---

## 📁 Backup / restore

`data/projects.ts` is **untouched** (still the original static data, kept as reference).

Two ways to roll back — full details in `backups/README.md`:
- **Git** — all modified files are tracked, so `git checkout -- .`
- **Raw `.bak` copies** in `backups/`

Setup guide: `DASHBOARD_SETUP.md`

---

## ⚠️ Notes for next session

- `tsconfig.json` shows as modified — Next.js auto-appended
  `.next/dev/dev/types/**/*.ts` when `next dev` ran. Harmless.
- `tsconfig.tsbuildinfo` and `.commandcode/*` also show as modified — generated.
- No background processes left running; dev server was stopped.
- Nothing has been committed to git yet.
