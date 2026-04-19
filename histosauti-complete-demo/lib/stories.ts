import {
  categories as fallbackCategories,
  featuredStory as fallbackFeaturedStory,
  stories as fallbackStories,
  storySources as fallbackStorySources,
  storyTimeline as fallbackStoryTimeline
} from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getLocalStories } from "@/lib/local-content-store";
import type {
  CategoryRecord,
  StoryAdminRecord,
  StoryDetailRecord,
  StoryRecord,
  StorySourceRecord,
  StoryStatus,
  StoryTimelineEventRecord
} from "@/lib/types";

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds < 60) {
    return "Audio coming soon";
  }

  const minutes = Math.round(durationSeconds / 60);
  return `${minutes} min`;
}

function normalizeSource(record: any, index: number): StorySourceRecord {
  return {
    id: String(record.id || `source-${index + 1}`),
    title: record.source_title || record.title || "Untitled source",
    url: record.source_url || record.url || null,
    publisher: record.publisher || null,
    notes: record.notes || null
  };
}

function normalizeTimeline(record: any, index: number): StoryTimelineEventRecord {
  return {
    id: String(record.id || `timeline-${index + 1}`),
    yearLabel: record.year_label || record.yearLabel || "Timeline",
    title: record.event_title || record.title || "Untitled event",
    description: record.description || "",
    sortOrder: Number(record.sort_order ?? record.sortOrder ?? index)
  };
}

function mapStory(record: any): StoryAdminRecord {
  return {
    id: String(record.id),
    slug: record.slug,
    title: record.title,
    category: record.categories?.name || record.category || "Uncategorized",
    categoryId: record.category_id || record.categoryId || null,
    duration: formatDuration(record.duration_seconds ?? record.durationSeconds),
    durationSeconds: record.duration_seconds ?? record.durationSeconds ?? null,
    shortDescription: record.short_description || record.shortDescription || "No description yet.",
    summary: record.story_summary || record.summary || record.full_story_text || record.fullStoryText || "No summary yet.",
    fullStoryText: record.full_story_text || record.fullStoryText || "",
    featured: Boolean(record.featured),
    coverImage:
      record.cover_image_url ||
      record.coverImage ||
      "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1200&q=80",
    subtitleLanguage: record.subtitle_language === "en" ? "English" : record.subtitle_language || record.subtitleLanguage || "English",
    audioLanguage: record.language === "sw" ? "Kiswahili" : record.language || record.audioLanguage || "Kiswahili",
    audioUrl: record.audio_url || record.audioUrl || undefined,
    subtitleUrl: record.subtitle_file_url || record.subtitleUrl || undefined,
    publishedAt: record.published_at || record.publishedAt || record.created_at || null,
    status: (record.status || (record.published_at || record.publishedAt ? "published" : "draft")) as StoryStatus,
    sources: Array.isArray(record.story_sources)
      ? record.story_sources.map(normalizeSource)
      : Array.isArray(record.sources)
        ? record.sources.map(normalizeSource)
        : [],
    timeline: Array.isArray(record.story_timeline_events)
      ? record.story_timeline_events.map(normalizeTimeline).sort((a, b) => a.sortOrder - b.sortOrder)
      : Array.isArray(record.timeline)
        ? record.timeline.map(normalizeTimeline).sort((a, b) => a.sortOrder - b.sortOrder)
        : [],
    relatedStories: []
  };
}

async function mapFallbackStories(): Promise<StoryAdminRecord[]> {
  const localStories = await getLocalStories();
  const mappedFallback = fallbackStories.map((story) => ({
    ...story,
    fullStoryText: (story as StoryDetailRecord).fullStoryText || "",
    categoryId: fallbackCategories.includes(story.category) ? String(fallbackCategories.indexOf(story.category) + 1) : null,
    durationSeconds: story.durationSeconds ?? null,
    status: story.publishedAt ? "published" : "draft",
    sources: fallbackStorySources[story.slug] || [],
    timeline: fallbackStoryTimeline[story.slug] || [],
    relatedStories: []
  }));

  const localMapped = localStories.map(mapStory);
  const localSlugs = new Set(localMapped.map((item) => item.slug));
  return [...localMapped, ...mappedFallback.filter((item) => !localSlugs.has(item.slug))];
}

