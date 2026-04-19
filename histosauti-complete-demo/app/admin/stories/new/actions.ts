"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/auth/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uploadIfPresent(bucket: string, folder: string, file: File | null, slug: string) {
  if (!file || file.size === 0 || !supabase) {
    return null;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const filePath = `${folder}/${slug}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, bytes, {
    contentType: file.type || undefined,
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createStoryAction(formData: FormData) {
  if (!isSupabaseConfigured || !supabase) {
    redirect("/login?error=Unganisha+Supabase+kwanza+kwenye+env+vars");
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login?error=Tafadhali+ingia+kwanza+kuongeza+story");
  }

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const storySummary = String(formData.get("story_summary") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();
  const coverImageUrlInput = String(formData.get("cover_image_url") || "").trim();
  const audioUrlInput = String(formData.get("audio_url") || "").trim();
  const subtitleUrlInput = String(formData.get("subtitle_file_url") || "").trim();
  const durationSecondsValue = String(formData.get("duration_seconds") || "").trim();
  const featured = String(formData.get("featured") || "") === "on";

  if (!title || !categoryId) {
    redirect("/admin/stories/new?error=Title+na+category+ni+lazima");
  }

  const slug = slugify(rawSlug || title);
  const coverImageFile = formData.get("cover_image_file") as File | null;
  const audioFile = formData.get("audio_file") as File | null;
  const subtitleFile = formData.get("subtitle_file") as File | null;

  try {
    const [coverImageUrl, audioUrl, subtitleFileUrl] = await Promise.all([
      uploadIfPresent("story-covers", "covers", coverImageFile, slug),
      uploadIfPresent("story-audio", "audio", audioFile, slug),
      uploadIfPresent("story-subtitles", "subtitles", subtitleFile, slug)
    ]);

    const { error } = await supabase.from("stories").insert({
      title,
      slug,
      short_description: shortDescription,
      story_summary: storySummary,
      cover_image_url: coverImageUrl || coverImageUrlInput || null,
      audio_url: audioUrl || audioUrlInput || null,
      subtitle_file_url: subtitleFileUrl || subtitleUrlInput || null,
      category_id: categoryId,
      duration_seconds: durationSecondsValue ? Number(durationSecondsValue) : null,
      status,
      featured,
      language: "sw",
      subtitle_language: "en",
      published_at: status === "published" ? new Date().toISOString() : null
    });

    if (error) {
      redirect(`/admin/stories/new?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create story";
    redirect(`/admin/stories/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath("/admin");
  revalidatePath("/admin/stories");
  redirect(`/admin/stories?success=${encodeURIComponent("Story imehifadhiwa vizuri")}`);
}
