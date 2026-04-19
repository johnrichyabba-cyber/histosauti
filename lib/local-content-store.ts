import fs from "fs";
import path from "path";

export type LocalStoryRecord = {
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

export type LocalManagedScene = {
  id: string;
  title: string;
  caption?: string;
  start_time_seconds: number;
  end_time_seconds: number;
  image_url?: string;
  ambience_url?: string;
  music_url?: string;
};

export type LocalMediaConfigRecord = {
  story_slug: string;
  cover_image_url?: string;
  narration_url?: string;
  ambience_url?: string;
  music_url?: string;
  gallery_images: string[];
  scenes: LocalManagedScene[];
};

const storiesPath = path.join(process.cwd(), "data", "local-stories.json");
const mediaConfigsPath = path.join(process.cwd(), "data", "local-media-configs.json");

function ensureFile(filePath: string, fallback: unknown) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  ensureFile(filePath, fallback);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, value: T) {
  ensureFile(filePath, value);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

export function createLocalStoryRecord() {
  return `story-${Date.now()}`;
}

export async function getAllLocalStories(): Promise<LocalStoryRecord[]> {
  return readJsonFile<LocalStoryRecord[]>(storiesPath, []);
}

export async function getLocalStoryById(id: string): Promise<LocalStoryRecord | null> {
  const stories = await getAllLocalStories();
  return stories.find((item) => item.id === id) ?? null;
}

export async function getLocalStoryBySlug(slug: string): Promise<LocalStoryRecord | null> {
  const stories = await getAllLocalStories();
  return stories.find((item) => item.slug === slug) ?? null;
}

export async function saveLocalStory(story: LocalStoryRecord) {
  const stories = await getAllLocalStories();
  const index = stories.findIndex((item) => item.id === story.id);

  if (index >= 0) {
    stories[index] = story;
  } else {
    stories.unshift(story);
  }

  writeJsonFile(storiesPath, stories);
  return story;
}

export async function getAllLocalMediaConfigs(): Promise<LocalMediaConfigRecord[]> {
  return readJsonFile<LocalMediaConfigRecord[]>(mediaConfigsPath, []);
}

export async function getLocalMediaConfigBySlug(
  slug: string,
): Promise<LocalMediaConfigRecord | null> {
  const configs = await getAllLocalMediaConfigs();
  return configs.find((item) => item.story_slug === slug) ?? null;
}

export async function saveLocalMediaConfig(config: LocalMediaConfigRecord) {
  const configs = await getAllLocalMediaConfigs();
  const index = configs.findIndex((item) => item.story_slug === config.story_slug);

  if (index >= 0) {
    configs[index] = config;
  } else {
    configs.unshift(config);
  }

  writeJsonFile(mediaConfigsPath, configs);
  return config;
}