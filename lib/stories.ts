import * as fallbackData from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getLocalStoryBySlug, getAllLocalStories } from "@/lib/local-content-store";
import { getNarratorProfileById } from "@/lib/narrators";

export type StoryRecord = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  story_summary?: string | null;
  full_story_text?: string | null;
  cover_image_url?: string | null;
  audio_url?: string | null;
  subtitle_file_url?: string | null;
  duration_seconds?: number | null;
  category_id?: string | null;
  narrator_profile_id?: string | null;
  status?: string | null;
  featured?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  sources?: any[];
  timeline?: any[];
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string | null;
};

export type StorySourceRecord = {
  id?: string;
  story_id?: string;
  source_title: string;
  publisher?: string | null;
  source_url?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

export type StoryTimelineRecord = {
  id?: string;
  story_id?: string;
  event_date?: string | null;
  title: string;
  description?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
};

export type AdminOverview = {
  totals: {
    stories: number;
    published: number;
    drafts: number;
    featured: number;
    subtitleReady: number;
    audioReady: number;
    totalAudioMinutes: number;
  };
  recentStories: StoryRecord[];
  recentPublished: StoryRecord[];
  draftQueue: StoryRecord[];
  categories: Array<CategoryRecord & { story_count: number }>;
  latestPublishedAt: string | null;
};

const fallbackStories: StoryRecord[] = Array.isArray((fallbackData as any).stories)
  ? ((fallbackData as any).stories as StoryRecord[])
  : [];

const fallbackCategories: CategoryRecord[] = Array.isArray((fallbackData as any).categories)
  ? ((fallbackData as any).categories as CategoryRecord[])
  : [];

const fallbackSources: StorySourceRecord[] = Array.isArray((fallbackData as any).sources)
  ? ((fallbackData as any).sources as StorySourceRecord[])
  : [];

const fallbackTimeline: StoryTimelineRecord[] = Array.isArray((fallbackData as any).timeline)
  ? ((fallbackData as any).timeline as StoryTimelineRecord[])
  : [];

function sortByDateDesc<T extends { published_at?: string | null; created_at?: string | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const aDate = new Date(a.published_at || a.created_at || 0).getTime();
    const bDate = new Date(b.published_at || b.created_at || 0).getTime();
    return bDate - aDate;
  });
}

function normalizeStory(story: any): StoryRecord {
  return {
    id: String(story.id),
    title: story.title ?? "",
    slug: story.slug ?? "",
    short_description: story.short_description ?? null,
    story_summary: story.story_summary ?? null,
    full_story_text: story.full_story_text ?? null,
    cover_image_url: story.cover_image_url ?? null,
    audio_url: story.audio_url ?? null,
    subtitle_file_url: story.subtitle_file_url ?? null,
    duration_seconds:
      typeof story.duration_seconds === "number" ? story.duration_seconds : null,
    category_id: story.category_id ?? null,
    narrator_profile_id: story.narrator_profile_id ?? "east-africa-documentary",
    status: story.status ?? "draft",
    featured: Boolean(story.featured),
    published_at: story.published_at ?? null,
    created_at: story.created_at ?? null,
    updated_at: story.updated_at ?? null,
    created_by: story.created_by ?? null,
    sources: Array.isArray(story.sources) ? story.sources : [],
    timeline: Array.isArray(story.timeline) ? story.timeline : [],
  };
}

function normalizeCategory(category: any): CategoryRecord {
  return {
    id: String(category.id),
    name: category.name ?? "",
    slug: category.slug ?? "",
    description: category.description ?? null,
    created_at: category.created_at ?? null,
  };
}

function mapCategoryCounts(
  categories: CategoryRecord[],
  stories: StoryRecord[],
): Array<CategoryRecord & { story_count: number }> {
  return categories.map((category) => ({
    ...category,
    story_count: stories.filter((story) => story.category_id === category.id).length,
  }));
}

