"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { createLocalStoryRecord, getLocalStoryById, saveLocalMediaConfig, saveLocalStory } from "@/lib/local-content-store";
import { getCategories } from "@/lib/stories";
import type { StoryMediaConfig } from "@/lib/media-manager";

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

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

async function requireAdmin() {
  if (!isSupabaseConfigured || !supabase) {
    return { id: "local-studio", email: "local@studio.dev" };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login?error=Tafadhali+ingia+kwanza");
  }

  return user;
}

function parseTimelineEntries(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [yearLabel = "", title = "", ...descriptionParts] = line.split("|").map((item) => item.trim());
      return {
        id: `timeline-${index + 1}`,
        yearLabel,
        title,
        description: descriptionParts.join(" | "),
        sortOrder: index + 1,
        year_label: yearLabel,
        event_title: title,
        sort_order: index + 1
      };
    })
    .filter((item) => item.yearLabel && item.title);
}

function parseSourceEntries(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title = "", publisher = "", url = "", ...notesParts] = line.split("|").map((item) => item.trim());
      return {
        id: `source-${index + 1}`,
        title,
        publisher: publisher || null,
        url: url || null,
        notes: notesParts.join(" | ") || null,
        source_title: title,
        source_url: url || null,
      };
    })
    .filter((item) => item.title);
}

function parseGalleryEntries(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSceneEntries(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [
        id = `scene-${index + 1}`,
        title = "",
        startSeconds = "0",
        endSeconds = "0",
        imageUrl = "",
        ambienceUrl = "",
        musicUrl = "",
        ...captionParts
      ] = line.split("|").map((item) => item.trim());

      return {
        id,
        title,
        start_time_seconds: Number(startSeconds || 0),
        end_time_seconds: Number(endSeconds || 0),
        image_url: imageUrl || undefined,
        ambience_url: ambienceUrl || undefined,
        music_url: musicUrl || undefined,
        caption: captionParts.join(" | ") || undefined,
      };
    })
    .filter((item) => item.title);
}

async function buildInput(formData: FormData, uploaded: { coverImageUrl: string | null; audioUrl: string | null; subtitleFileUrl: string | null }) {
  const categories = await getCategories();
  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const storySummary = String(formData.get("story_summary") || "").trim();
  const fullStoryText = String(formData.get("full_story_text") || "").trim();
  const categoryId = String(formData.get("category_id") || "").trim();
  const status = String(formData.get("status") || "draft").trim() as "draft" | "published";
  const coverImageUrlInput = String(formData.get("cover_image_url") || "").trim();
  const audioUrlInput = String(formData.get("audio_url") || "").trim();
  const subtitleUrlInput = String(formData.get("subtitle_file_url") || "").trim();
  const durationSecondsValue = String(formData.get("duration_seconds") || "").trim();
  const featured = String(formData.get("featured") || "") === "on";
  const timelineEntriesRaw = String(formData.get("timeline_entries") || "").trim();
  const sourceEntriesRaw = String(formData.get("sources_entries") || "").trim();
  const mediaGalleryRaw = String(formData.get("media_gallery_entries") || "").trim();
  const mediaSceneRaw = String(formData.get("media_scene_entries") || "").trim();
  const mediaAmbienceUrl = String(formData.get("media_ambience_url") || "").trim();
  const mediaMusicUrl = String(formData.get("media_music_url") || "").trim();

  if (!title || !categoryId) {
    throw new Error("Title na category ni lazima");
  }

  const slug = slugify(rawSlug || title);
  const category = categories.find((item) => item.id === categoryId);
  const timelineEntries = parseTimelineEntries(timelineEntriesRaw);
  const sourceEntries = parseSourceEntries(sourceEntriesRaw);
  const galleryImages = parseGalleryEntries(mediaGalleryRaw);
  const scenes = parseSceneEntries(mediaSceneRaw);
  const durationSeconds = durationSecondsValue ? Number(durationSecondsValue) : null;
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const payload = {
    title,
    slug,
    short_description: shortDescription,
    story_summary: storySummary,
    full_story_text: fullStoryText || null,
    cover_image_url: uploaded.coverImageUrl || coverImageUrlInput || null,
    audio_url: uploaded.audioUrl || audioUrlInput || null,
    subtitle_file_url: uploaded.subtitleFileUrl || subtitleUrlInput || null,
    category_id: categoryId,
    duration_seconds: durationSeconds,
    status,
    featured,
    language: "sw",
    subtitle_language: "en",
    published_at: publishedAt
  };

  const mediaConfig: StoryMediaConfig = {
    story_slug: slug,
    cover_image_url: payload.cover_image_url || undefined,
    narration_url: payload.audio_url || undefined,
    ambience_url: mediaAmbienceUrl || undefined,
    music_url: mediaMusicUrl || undefined,
    gallery_images: galleryImages,
    scenes,
  };

  const localStory = createLocalStoryRecord({
    slug,
    title,
    category: category?.name || "Uncategorized",
    categoryId,
    shortDescription,
    summary: storySummary,
    fullStoryText,
    coverImage: payload.cover_image_url || mediaConfig.cover_image_url || "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1200&q=80",
    audioUrl: payload.audio_url || undefined,
    subtitleUrl: payload.subtitle_file_url || undefined,
    durationSeconds,
    featured,
    status,
    publishedAt,
    sources: sourceEntries.map((item) => ({
      id: item.id,
      title: item.title,
      publisher: item.publisher,
      url: item.url,
      notes: item.notes,
    })),
    timeline: timelineEntries.map((item) => ({
      id: item.id,
      yearLabel: item.yearLabel,
      title: item.title,
      description: item.description,
      sortOrder: item.sortOrder,
    })),
  });

  return { payload, timelineEntries, sourceEntries, mediaConfig, localStory };
}