function getFallbackRelatedStories(currentSlug: string, category: string, items: StoryAdminRecord[]): StoryRecord[] {
  return items.filter((story) => story.slug !== currentSlug && story.category === category).slice(0, 3);
}

async function getRelatedStories(storyId: string, storySlug: string, categoryId?: string | null, categoryName?: string) {
  if (!isSupabaseConfigured || !supabase) {
    const items = await mapFallbackStories();
    return getFallbackRelatedStories(storySlug, categoryName || "", items);
  }

  let query = supabase
    .from("stories")
    .select("*, categories(name)")
    .neq("id", storyId)
    .eq("status", "published")
    .limit(3)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    const items = await mapFallbackStories();
    return getFallbackRelatedStories(storySlug, categoryName || "", items);
  }

  return data.map((item) => {
    const mapped = mapStory(item);
    return {
      ...mapped,
      sources: [],
      timeline: [],
      relatedStories: []
    } satisfies StoryDetailRecord;
  });
}

export async function getPublishedStories(): Promise<StoryRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    const items = await mapFallbackStories();
    return items.filter((item) => item.status === "published");
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    const items = await mapFallbackStories();
    return items.filter((item) => item.status === "published");
  }

  return data.map(mapStory);
}

export async function getFeaturedStory(): Promise<StoryRecord> {
  if (!isSupabaseConfigured || !supabase) {
    const items = await mapFallbackStories();
    return items.find((item) => item.featured) || items[0] || fallbackFeaturedStory;
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, categories(name)")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    const items = await mapFallbackStories();
    return items.find((item) => item.featured) || items[0] || fallbackFeaturedStory;
  }

  return mapStory(data);
}

export async function getStoryBySlug(slug: string): Promise<StoryDetailRecord | null> {
  if (!isSupabaseConfigured || !supabase) {
    const fallbackItems = await mapFallbackStories();
    const fallbackStory = fallbackItems.find((item) => item.slug === slug) || null;
    if (!fallbackStory) return null;
    return {
      ...fallbackStory,
      relatedStories: getFallbackRelatedStories(fallbackStory.slug, fallbackStory.category, fallbackItems)
    };
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, categories(name), story_sources(*), story_timeline_events(*)")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    const fallbackItems = await mapFallbackStories();
    const fallbackStory = fallbackItems.find((item) => item.slug === slug) || null;
    if (!fallbackStory) return null;
    return {
      ...fallbackStory,
      relatedStories: getFallbackRelatedStories(fallbackStory.slug, fallbackStory.category, fallbackItems)
    };
  }

  const mapped = mapStory(data);
  const relatedStories = await getRelatedStories(mapped.id, mapped.slug, mapped.categoryId, mapped.category);

  return {
    ...mapped,
    sources: mapped.sources.length ? mapped.sources : fallbackStorySources[mapped.slug] || [],
    timeline: mapped.timeline.length ? mapped.timeline : fallbackStoryTimeline[mapped.slug] || [],
    relatedStories
  };
}

export async function getCategories(): Promise<CategoryRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackCategories.map((category, index) => ({
      id: String(index + 1),
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, "-"),
      description: `${category} stories available for HistoSauti.`
    }));
  }

  const { data, error } = await supabase.from("categories").select("id, name, slug, description").order("name");

  if (error || !data || data.length === 0) {
    return fallbackCategories.map((category, index) => ({
      id: String(index + 1),
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, "-"),
      description: `${category} stories available for HistoSauti.`
    }));
  }

  return data;
}

