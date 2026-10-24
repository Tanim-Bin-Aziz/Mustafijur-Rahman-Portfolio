"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { saveProfile } from "@/lib/profile";
import { DEFAULT_PROFILE, type ProfileData } from "@/data/profile";

export type ProfileFormState = {
  error: string | null;
  saved: boolean;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in.", saved: false };

  const raw = String(formData.get("data") || "");
  if (!raw) return { error: "Missing profile data.", saved: false };

  let draft: ProfileData;
  try {
    const parsed = JSON.parse(raw) as Partial<ProfileData>;
    draft = { ...structuredClone(DEFAULT_PROFILE), ...parsed };
    if (!Array.isArray(draft.softwareTools)) {
      draft.softwareTools = structuredClone(DEFAULT_PROFILE.softwareTools);
    }
  } catch {
    return { error: "Invalid profile data.", saved: false };
  }

  if (!draft.name?.trim()) {
    return { error: "Name is required.", saved: false };
  }

  const { ok, error } = await saveProfile(draft);
  if (!ok) return { error: error ?? "Could not save the profile.", saved: false };

  revalidatePath("/profile");
  revalidatePath("/dashboard/profile");
  return { error: null, saved: true };
}
