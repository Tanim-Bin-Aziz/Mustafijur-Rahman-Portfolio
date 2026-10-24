"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/lib/certificates";

export type CertificateFormState = {
  error: string | null;
};

function readValues(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sortOrder = Number.parseInt(
    String(formData.get("sortOrder") || "0"),
    10,
  );

  return {
    title,
    description,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

function readFileUrl(formData: FormData) {
  return String(formData.get("fileUrl") || "").trim();
}

export async function addCertificate(
  _prevState: CertificateFormState,
  formData: FormData,
): Promise<CertificateFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const values = readValues(formData);
  const fileUrl = readFileUrl(formData);

  if (!values.title) return { error: "Title is required." };

  if (!fileUrl) {
    return { error: "Please upload a file (jpg, png or pdf) or provide a URL." };
  }

  const { id, error } = await createCertificate({
    ...values,
    fileUrl,
  });

  if (!id) return { error: error ?? "Could not save the certificate." };

  revalidatePath("/");
  revalidatePath("/dashboard/certificates");
  redirect("/dashboard/certificates");
}

export async function editCertificate(
  _prevState: CertificateFormState,
  formData: FormData,
): Promise<CertificateFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in." };

  const certificateId = String(formData.get("certificateId") || "");
  if (!certificateId) return { error: "Missing certificate id." };

  const values = readValues(formData);
  const fileUrl = readFileUrl(formData);
  if (!values.title) return { error: "Title is required." };

  if (!fileUrl) {
    return { error: "Please upload a file (jpg, png or pdf) or provide a URL." };
  }

  const { ok, error } = await updateCertificate(certificateId, {
    ...values,
    fileUrl,
  });

  if (!ok) return { error: error ?? "Could not update the certificate." };

  revalidatePath("/");
  revalidatePath("/dashboard/certificates");
  redirect("/dashboard/certificates");
}

export async function removeCertificate(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const certificateId = String(formData.get("certificateId") || "");
  if (!certificateId) return;

  await deleteCertificate(certificateId);

  revalidatePath("/");
  revalidatePath("/dashboard/certificates");
}
