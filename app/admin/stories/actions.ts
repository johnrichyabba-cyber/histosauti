"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/server";
import {
  createLocalStoryRecord,
  getLocalStoryById,
  saveLocalMediaConfig,
  saveLocalStory,
} from "@/lib/local-content-store";
import { getCategories } from "@/lib/stories";

type StorySceneInput = {
  id?: string;
  title?: string;
  caption?: string;
  start_time_seconds?: number | string;
  end_time_seconds?: number | string;
  image_url?: string;
  ambience_url?: string;
  music_url?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseJsonArray<T>(value: FormDataEntryValue | null, fallback: T[] = []): T[] {
  if (!value || typeof value !== "string" || !value.trim()) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizeScenes(rawScenes: StorySceneInput[]) {
  return rawScenes.map((scene, index) => ({
    id: String(scene.id || `scene-${index + 1}`),
    title: String(scene.title || `Scene ${index + 1}`),
    caption: String(scene.caption || ""),
    start_time_seconds: toNumber(scene.start_time_seconds, index * 30),
    end_time_seconds: toNumber(scene.end_time_seconds, index * 30 + 29),
    image_url: String(scene.image_url || ""),
    ambience_url: String(scene.ambience_url || ""),
    music_url: String(scene.music_url || ""),
  }));
}

function normalizeGallery(rawGallery: string[]) {
  return rawGallery.map((item) => item.trim()).filter(Boolean);
}

export async function saveStoryStudioAction(formData: FormData) {
  const user = await getAuthenticatedUser().catch(() => null);

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput || slugify(title);
  const shortDescription = String(formData.get("short_description") || "").trim();
  const storySummary = String(formData.get("story_summary") || "").trim();
  const fullStoryText = String(formData.get("full_story_text") || "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") || "").trim();
  const audioUrl = String(formData.get("audio_url") || "").trim();
  const subtitleFileUrl = String(formData.get("subtitle_file_url") || "").trim();
  const narratorProfileId = String(formData.get("narrator_profile_id") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim();
  const featured = String(formData.get("featured") || "") === "true";
  const durationSeconds = toNumber(formData.get("duration_seconds"), 0);

  const galleryImages = normalizeGallery(
    parseJsonArray<string>(formData.get("gallery_images_json"), []),
  );

  const scenes = normalizeScenes(
    parseJsonArray<StorySceneInput>(formData.get("scenes_json"), []),
  );

  const sources = parseJsonArray(formData.get("sources_json"), []);
  const timeline = parseJsonArray(formData.get("timeline_json"), []);

  if (!title) {
    throw new Error("Title ni lazima.");
  }

  if (!slug) {
    throw new Error("Slug imeshindikana kutengenezwa.");
  }

  const categories = await getCategories();
  const matchedCategory =
    categories.find((item) => item.id === categoryId) ??
    categories.find((item) => item.slug === categoryId) ??
    null;

  const storyId = id || createLocalStoryRecord();
  const existing = id ? await getLocalStoryById(id) : null;

  await saveLocalStory({
    id: storyId,
    title,
    slug,
    short_description: shortDescription,
    story_summary: storySummary,
    full_story_text: fullStoryText,
    cover_image_url: coverImageUrl,
    audio_url: audioUrl,
    subtitle_file_url: subtitleFileUrl,
    duration_seconds: durationSeconds || null,
    category_id: matchedCategory?.id || categoryId || null,
    narrator_profile_id: narratorProfileId || "east-africa-documentary",
    status,
    featured,
    published_at:
      status === "published"
        ? existing?.published_at || new Date().toISOString()
        : existing?.published_at || null,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: user?.email || existing?.created_by || "local-admin",
    sources,
    timeline,
  });

  await saveLocalMediaConfig({
    story_slug: slug,
    cover_image_url: coverImageUrl,
    narration_url: audioUrl,
    ambience_url: "",
    music_url: "",
    gallery_images: galleryImages,
    scenes,
  });

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/stories");
  revalidatePath("/admin/stories/new");

  redirect("/admin/stories");
}