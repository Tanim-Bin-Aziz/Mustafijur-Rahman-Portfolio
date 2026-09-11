# Dashboard Project Upload — Setup

The dashboard project manager is built. **One manual step is required before it
works**: creating the database tables and storage buckets in Supabase.

---

## Step 1 — Run the SQL migration (required)

1. Open your Supabase project → **SQL Editor** → **New query**
2. Paste the entire contents of:

   ```
   lib/supabase/migrations/001_init.sql
   ```

3. Click **Run**

That single script creates:

- tables `categories`, `projects`, `project_images`
- row-level security (public read, authenticated write)
- the `updated_at` trigger
- storage buckets `project-covers`, `project-images`, `project-pdfs`
  (all public, with read/write policies)
- **seed data** — your 4 categories and all 12 existing projects, using the
  images and PDFs already in `public/`, so nothing is lost

> The script is idempotent — running it twice will not duplicate anything.

### Verify

Run this in the SQL Editor:

```sql
select count(*) from categories;   -- expect 4
select count(*) from projects;     -- expect 12
```

Or just visit `http://localhost:3000/portfolio`.

---

## Step 2 — Use the dashboard

1. Go to `http://localhost:3000/login` and sign in
2. The navbar shows a **Dashboard** link (only visible when signed in)
3. Go to **Dashboard → Project Management**

```
/dashboard/projects                        → category grid with project counts
/dashboard/projects/academic-hons          → projects in that category
/dashboard/projects/academic-hons/new      → upload a new project
/dashboard/projects/academic-hons/<slug>   → edit project, images, PDF
```

Each project form lets you set **title, slug, project type, date, location,
description**, and upload a **cover image**, **multiple gallery images**, and a
**PDF**. Files go to the Supabase storage buckets; every project belongs to one
category.

---

## How it fits together

| Layer | File |
|---|---|
| DB schema + seed | `lib/supabase/migrations/001_init.sql` |
| Storage uploads | `lib/supabase/storage.ts` |
| Read queries (server) | `lib/projects.ts` |
| Create / update / delete | `app/dashboard/projects/actions.ts` |
| Upload form UI | `components/dashboard/ProjectForm.tsx` |
| Dashboard pages | `app/dashboard/projects/**` |

The public portfolio pages read from Supabase through `lib/projects.ts`, so
anything you upload in the dashboard appears on `/portfolio` immediately
(cache is revalidated after every change).

---

## Access rules

- **Anyone** can read categories, projects and images (it is a public portfolio)
- **Only signed-in users** can create, update or delete — enforced both by
  middleware (route protection) and by RLS policies + storage policies
- The `anon` key in `.env` is safe to expose; writes require a valid session

---

## If something breaks

See `backups/README.md` — every modified file can be restored with git or from
the raw `.bak` copies.

Common issues:

| Symptom | Fix |
|---|---|
| `/portfolio` shows an empty archive | The SQL migration has not been run yet |
| `Could not find the table 'public.categories'` | Same — run `001_init.sql` |
| Upload fails with "new row violates row-level security" | You are not signed in, or bucket policies were not applied — re-run `001_init.sql` |
| Images from Supabase do not render | `next.config.ts` must allow `**.supabase.co` (already configured) |
