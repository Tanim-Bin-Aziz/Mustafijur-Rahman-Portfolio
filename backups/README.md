# Backups — how to restore

There are **two independent ways** to undo the dashboard upload-system changes.

---

## 1. Git (recommended, restores everything)

Everything that was modified is tracked in git, so the original versions live in
`HEAD`. To roll the whole change back:

```bash
# restore all modified (tracked) files
git checkout -- .

# remove the new (untracked) files added by this feature
rm -rf app/dashboard/projects/[category]
rm -f  app/dashboard/projects/actions.ts
rm -f  lib/projects.ts
rm -f  lib/supabase/storage.ts
rm -rf lib/supabase/migrations
rm -rf components/dashboard
rm -rf backups
```

> On Windows PowerShell use `Remove-Item -Recurse -Force <path>` instead of `rm -rf`.

If you only want to undo **one** file:

```bash
git checkout -- "app/portfolio/[category]/page.tsx"
git checkout -- data/projects.ts
```

To see exactly what changed:

```bash
git status
git diff
```

---

## 2. Raw `.bak` copies (works even without git)

These are byte-for-byte copies of the originals taken before editing:

| Backup file | Restore to |
|---|---|
| `projects.ts.bak` | `data/projects.ts` |
| `[category]_page.tsx.bak` | `app/portfolio/[category]/page.tsx` |
| `[category]_[slug]_page.tsx.bak` | `app/portfolio/[category]/[slug]/page.tsx` |
| `ProjectDetailClient.tsx.bak` | `app/portfolio/[category]/[slug]/ProjectDetailClient.tsx` |

```powershell
Copy-Item "backups\projects.ts.bak" "data\projects.ts" -Force
```

---

## What changed

`data/projects.ts` is **untouched** — it is still the original static data and
is kept as a reference/fallback. The portfolio pages no longer import it; they
read from Supabase through `lib/projects.ts` instead.

| File | Change |
|---|---|
| `app/portfolio/page.tsx` | reads categories from Supabase |
| `app/portfolio/[category]/page.tsx` | reads category + projects from Supabase |
| `app/portfolio/[category]/[slug]/page.tsx` | reads project from Supabase |
| `components/ProjectsGrid.tsx` | reads categories from Supabase |
| `app/portfolio/[category]/[slug]/ProjectDetailClient.tsx` | type import moved to `@/lib/projects` |
| `components/PDFViewerModal.tsx` | type import moved to `@/lib/projects` |
| `app/page.tsx` | dropped an unused `ProjectsGrid` import |
| `next.config.ts` | allows `**.supabase.co` images |
| `app/dashboard/projects/page.tsx` | placeholder replaced with category manager |

New files added by this feature:

```
lib/projects.ts                          # Supabase data layer (types + queries)
lib/supabase/storage.ts                  # storage upload helpers
lib/supabase/migrations/001_init.sql     # DB tables, RLS, buckets, seed data
app/dashboard/projects/actions.ts        # create/update/delete server actions
app/dashboard/projects/[category]/       # category list, new, edit pages
components/dashboard/                    # ProjectForm, ConfirmSubmit
```