async function replaceStoryRelations(storyId: string, timelineEntries: ReturnType<typeof parseTimelineEntries>, sourceEntries: ReturnType<typeof parseSourceEntries>) {
  const timelineDelete = await supabase!.from("story_timeline_events").delete().eq("story_id", storyId);
  if (timelineDelete.error) throw new Error(timelineDelete.error.message);

  const sourcesDelete = await supabase!.from("story_sources").delete().eq("story_id", storyId);
  if (sourcesDelete.error) throw new Error(sourcesDelete.error.message);

  if (timelineEntries.length > 0) {
    const timelineInsert = await supabase!.from("story_timeline_events").insert(
      timelineEntries.map((entry) => ({
        story_id: storyId,
        year_label: entry.yearLabel,
        event_title: entry.title,
        description: entry.description,
        sort_order: entry.sortOrder,
      }))
    );
    if (timelineInsert.error) throw new Error(timelineInsert.error.message);
  }

  if (sourceEntries.length > 0) {
    const sourcesInsert = await supabase!.from("story_sources").insert(
      sourceEntries.map((entry) => ({
        story_id: storyId,
        source_title: entry.title,
        publisher: entry.publisher,
        source_url: entry.url,
        notes: entry.notes,
      }))
    );
    if (sourcesInsert.error) throw new Error(sourcesInsert.error.message);
  }
}

export async function createStoryAction(formData: FormData) {
  await requireAdmin();

  try {
    const rawSlug = String(formData.get("slug") || formData.get("title") || "story");
    const safeSlug = slugify(rawSlug);
    const coverImageFile = formData.get("cover_image_file") as File | null;
    const audioFile = formData.get("audio_file") as File | null;
    const subtitleFile = formData.get("subtitle_file") as File | null;

    const uploaded = {
      coverImageUrl: await uploadIfPresent("story-covers", "covers", coverImageFile, safeSlug),
      audioUrl: await uploadIfPresent("story-audio", "audio", audioFile, safeSlug),
      subtitleFileUrl: await uploadIfPresent("story-subtitles", "subtitles", subtitleFile, safeSlug)
    };

    const { payload, timelineEntries, sourceEntries, mediaConfig, localStory } = await buildInput(formData, uploaded);

    await saveLocalMediaConfig(mediaConfig);

    if (!isSupabaseConfigured || !supabase) {
      await saveLocalStory(localStory);
    } else {
      const { data, error } = await supabase.from("stories").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      await replaceStoryRelations(String(data.id), timelineEntries, sourceEntries);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create story";
    redirect(`/admin/stories/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath("/admin");
  revalidatePath("/admin/stories");
  redirect(`/admin/stories?success=${encodeURIComponent("Story + media zimehifadhiwa vizuri")}`);
}

export async function updateStoryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    redirect(`/admin/stories?error=${encodeURIComponent("ID ya story haipo")}`);
  }

  try {
    const rawSlug = String(formData.get("slug") || formData.get("title") || "story");
    const safeSlug = slugify(rawSlug);
    const coverImageFile = formData.get("cover_image_file") as File | null;
    const audioFile = formData.get("audio_file") as File | null;
    const subtitleFile = formData.get("subtitle_file") as File | null;

    const uploaded = {
      coverImageUrl: await uploadIfPresent("story-covers", "covers", coverImageFile, safeSlug),
      audioUrl: await uploadIfPresent("story-audio", "audio", audioFile, safeSlug),
      subtitleFileUrl: await uploadIfPresent("story-subtitles", "subtitles", subtitleFile, safeSlug)
    };

    const { payload, timelineEntries, sourceEntries, mediaConfig, localStory } = await buildInput(formData, uploaded);

    await saveLocalMediaConfig(mediaConfig);

    if (!isSupabaseConfigured || !supabase) {
      const existing = await getLocalStoryById(id);
      await saveLocalStory({
        ...localStory,
        id: existing?.id || id,
      });
    } else {
      const { error } = await supabase.from("stories").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      await replaceStoryRelations(id, timelineEntries, sourceEntries);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update story";
    redirect(`/admin/stories/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath("/admin");
  revalidatePath("/admin/stories");
  redirect(`/admin/stories?success=${encodeURIComponent("Story + media zimeboreshwa vizuri")}`);
}
