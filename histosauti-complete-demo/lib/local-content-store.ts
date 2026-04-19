import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoryAdminRecord, StorySourceRecord, StoryTimelineEventRecord } from "@/lib/types";
import type { StoryMediaConfig } from "@/lib/media-manager";

export type LocalStoryRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryId?: string | null;
  duration: string;
  durationSeconds?: number | null;
  shortDescription: string;
  summary: string;
  fullStoryText?: string;
  featured?: boolean;
  coverImage: string;
  subtitleLanguage: string;
  audioLanguage: string;
  audioUrl?: string;
  subtitleUrl?: string;
  publishedAt?: string | null;
  status?: "draft" | "published";
  sources: StorySourceRecord[];
  timeline: StoryTimelineEventRecord[];
};

const storiesPath = path.join(process.cwd(), "data", "local-stories.json");
const mediaPath = path.join(process.cwd(), "data", "local-media-configs.json");

async function ensureFile(filePath: string, fallbackContent = "[]") {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, fallbackContent, "utf8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, JSON.stringify(fallback, null, 2));
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureFile(filePath, JSON.stringify(data, null, 2));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getLocalStories(): Promise<LocalStoryRecord[]> {
  const items = await readJsonFile<LocalStoryRecord[]>(storiesPath, []);
  return items.sort((a, b) => {
    const aDate = new Date(a.publishedAt || 0).getTime();
    const bDate = new Date(b.publishedAt || 0).getTime();
    return bDate - aDate;
  });
}

export async function getLocalStoryById(id: string): Promise<LocalStoryRecord | null> {
  const items = await getLocalStories();
  return items.find((item) => item.id === id) || null;
}

export async function getLocalStoryBySlug(slug: string): Promise<LocalStoryRecord | null> {
  const items = await getLocalStories();
  return items.find((item) => item.slug === slug) || null;
}

export async function saveLocalStory(story: LocalStoryRecord): Promise<LocalStoryRecord> {
  const items = await getLocalStories();
  const existingIndex = items.findIndex((item) => item.id === story.id || item.slug === story.slug);

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      ...story,
      id: items[existingIndex].id,
    };
    await writeJsonFile(storiesPath, items);
    return items[existingIndex];
  }

  const nextStory = {
    ...story,
    id: story.id || `local-${Date.now()}`,
  };

  items.unshift(nextStory);
  await writeJsonFile(storiesPath, items);
  return nextStory;
}

export async function getLocalMediaConfigs(): Promise<StoryMediaConfig[]> {
  return readJsonFile<StoryMediaConfig[]>(mediaPath, []);
}

export async function getLocalMediaConfigBySlug(slug: string): Promise<StoryMediaConfig | null> {
  const items = await getLocalMediaConfigs();
  return items.find((item) => item.story_slug === slug) || null;
}

export async function saveLocalMediaConfig(config: StoryMediaConfig): Promise<StoryMediaConfig> {
  const items = await getLocalMediaConfigs();
  const index = items.findIndex((item) => item.story_slug === config.story_slug);

  if (index >= 0) {
    items[index] = config;
  } else {
    items.unshift(config);
  }

  await writeJsonFile(mediaPath, items);
  return config;
}

export function createLocalStoryRecord(input: {
  id?: string;
  slug: string;
  title: string;
  category: string;
  categoryId?: string | null;
  shortDescription: string;
  summary: string;
  fullStoryText?: string;
  coverImage: string;
  audioUrl?: string;
  subtitleUrl?: string;
  durationSeconds?: number | null;
  featured?: boolean;
  status?: "draft" | "published";
  publishedAt?: string | null;
  sources: StorySourceRecord[];
  timeline: StoryTimelineEventRecord[];
}): LocalStoryRecord {
  const durationMinutes = input.durationSeconds && input.durationSeconds >= 60
    ? `${Math.round(input.durationSeconds / 60)} min`
    : "Audio coming soon";

  return {
    id: input.id || `local-${Date.now()}`,
    slug: input.slug,
    title: input.title,
    category: input.category,
    categoryId: input.categoryId || null,
    duration: durationMinutes,
    durationSeconds: input.durationSeconds || null,
    shortDescription: input.shortDescription,
    summary: input.summary,
    fullStoryText: input.fullStoryText || "",
    featured: Boolean(input.featured),
    coverImage: input.coverImage,
    subtitleLanguage: "English",
    audioLanguage: "Kiswahili",
    audioUrl: input.audioUrl,
    subtitleUrl: input.subtitleUrl,
    publishedAt: input.publishedAt || null,
    status: input.status || "draft",
    sources: input.sources,
    timeline: input.timeline,
  };
}
