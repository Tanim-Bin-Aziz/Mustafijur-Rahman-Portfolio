import { createBrowserClient } from "@supabase/ssr";

// Client Component-gulo (form, button click) theke Supabase call korar jonno
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
