import { createClient } from "./supabase/server";

export const CV_MIGRATION = "lib/supabase/migrations/006_cv.sql";

export interface CvDocument {
  id: string;
  title: string;
  fileUrl: string;
  sortOrder: number;
}

interface CvDocumentRow {
  id: string;
  title: string;
  file_url: string;
  sort_order: number;
}

const CV_SELECT = "id, title, file_url, sort_order";

function toCvDocument(row: CvDocumentRow): CvDocument {
  return {
    id: row.id,
    title: row.title,
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

export function friendlyCvError(message: string): string {
  if (isMissingTable(message)) {
    return `CV table not found. Run the SQL in ${CV_MIGRATION} in your Supabase project first.`;
  }
  return message;
}

export async function getCvDocuments(): Promise<CvDocument[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cv_documents")
    .select(CV_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTable(error.message)) {
      console.error("getCvDocuments failed:", error.message);
    }
    return [];
  }

  return ((data ?? []) as unknown as CvDocumentRow[]).map(toCvDocument);
}

// Viewer e jei-ta dekhabe — sort_order onujayi prothom ta
export async function getActiveCv(): Promise<CvDocument | null> {
  const documents = await getCvDocuments();
  return documents[0] ?? null;
}

export async function getCvDocument(id: string): Promise<CvDocument | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cv_documents")
    .select(CV_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getCvDocument failed:", error.message);
    return null;
  }

  return data ? toCvDocument(data as unknown as CvDocumentRow) : null;
}

export async function createCvDocument(values: {
  title: string;
  fileUrl: string;
  sortOrder: number;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cv_documents")
    .insert({
      title: values.title,
      file_url: values.fileUrl,
      sort_order: values.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createCvDocument failed:", error.message);
    return { id: null, error: friendlyCvError(error.message) };
  }

  return { id: data.id, error: null };
}

export async function updateCvDocument(
  id: string,
  values: {
    title: string;
    fileUrl: string;
    sortOrder: number;
  },
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cv_documents")
    .update({
      title: values.title,
      file_url: values.fileUrl,
      sort_order: values.sortOrder,
    })
    .eq("id", id);

  if (error) {
    console.error("updateCvDocument failed:", error.message);
    return { ok: false, error: friendlyCvError(error.message) };
  }

  return { ok: true, error: null };
}

export async function deleteCvDocument(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("cv_documents").delete().eq("id", id);

  if (error) {
    console.error("deleteCvDocument failed:", error.message);
    return false;
  }

  return true;
}
