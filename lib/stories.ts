import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type StoryScene = {
  id: string;
  title: string;
  time: string;
  summary: string;
  subtitle: string;
  imageUrl?: string | null;
  ambienceUrl?: string | null;
};

export type StoryRecord = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  story_summary: string;
  duration_seconds: number;
  status: string;
  published_at: string | null;
  category_name: string;
  category?: string;
  cover_image_url?: string | null;
  featured_image?: string | null;
  image_url?: string | null;
  narration_url?: string | null;
  ambience_url?: string | null;
  music_url?: string | null;
  soundtrack_url?: string | null;
  gallery_images?: string[];
  scenes?: StoryScene[];
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  story_count: number;
};

export type AdminOverview = {
  totals: {
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
  categories: CategoryRecord[];
  latestPublishedAt: string | null;
};

const DEMO_STORIES: StoryRecord[] = [
  {
    id: "demo-princess-diana",
    slug: "princess-diana-final-night",
    title: "Princess Diana: Usiku wa Mwisho Ulioshitua Dunia",
    short_description:
      "Kutoka Ritz Paris hadi handaki la Pont de l'Alma, hii ni simulizi ya saa za mwisho za Princess Diana.",
    story_summary:
      "Hii ni documentary story inayofuatilia usiku wa mwisho wa Princess Diana mjini Paris, kuanzia harakati za usalama, msukumo wa media, hadi athari ya tukio hilo duniani. Ikiwa narration audio haipo bado, mfumo huu utatumia East Africa voice fallback ili uweze kupima engine.",
    duration_seconds: 720,
    status: "published",
    published_at: "1997-08-31T00:00:00.000Z",
    category_name: "Biography",
    category: "Biography",
    cover_image_url:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80",
    featured_image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80",
    narration_url: null,
    ambience_url: null,
    music_url: null,
    gallery_images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      {
        id: "diana-scene-1",
        title: "Paris usiku",
        time: "0:00",
        summary:
          "Mji wa mwanga unaonekana kuwa jukwaa la tukio litakaloshitua dunia.",
        subtitle:
          "Paris usiku huu ilikuwa tulivu kwa juu, lakini chini yake kulikuwa na msukumo mkubwa wa habari.",
      },
      {
        id: "diana-scene-2",
        title: "Safari ya mwisho",
        time: "1:20",
        summary:
          "Gari linaondoka huku paparazzi wakifuatilia kwa karibu.",
        subtitle:
          "Safari ya mwisho ilianza kama mwendo wa kawaida, lakini shinikizo la media lilikuwa kubwa kupita kiasi.",
      },
      {
        id: "diana-scene-3",
        title: "Athari duniani",
        time: "2:50",
        summary:
          "Dakika chache baadaye, dunia nzima inaanza kuuliza maswali makubwa.",
        subtitle:
          "Ndani ya muda mfupi, dunia nzima ilibadilika na maswali kuhusu usalama, faragha, na uwajibikaji yalianza kusikika kila mahali.",
      },
    ],
  },
  {
    id: "demo-titanic",
    slug: "titanic-1912",
    title: "Titanic: Safari Iliyoishia Kwenye Giza la Bahari",
    short_description:
      "Kutoka Southampton hadi kugonga barafu usiku wa Aprili 1912, hii ni hadithi ya matumaini na maamuzi ya sekunde chache.",
    story_summary:
      "Story hii inaeleza safari ya Titanic, msisimko wa abiria, maonyo yaliyopuuzwa, na sekunde muhimu zilizobadilisha historia ya usafiri wa baharini milele.",
    duration_seconds: 720,
    status: "published",
    published_at: "1912-04-15T00:00:00.000Z",
    category_name: "Disasters",
    category: "Disasters",
    cover_image_url:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    featured_image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    narration_url: null,
    ambience_url: null,
    music_url: null,
    gallery_images: [
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    scenes: [
      {
        id: "titanic-scene-1",
        title: "Kuondoka bandarini",
        time: "0:00",
        summary:
          "Watu wengi wanaamini wamepanda meli salama zaidi kuwahi kutengenezwa.",
        subtitle:
          "Titanic iliondoka ikiwa na hadhi, matumaini, na imani kwamba safari hii ingeandika historia ya mafanikio.",
      },
      {
        id: "titanic-scene-2",
        title: "Maonyo ya barafu",
        time: "1:15",
        summary:
          "Mawasiliano ya hatari yanafika, lakini kasi ya safari inaendelea.",
        subtitle:
          "Maonyo ya barafu yalikuwepo, lakini mchanganyiko wa ujasiri na uzembe uliweka safari kwenye njia hatari.",
      },
      {
        id: "titanic-scene-3",
        title: "Usiku wa mwisho",
        time: "2:40",
        summary:
          "Mgongano unaanzisha mfululizo wa maamuzi ya haraka na hofu.",
        subtitle:
          "Giza la bahari lilipokatishwa na mgongano, sekunde chache zilitosha kubadilisha maisha ya maelfu milele.",
      },
    ],
  },
];

const DEMO_CATEGORIES: CategoryRecord[] = [
  { id: "cat-1", name: "Biography", slug: "biography", story_count: 1 },
  { id: "cat-2", name: "Disasters", slug: "disasters", story_count: 1 },
  { id: "cat-3", name: "War", slug: "war", story_count: 0 },
  { id: "cat-4", name: "Mystery", slug: "mystery", story_count: 0 },
];

function normalizeStory(raw: Record<string, unknown>): StoryRecord {
  return {
    id: String(raw.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)),
    slug: String(raw.slug ?? "story"),
    title: String(raw.title ?? "Untitled story"),
    short_description: String(raw.short_description ?? raw.story_summary ?? ""),
    story_summary: String(raw.story_summary ?? raw.short_description ?? ""),
    duration_seconds:
      typeof raw.duration_seconds === "number"
        ? raw.duration_seconds
        : Number(raw.duration_seconds ?? 720),
    status: String(raw.status ?? "draft"),
    published_at:
      typeof raw.published_at === "string" ? raw.published_at : null,
    category_name: String(raw.category_name ?? raw.category ?? "Story"),
    category: String(raw.category ?? raw.category_name ?? "Story"),
    cover_image_url:
      typeof raw.cover_image_url === "string" ? raw.cover_image_url : null,
    featured_image:
      typeof raw.featured_image === "string" ? raw.featured_image : null,
    image_url: typeof raw.image_url === "string" ? raw.image_url : null,
    narration_url:
      typeof raw.narration_url === "string" ? raw.narration_url : null,
    ambience_url:
      typeof raw.ambience_url === "string" ? raw.ambience_url : null,
    music_url: typeof raw.music_url === "string" ? raw.music_url : null,
    soundtrack_url:
      typeof raw.soundtrack_url === "string" ? raw.soundtrack_url : null,
    gallery_images: Array.isArray(raw.gallery_images)
      ? raw.gallery_images.filter((item): item is string => typeof item === "string")
      : [],
    scenes: Array.isArray(raw.scenes)
      ? raw.scenes.map((scene, index) => {
          const item = scene as Record<string, unknown>;
          return {
            id:
              typeof item.id === "string" ? item.id : `scene-${index + 1}`,
            title:
              typeof item.title === "string"
                ? item.title
                : `Scene ${index + 1}`,
            time: typeof item.time === "string" ? item.time : "0:00",
            summary:
              typeof item.summary === "string" ? item.summary : "",
            subtitle:
              typeof item.subtitle === "string"
                ? item.subtitle
                : typeof item.summary === "string"
                  ? item.summary
                  : "",
            imageUrl:
              typeof item.imageUrl === "string" ? item.imageUrl : null,
            ambienceUrl:
              typeof item.ambienceUrl === "string" ? item.ambienceUrl : null,
          };
        })
      : [],
  };
}