export async function getStories(options?: {
  includeDrafts?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<StoryRecord[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const featuredOnly = options?.featuredOnly ?? false;
  const limit = options?.limit;

  const localStories = (await getAllLocalStories()).map(normalizeStory);

  let stories = localStories.length > 0 ? localStories : [...fallbackStories];

  if (!includeDrafts) {
    stories = stories.filter((story) => story.status === "published");
  }

  if (featuredOnly) {
    stories = stories.filter((story) => Boolean(story.featured));
  }

  stories = sortByDateDesc(stories);

  if (typeof limit === "number") {
    stories = stories.slice(0, limit);
  }

  return stories;
}

export async function getPublishedStories(limit?: number): Promise<StoryRecord[]> {
  return getStories({ includeDrafts: false, limit });
}

export async function getFeaturedStories(limit = 6): Promise<StoryRecord[]> {
  return getStories({ featuredOnly: true, includeDrafts: false, limit });
}

export async function getFeaturedStory() {
  const [stories, categories] = await Promise.all([
    getFeaturedStories(1),
    getCategories(),
  ]);

  const story = stories[0] ?? null;
  if (!story) return null;

  const category =
    categories.find((item) => item.id === story.category_id)?.name?.toUpperCase() ?? "HISTORY";

  const minutes = story.duration_seconds
    ? `${Math.max(1, Math.round(story.duration_seconds / 60))} min`
    : "12 min";

  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    category,
    summary: story.story_summary || story.short_description || "",
    duration: minutes,
    audioLabel: "Kiswahili cha Afrika Mashariki",
  };
}

export async function getLatestStories(limit = 6): Promise<StoryRecord[]> {
  return getStories({ includeDrafts: false, limit });
}

export async function getCategories(): Promise<CategoryRecord[]> {
  return [...fallbackCategories].map(normalizeCategory);
}

export async function getCategoriesWithCounts(): Promise<
  Array<CategoryRecord & { story_count: number }>
> {
  const [categories, stories] = await Promise.all([
    getCategories(),
    getPublishedStories(),
  ]);

  return mapCategoryCounts(categories, stories);
}

export async function getStoryBySlug(
  slug: string,
): Promise<{
  story: StoryRecord | null;
  category: CategoryRecord | null;
  sources: StorySourceRecord[];
  timeline: StoryTimelineRecord[];
  narrator: ReturnType<typeof getNarratorProfileById>;
} | null> {
  if (!slug) return null;

  const localStory = await getLocalStoryBySlug(slug);
  const story = localStory ? normalizeStory(localStory) : fallbackStories.find((item) => item.slug === slug) ?? null;

  if (!story) return null;

  const category =
    fallbackCategories.find((item) => item.id === story.category_id) ?? null;

  const sources = Array.isArray(story.sources) && story.sources.length > 0
    ? story.sources
    : fallbackSources.filter((item) => item.story_id === story.id);

  const timeline = Array.isArray(story.timeline) && story.timeline.length > 0
    ? story.timeline
    : fallbackTimeline
        .filter((item) => item.story_id === story.id)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const narrator = getNarratorProfileById(story.narrator_profile_id);

  return { story, category, sources, timeline, narrator };
}

export async function getRelatedStories(
  storyId: string,
  categoryId?: string | null,
  limit = 3,
): Promise<StoryRecord[]> {
  const allStories = await getPublishedStories();

  let related = allStories.filter((story) => story.id !== storyId);

  if (categoryId) {
    const sameCategory = related.filter((story) => story.category_id === categoryId);
    if (sameCategory.length > 0) {
      related = sameCategory;
    }
  }

  return sortByDateDesc(related).slice(0, limit);
}

export async function getAdminStories(): Promise<StoryRecord[]> {
  return getStories({ includeDrafts: true });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [stories, categories] = await Promise.all([
    getStories({ includeDrafts: true }),
    getCategories(),
  ]);

  const published = stories.filter((story) => story.status === "published");
  const drafts = stories.filter((story) => story.status !== "published");
  const featured = stories.filter((story) => Boolean(story.featured));
  const subtitleReady = stories.filter((story) => Boolean(story.subtitle_file_url));
  const audioReady = stories.filter((story) => Boolean(story.audio_url));
  const totalAudioMinutes = stories.reduce((sum, story) => {
    const seconds = typeof story.duration_seconds === "number" ? story.duration_seconds : 0;
    return sum + seconds / 60;
  }, 0);

  const recentStories = sortByDateDesc(stories).slice(0, 8);
  const recentPublished = sortByDateDesc(published).slice(0, 6);
  const draftQueue = sortByDateDesc(drafts).slice(0, 6);
  const categoriesWithCounts = mapCategoryCounts(categories, stories);

  const latestPublishedAt =
    sortByDateDesc(published)[0]?.published_at ||
    sortByDateDesc(published)[0]?.created_at ||
    null;

  return {
    totals: {
      stories: stories.length,
      published: published.length,
      drafts: drafts.length,
      featured: featured.length,
      subtitleReady: subtitleReady.length,
      audioReady: audioReady.length,
      totalAudioMinutes: Math.round(totalAudioMinutes),
    },
    recentStories,
    recentPublished,
    draftQueue,
    categories: categoriesWithCounts,
    latestPublishedAt,
  };
}