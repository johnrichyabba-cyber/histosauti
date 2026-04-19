import {
  getAllLocalMediaConfigs,
  getLocalMediaConfigBySlug,
} from "@/lib/local-content-store";

export type ManagedScene = {
  id: string;
  title: string;
  caption?: string;
  start_time_seconds: number;
  end_time_seconds: number;
  image_url?: string;
  ambience_url?: string;
  music_url?: string;
};

export type StoryMediaConfig = {
  story_slug: string;
  cover_image_url?: string;
  narration_url?: string;
  ambience_url?: string;
  music_url?: string;
  gallery_images: string[];
  scenes: ManagedScene[];
};

const demoMediaConfigs: StoryMediaConfig[] = [
  {
    story_slug: "karibu-histosauti",
    cover_image_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
    narration_url: "",
    ambience_url: "",
    music_url: "",
    gallery_images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=80",
    ],
    scenes: [
      {
        id: "scene-1",
        title: "Mwanzo wa simulizi",
        caption: "Karibu kwenye uzoefu wa documentary storytelling wa HistoSauti.",
        start_time_seconds: 0,
        end_time_seconds: 25,
        image_url:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80",
        ambience_url: "",
        music_url: "",
      },
      {
        id: "scene-2",
        title: "Kuingia ndani ya historia",
        caption: "Picha, sauti, na subtitle vinafanya simulizi liwe hai zaidi.",
        start_time_seconds: 26,
        end_time_seconds: 55,
        image_url:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80",
        ambience_url: "",
        music_url: "",
      },
      {
        id: "scene-3",
        title: "Hisia za documentary",
        caption: "Mchanganyiko wa narration, ambience, na music huongeza uhalisia.",
        start_time_seconds: 56,
        end_time_seconds: 90,
        image_url:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=80",
        ambience_url: "",
        music_url: "",
      },
    ],
  },
];

export async function getStoryMediaConfigBySlug(
  slug: string,
): Promise<StoryMediaConfig | null> {
  const localConfig = await getLocalMediaConfigBySlug(slug);

  if (localConfig) {
    return localConfig;
  }

  return demoMediaConfigs.find((item) => item.story_slug === slug) ?? null;
}

export async function getAllStoryMediaConfigs(): Promise<StoryMediaConfig[]> {
  const localConfigs = await getAllLocalMediaConfigs();

  if (localConfigs.length > 0) {
    return localConfigs;
  }

  return demoMediaConfigs;
}