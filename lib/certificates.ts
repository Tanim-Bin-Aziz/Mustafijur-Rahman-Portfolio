import { createClient } from "./supabase/server";

export const CERTIFICATES_MIGRATION =
  "lib/supabase/migrations/005_certificates.sql";

export interface Certificate {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  sortOrder: number;
}

interface CertificateRow {
  id: string;
  title: string;
  description: string;
  file_url: string;
  sort_order: number;
}

const CERTIFICATE_SELECT = "id, title, description, file_url, sort_order";

export function isPdfUrl(url: string) {
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}

function toCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    sortOrder: row.sort_order,
  };
}

function isMissingTable(message: string) {
  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("42P01")
  );
}

export function friendlyCertificateError(message: string): string {
  if (isMissingTable(message)) {
    return `Certificates table not found. Run the SQL in ${CERTIFICATES_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(CERTIFICATE_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getCertificates failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as CertificateRow[]).map(toCertificate);
}

export async function getCertificate(
  id: string,
): Promise<Certificate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(CERTIFICATE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getCertificate failed:", error.message);
    return null;
  }

  return data ? toCertificate(data as unknown as CertificateRow) : null;
}

export async function createCertificate(values: {
  title: string;
  description: string;
  fileUrl: string;
  sortOrder: number;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      title: values.title,
      description: values.description,
      file_url: values.fileUrl,
      sort_order: values.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createCertificate failed:", error.message);
    return { id: null, error: friendlyCertificateError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateCertificate(
  id: string,
  values: {
    title: string;
    description: string;
    fileUrl: string;
    sortOrder: number;
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("certificates")
    .update({
      title: values.title,
      description: values.description,
      file_url: values.fileUrl,
      sort_order: values.sortOrder,
    })
    .eq("id", id);

  if (error) {
    console.error("updateCertificate failed:", error.message);
    return { ok: false, error: friendlyCertificateError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("certificates").delete().eq("id", id);

  if (error) {
    console.error("deleteCertificate failed:", error.message);
    return false;
  }

  return true;
}
