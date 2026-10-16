import { createClient } from "./supabase/server";
import { ABOUT_ITEMS, type AboutItem } from "@/data/about";

export const ABOUT_MIGRATION = "lib/supabase/migrations/008_about_cards.sql";

interface AboutCardRow {
  id: string;
  slug: string;
  title: string;
  cover: string;
  description: string;
  sort_order: number;
}

const ABOUT_SELECT = "id, slug, title, cover, description, sort_order";

function toAboutItem(row: AboutCardRow): AboutItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cover: row.cover,
    description: row.description,
  };
}

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

export function friendlyAboutError(message: string): string {
  if (isMissingTable(message)) {
    return `About cards table not found. Run the SQL in ${ABOUT_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

// Table missing/empty hole static fallback - site kaaj kortei thake
export async function getAboutItems(): Promise<AboutItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about_cards")
    .select(ABOUT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getAboutItems failed:", error.message);
    }
    return ABOUT_ITEMS;
  }

  if (!data || data.length === 0) return ABOUT_ITEMS;

  return (data as unknown as AboutCardRow[]).map(toAboutItem);
}

export async function getAboutItem(slug: string): Promise<AboutItem | null> {
  const items = await getAboutItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function updateAboutCard(
  id: string,
  values: { title: string; cover?: string | null },
): Promise<{ ok: boolean; error: string | null; slug: string | null }> {
  const supabase = await createClient();

  const patch: Record<string, string> = { title: values.title };
  if (values.cover) patch.cover = values.cover;

  const { data, error } = await supabase
    .from("about_cards")
    .update(patch)
    .eq("id", id)
    .select("slug");

  if (error) {
    console.error("updateAboutCard failed:", error.message);
    return { ok: false, error: friendlyAboutError(error.message), slug: null };
  }

  return { ok: true, error: null, slug: data?.[0]?.slug ?? null };
}