async function getSupabaseStories(): Promise<StoryRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item) => normalizeStory(item as Record<string, unknown>));
  } catch {
    return [];
  }
}

function getFallbackStories(): StoryRecord[] {
  return DEMO_STORIES;
}

export async function getStories(): Promise<StoryRecord[]> {
  const dbStories = await getSupabaseStories();

  if (dbStories.length > 0) {
    return dbStories;
  }

  return getFallbackStories();
}

export async function getLatestStories(limit = 12): Promise<StoryRecord[]> {
  const stories = await getStories();
  return stories.slice(0, limit);
}

export async function getPublishedStories(limit = 12): Promise<StoryRecord[]> {
  const stories = await getStories();
  const published = stories.filter((story) => story.status === "published");
  return published.slice(0, limit);
}

export async function getTrendingStories(limit = 6): Promise<StoryRecord[]> {
  const stories = await getStories();
  return stories.slice(0, limit);
}

export async function getFeaturedStory(): Promise<StoryRecord | null> {
  const stories = await getStories();
  return stories[0] ?? null;
}

export async function getStoryBySlug(slug: string): Promise<StoryRecord | null> {
  const stories = await getStories();
  return stories.find((story) => story.slug === slug) ?? null;
}

export async function getStoriesByCategory(categorySlug: string): Promise<StoryRecord[]> {
  const stories = await getStories();

  return stories.filter((story) => {
    const left = (story.category_name || story.category || "").toLowerCase();
    const right = categorySlug.toLowerCase();
    return (
      left === right ||
      left.replace(/\s+/g, "-") === right
    );
  });
}

export async function getCategories(): Promise<CategoryRecord[]> {
  const stories = await getStories();

  if (stories.length === 0) {
    return DEMO_CATEGORIES;
  }

  const grouped = new Map<string, number>();

  for (const story of stories) {
    const category = story.category_name || story.category || "Story";
    grouped.set(category, (grouped.get(category) ?? 0) + 1);
  }

  return Array.from(grouped.entries()).map(([name, story_count], index) => ({
    id: `category-${index + 1}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    story_count,
  }));
}

export async function getCategoriesWithCounts(): Promise<CategoryRecord[]> {
  return getCategories();
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const stories = await getStories();
  const categories = await getCategories();

  const published = stories.filter((story) => story.status === "published");
  const drafts = stories.filter((story) => story.status !== "published");
  const featured = stories.slice(0, 1);

  const subtitleReady = stories.filter(
    (story) => Array.isArray(story.scenes) && story.scenes.length > 0,
  );

  const audioReady = stories.filter(
    (story) => typeof story.narration_url === "string" && story.narration_url.length > 0,
  );

  const totalAudioMinutes = stories.reduce((acc, story) => {
    return acc + (story.duration_seconds || 0) / 60;
  }, 0);

  return {
    totals: {
      published: published.length,
      drafts: drafts.length,
      featured: featured.length,
      subtitleReady: subtitleReady.length,
      audioReady: audioReady.length,
      totalAudioMinutes: Math.round(totalAudioMinutes),
    },
    recentStories: stories.slice(0, 5),
    recentPublished: published.slice(0, 5),
    draftQueue: drafts.slice(0, 5),
    categories,
    latestPublishedAt: published[0]?.published_at ?? null,
  };
}