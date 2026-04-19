export type StoryStatus = "draft" | "published";

export type StorySourceRecord = {
  id: string;
  title: string;
  url?: string | null;
  publisher?: string | null;
  notes?: string | null;
};

export type StoryTimelineEventRecord = {
  id: string;
  yearLabel: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type StoryRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  shortDescription: string;
  summary: string;
  featured?: boolean;
  coverImage: string;
  subtitleLanguage: string;
  audioLanguage: string;
  audioUrl?: string;
  subtitleUrl?: string;
  publishedAt?: string | null;
  status?: StoryStatus;
  categoryId?: string | null;
  durationSeconds?: number | null;
};

export type StoryDetailRecord = StoryRecord & {
  fullStoryText?: string;
  sources: StorySourceRecord[];
  timeline: StoryTimelineEventRecord[];
  relatedStories: StoryRecord[];
};

export type StoryAdminRecord = StoryDetailRecord & {
  status: StoryStatus;
  categoryId: string | null;
  durationSeconds: number | null;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};