export async function getAdminStoryStats() {
  const fallbackItems = await mapFallbackStories();

  if (!isSupabaseConfigured || !supabase) {
    const publishedStories = fallbackItems.filter((item) => item.status === "published").length;
    const draftStories = fallbackItems.filter((item) => item.status === "draft").length;
    const featuredStories = fallbackItems.filter((item) => item.featured).length;
    const totalMinutes = Math.round(
      fallbackItems.reduce((acc, item) => acc + Math.max(0, Number(item.durationSeconds || 0)), 0) / 60
    );
    const audioReadyStories = fallbackItems.filter((item) => item.audioUrl).length;
    const subtitleReadyStories = fallbackItems.filter((item) => item.subtitleUrl).length;

    return {
      totalStories: fallbackItems.length,
      publishedStories,
      draftStories,
      featuredStories,
      totalMinutes,
      audioReadyStories,
      subtitleReadyStories,
      latestPublishedAt: fallbackItems.find((item) => item.publishedAt)?.publishedAt || null
    };
  }

  const { data, error } = await supabase
    .from("stories")
    .select("id, status, featured, duration_seconds, audio_url, subtitle_file_url, published_at");

  if (error || !data) {
    const publishedStories = fallbackItems.filter((item) => item.status === "published").length;
    const draftStories = fallbackItems.filter((item) => item.status === "draft").length;
    const featuredStories = fallbackItems.filter((item) => item.featured).length;
    const totalMinutes = Math.round(
      fallbackItems.reduce((acc, item) => acc + Math.max(0, Number(item.durationSeconds || 0)), 0) / 60
    );
    const audioReadyStories = fallbackItems.filter((item) => item.audioUrl).length;
    const subtitleReadyStories = fallbackItems.filter((item) => item.subtitleUrl).length;

    return {
      totalStories: fallbackItems.length,
      publishedStories,
      draftStories,
      featuredStories,
      totalMinutes,
      audioReadyStories,
      subtitleReadyStories,
      latestPublishedAt: fallbackItems.find((item) => item.publishedAt)?.publishedAt || null
    };
  }

  const totalStories = data.length;
  const publishedStories = data.filter((item) => item.status === "published").length;
  const draftStories = data.filter((item) => item.status === "draft").length;
  const featuredStories = data.filter((item) => Boolean(item.featured)).length;
  const totalMinutes = Math.round(
    data.reduce((acc, item) => acc + Math.max(0, Number(item.duration_seconds || 0)), 0) / 60
  );
  const audioReadyStories = data.filter((item) => item.audio_url).length;
  const subtitleReadyStories = data.filter((item) => item.subtitle_file_url).length;
  const latestPublishedAt = data
    .map((item) => item.published_at)
    .filter(Boolean)
    .sort()
    .reverse()[0] || null;

  return {
    totalStories,
    publishedStories,
    draftStories,
    featuredStories,
    totalMinutes,
    audioReadyStories,
    subtitleReadyStories,
    latestPublishedAt
  };
}

export async function getAdminStories(): Promise<StoryAdminRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mapFallbackStories();
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return mapFallbackStories();
  }

  return data.map(mapStory);
}

export async function getAdminStoryById(id: string): Promise<StoryAdminRecord | null> {
  if (!isSupabaseConfigured || !supabase) {
    const items = await mapFallbackStories();
    return items.find((story) => story.id === id) || null;
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, categories(name), story_sources(*), story_timeline_events(*)")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapStory(data);
}

export async function getAdminCategoryBreakdown() {
  const stories = await getAdminStories();
  const categories = await getCategories();

  return categories.map((category) => {
    const items = stories.filter((story) => story.categoryId === category.id || story.category === category.name);
    const published = items.filter((item) => item.status === "published").length;
    const drafts = items.filter((item) => item.status === "draft").length;
    const featured = items.filter((item) => item.featured).length;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      count: items.length,
      published,
      drafts,
      featured,
      latestStory: items[0] || null
    };
  });
}

export async function getAdminOverview() {
  const [stats, stories, categoryBreakdown] = await Promise.all([
    getAdminStoryStats(),
    getAdminStories(),
    getAdminCategoryBreakdown()
  ]);

  const recentStories = [...stories].slice(0, 6);
  const recentDrafts = stories.filter((story) => story.status === "draft").slice(0, 4);
  const recentlyPublished = stories
    .filter((story) => story.status === "published")
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")))
    .slice(0, 4);

  return {
    stats,
    recentStories,
    recentDrafts,
    recentlyPublished,
    categoryBreakdown
  };
}
