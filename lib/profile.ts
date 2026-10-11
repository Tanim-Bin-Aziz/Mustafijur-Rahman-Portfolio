import { createClient } from "./supabase/server";
import { DEFAULT_PROFILE, type ProfileData } from "@/data/profile";

export const PROFILE_MIGRATION = "lib/supabase/migrations/004_profile.sql";

const PROFILE_KEY = "main";

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

export function friendlyProfileError(message: string): string {
  if (isMissingTable(message)) {
    return `Profile table not found. Run the SQL in ${PROFILE_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

function mergeProfile(data: Partial<ProfileData> | null): ProfileData {
  if (!data || typeof data !== "object") {
    return structuredClone(DEFAULT_PROFILE);
  }

  const savedOrder = Array.isArray(data.sectionOrder)
    ? data.sectionOrder.filter((key) =>
        DEFAULT_PROFILE.sectionOrder.includes(key),
      )
    : [];

  return {
    ...structuredClone(DEFAULT_PROFILE),
    ...data,
    softSkills: {
      ...DEFAULT_PROFILE.softSkills,
      ...(data.softSkills ?? {}),
    },
    sectionOrder: [
      ...savedOrder,
      ...DEFAULT_PROFILE.sectionOrder.filter((key) => !savedOrder.includes(key)),
    ],
    sectionVisibility: {
      ...DEFAULT_PROFILE.sectionVisibility,
      ...(data.sectionVisibility ?? {}),
    },
  };
}

export async function getProfile(): Promise<ProfileData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_settings")
    .select("data")
    .eq("key", PROFILE_KEY)
    .maybeSingle();

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getProfile failed:", error.message);
    }
    return structuredClone(DEFAULT_PROFILE);
  }

  return mergeProfile((data?.data ?? null) as Partial<ProfileData> | null);
}

export async function saveProfile(
  profile: ProfileData,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from("profile_settings").upsert(
    {
      key: PROFILE_KEY,
      data: profile as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    console.error("saveProfile failed:", error.message);
    return { ok: false, error: friendlyProfileError(error.message) };
  }

  return { ok: true, error: null };
}
