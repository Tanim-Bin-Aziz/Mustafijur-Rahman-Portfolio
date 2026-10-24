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

function toParagraph(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value as Record<string, unknown>)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (keys.length) {
      return keys
        .map((k) => (value as Record<string, unknown>)[k])
        .map((c) => (typeof c === "string" ? c : String(c ?? "")))
        .join("");
    }
  }
  return null;
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (!Array.isArray(value)) return structuredClone(fallback);
  const result = value
    .map(toParagraph)
    .filter((p): p is string => p !== null);
  return result.length ? result : structuredClone(fallback);
}

function normalizeAbout(value: unknown): string[] {
  return normalizeStringArray(value, DEFAULT_PROFILE.about);
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

  function isTooDark(hex: string): boolean {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex?.trim() ?? "");
    if (!m) return true;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum < 0.5;
  }

  const defaultColorFor = (label: string) =>
    DEFAULT_PROFILE.skillCategories.find((c) => c.label === label)?.color ??
    "#f59e0b";

  const skillCategories = Array.isArray(data.skillCategories)
    ? data.skillCategories.map((cat) => ({
        ...cat,
        color: isTooDark(String(cat?.color ?? ""))
          ? defaultColorFor(String(cat?.label ?? ""))
          : String(cat.color),
        items: Array.isArray(cat?.items)
          ? cat.items.map((it) => ({
              ...it,
              name: String(it?.name ?? "").trim(),
            }))
          : [],
      }))
    : DEFAULT_PROFILE.skillCategories;

  const experiences = Array.isArray(data.experiences)
    ? data.experiences.map((exp) => ({
        ...exp,
        bullets: normalizeStringArray(
          (exp as { bullets?: unknown })?.bullets,
          DEFAULT_PROFILE.experiences[0]?.bullets ?? [],
        ),
      }))
    : DEFAULT_PROFILE.experiences;

  const references = Array.isArray(data.references)
    ? data.references.map((ref) => ({
        ...ref,
        phones: normalizeStringArray(
          (ref as { phones?: unknown })?.phones,
          DEFAULT_PROFILE.references[0]?.phones ?? [],
        ),
      }))
    : DEFAULT_PROFILE.references;

  const softSkills = {
    ...DEFAULT_PROFILE.softSkills,
    ...(data.softSkills ?? {}),
    strengths: normalizeStringArray(
      (data.softSkills as { strengths?: unknown } | undefined)?.strengths,
      DEFAULT_PROFILE.softSkills.strengths,
    ),
    passions: normalizeStringArray(
      (data.softSkills as { passions?: unknown } | undefined)?.passions,
      DEFAULT_PROFILE.softSkills.passions,
    ),
  };

  return {
    ...structuredClone(DEFAULT_PROFILE),
    ...data,
    about: normalizeAbout(data.about),
    skillCategories,
    hobbies: normalizeStringArray(data.hobbies, DEFAULT_PROFILE.hobbies),
    softSkills,
    softwareTools: Array.isArray(data.softwareTools)
      ? data.softwareTools
      : DEFAULT_PROFILE.softwareTools,
    experiences,
    references,
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

// "upload:<key>" values are transient editor placeholders backed by a blob URL
// that only lives in the editor's session state. If one leaks into the DB it can
// never be recovered (the file was never uploaded), so drop it and fall back to
// the icon instead of handing a bogus src to next/image.
function dropUploadPlaceholders(profile: ProfileData) {
  for (const category of profile.skillCategories) {
    if (typeof category.iconImage === "string" && category.iconImage.startsWith("upload:")) {
      delete category.iconImage;
    }
    for (const item of category.items) {
      if (typeof item.iconImage === "string" && item.iconImage.startsWith("upload:")) {
        delete item.iconImage;
      }
    }
  }
  for (const tool of profile.softwareTools) {
    if (typeof tool.iconImage === "string" && tool.iconImage.startsWith("upload:")) {
      delete tool.iconImage;
    }
  }
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

  const profile = mergeProfile((data?.data ?? null) as Partial<ProfileData> | null);
  dropUploadPlaceholders(profile);
  return profile;
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
