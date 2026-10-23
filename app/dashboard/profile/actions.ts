"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isUploadedFile, uploadProjectImage } from "@/lib/storage";
import { saveProfile, friendlyProfileError } from "@/lib/profile";
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

  try {
    const logoFile = formData.get("logo");
    if (isUploadedFile(logoFile) && logoFile.size > 0) {
      draft.avatar = await uploadProjectImage(logoFile, "profile");
    }

    const skillLogoUrls = new Map<string, string>();
    const skillTagLogoUrls = new Map<string, string>();
    const softwareLogoUrls = new Map<string, string>();
    for (const [fieldKey, value] of formData.entries()) {
      if (!isUploadedFile(value) || value.size <= 0) continue;
      if (fieldKey.startsWith("skill-tag-icon-")) {
        skillTagLogoUrls.set(
          fieldKey.slice("skill-tag-icon-".length),
          await uploadProjectImage(value, "profile-skills"),
        );
      } else if (fieldKey.startsWith("skill-icon-")) {
        skillLogoUrls.set(
          fieldKey.slice("skill-icon-".length),
          await uploadProjectImage(value, "profile-skills"),
        );
      } else if (fieldKey.startsWith("software-icon-")) {
        softwareLogoUrls.set(
          fieldKey.slice("software-icon-".length),
          await uploadProjectImage(value, "profile-skills"),
        );
      }
    }

    for (const category of draft.skillCategories) {
      if (
        typeof category.iconImage === "string" &&
        category.iconImage.startsWith("upload:")
      ) {
        const url = skillLogoUrls.get(category.iconImage.slice(7));
        if (url) category.iconImage = url;
        else delete category.iconImage;
      }
      for (const item of category.items) {
        if (
          typeof item.iconImage === "string" &&
          item.iconImage.startsWith("upload:")
        ) {
          const url = skillTagLogoUrls.get(item.iconImage.slice(7));
          if (url) item.iconImage = url;
          else delete item.iconImage;
        }
      }
    }

    for (const tool of draft.softwareTools) {
      if (
        typeof tool.iconImage === "string" &&
        tool.iconImage.startsWith("upload:")
      ) {
        const url = softwareLogoUrls.get(tool.iconImage.slice(7));
        if (url) tool.iconImage = url;
        else delete tool.iconImage;
      }
    }

    const { ok, error } = await saveProfile(draft);
    if (!ok) return { error: error ?? "Could not save the profile.", saved: false };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? friendlyProfileError(error.message)
          : "Upload failed.",
      saved: false,
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/profile");
  return { error: null, saved: true };
}
