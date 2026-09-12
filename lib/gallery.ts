import { createClient } from "./supabase/server";

export interface GalleryFolder {
  id: string;
  slug: string;
  name: string;
}

export interface GalleryImage {
  id: string;
  folderId: string;
  title: string;
  imageUrl: string;
  date: string | null;
}

interface FolderRow {
  id: string;
  slug: string;
  name: string;
}

interface ImageRow {
  id: string;
  folder_id: string;
  title: string;
  image_url: string;
  date: string | null;
  folders: { id: string; slug: string; name: string } | null;
}

const IMAGE_SELECT = `
  id,
  folder_id,
  title,
  image_url,
  date,
  gallery_folders ( id, slug, name )
`;

function toImage(row: ImageRow): GalleryImage {
  return {
    id: row.id,
    folderId: row.folders?.id ?? row.folder_id,
    title: row.title,
    imageUrl: row.image_url,
    date: row.date,
  };
}

export async function getGalleryFolders(): Promise<GalleryFolder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_folders")
    .select("id, slug, name")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getGalleryFolders failed:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select(IMAGE_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getGalleryImages failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ImageRow[]).map(toImage);
}

export async function getGalleryImage(
  id: string,
): Promise<(GalleryImage & { folder: GalleryFolder | null }) | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select(IMAGE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getGalleryImage failed:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as ImageRow;
  return {
    ...toImage(row),
    folder: row.folders
      ? { id: row.folders.id, slug: row.folders.slug, name: row.folders.name }
      : null,
  };
}

export async function createGalleryImage(values: {
  folderId: string;
  title: string;
  imageUrl: string;
  date: string | null;
}): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      folder_id: values.folderId,
      title: values.title,
      image_url: values.imageUrl,
      date: values.date || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createGalleryImage failed:", error.message);
    return null;
  }

  return data.id;
}

export async function updateGalleryImage(
  id: string,
  values: {
    folderId: string;
    title: string;
    imageUrl: string;
    date: string | null;
  },
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery_images")
    .update({
      folder_id: values.folderId,
      title: values.title,
      image_url: values.imageUrl,
      date: values.date || null,
    })
    .eq("id", id);

  if (error) {
    console.error("updateGalleryImage failed:", error.message);
    return false;
  }

  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteGalleryImage failed:", error.message);
    return false;
  }

  return true;
}
