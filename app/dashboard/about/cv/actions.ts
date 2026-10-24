"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createCvDocument,
  updateCvDocument,
  deleteCvDocument,
} from "@/lib/cv";

export type CvFormState = {
  error: string | null;
};

function readValues(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const sortOrder = Number.parseInt(
    String(formData.get("sortOrder") || "0"),
    10,
  );

  return {
    title,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

function readFileUrl(formData: FormData) {
  return String(formData.get("fileUrl") || "").trim();
}

export async function addCvDocument(
  _prevState: CvFormState,
  formData: FormData,
): Promise<CvFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const values = readValues(formData);
  const fileUrl = readFileUrl(formData);

  if (!fileUrl) return { error: "Please upload a PDF or provide a URL." };

  const { id, error } = await createCvDocument({
    ...values,
    fileUrl,
  });

  if (!id) return { error: error ?? "Could not save the CV." };

  revalidatePath("/about/cv");
  revalidatePath("/dashboard/about");
  redirect("/dashboard/about?saved=cv");
}

export async function editCvDocument(
  _prevState: CvFormState,
  formData: FormData,
): Promise<CvFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const cvId = String(formData.get("cvId") || "");
  if (!cvId) return { error: "Missing CV id." };

  const values = readValues(formData);
  const fileUrl = readFileUrl(formData);

  if (!fileUrl) return { error: "Please upload a PDF or provide a URL." };

  const { ok, error } = await updateCvDocument(cvId, {
    ...values,
    fileUrl,
  });

  if (!ok) return { error: error ?? "Could not update the CV." };

  revalidatePath("/about/cv");
  revalidatePath("/dashboard/about");
  redirect("/dashboard/about?saved=cv");
}

export async function removeCvDocument(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const cvId = String(formData.get("cvId") || "");
  if (!cvId) return;

  await deleteCvDocument(cvId);

  revalidatePath("/about/cv");
  revalidatePath("/dashboard/about");
}
