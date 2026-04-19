import { getLocalMediaConfigBySlug, getLocalMediaConfigs } from "@/lib/local-content-store";

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

const softSynth = "https://samplelib.com/mp3/sample-3s.mp3";
const mysteryLoop = "https://samplelib.com/mp3/sample-6s.mp3";
const cinematicPulse = "https://samplelib.com/mp3/sample-12s.mp3";
const atmosphericBed = "https://samplelib.com/mp3/sample-19s.mp3";

const configs: StoryMediaConfig[] = [
  {
    story_slug: "titanic-1912",
    cover_image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    narration_url: "",
    ambience_url: atmosphericBed,
    music_url: cinematicPulse,
    gallery_images: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=80"
    ],
    scenes: [
      {
        id: "titanic-scene-1",
        title: "Safari inaanza",
        caption: "Titanic inaondoka ikiwa imebeba matumaini, fahari, na hadhi ya karne mpya.",
        start_time_seconds: 0,
        end_time_seconds: 24,
        image_url: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1400&q=80",
        ambience_url: atmosphericBed,
        music_url: softSynth
      },
      {
        id: "titanic-scene-2",
        title: "Usiku wa Atlantiki",
        caption: "Giza, baridi, na bahari tulivu vinaficha hatari inayokuja mbele.",
        start_time_seconds: 25,
        end_time_seconds: 54,
        image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
        ambience_url: atmosphericBed,
        music_url: cinematicPulse
      },
      {
        id: "titanic-scene-3",
        title: "Baada ya mgongano",
        caption: "Muda mfupi tu unatosha kugeuza fahari kuwa taharuki kubwa ya kihistoria.",
        start_time_seconds: 55,
        end_time_seconds: 95,
        image_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=80",
        ambience_url: mysteryLoop,
        music_url: cinematicPulse
      }
    ]
  },
  {
    story_slug: "princess-diana-final-night",
    cover_image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
    narration_url: "",
    ambience_url: softSynth,
    music_url: atmosphericBed,
    gallery_images: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80"
    ],
    scenes: [
      {
        id: "diana-scene-1",
        title: "Paris usiku",
        caption: "Mji wa mwanga unageuka kuwa jukwaa la tukio litakaloishtua dunia.",
        start_time_seconds: 0,
        end_time_seconds: 25,
        image_url: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80",
        ambience_url: softSynth,
        music_url: atmosphericBed
      },
      {
        id: "diana-scene-2",
        title: "Kukimbizwa na kamera",
        caption: "Presha ya vyombo vya habari inaongezeka huku safari ikiwa fupi lakini nzito.",
        start_time_seconds: 26,
        end_time_seconds: 52,
        image_url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80",
        ambience_url: mysteryLoop,
        music_url: softSynth
      },
      {
        id: "diana-scene-3",
        title: "Mstari wa mwisho",
        caption: "Baada ya tukio, maswali ya faragha, wajibu, na media yanatawala dunia.",
        start_time_seconds: 53,
        end_time_seconds: 90,
        image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
        ambience_url: atmosphericBed,
        music_url: cinematicPulse
      }
    ]
  },
  {
    story_slug: "dyatlov-pass-mystery",
    cover_image_url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
    narration_url: "",
    ambience_url: mysteryLoop,
    music_url: atmosphericBed,
    gallery_images: [
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&w=1400&q=80"
    ],
    scenes: [
      {
        id: "dyatlov-scene-1",
        title: "Safari ya barafuni",
        caption: "Kundi linaingia kwenye mazingira hatari lakini ya kuvutia ya milima yenye theluji.",
        start_time_seconds: 0,
        end_time_seconds: 25,
        image_url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
        ambience_url: mysteryLoop,
        music_url: softSynth
      },
      {
        id: "dyatlov-scene-2",
        title: "Kambi isiyoeleweka",
        caption: "Ushahidi wa kwanza unaacha wasimamizi na wachunguzi wakiwa na hofu na mshangao.",
        start_time_seconds: 26,
        end_time_seconds: 54,
        image_url: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
        ambience_url: mysteryLoop,
        music_url: cinematicPulse
      },
      {
        id: "dyatlov-scene-3",
        title: "Fumbo linalobaki hai",
        caption: "Nadharia nyingi zinatokea, lakini ukweli wa mwisho unabaki kwenye ukungu wa historia.",
        start_time_seconds: 55,
        end_time_seconds: 92,
        image_url: "https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&w=1400&q=80",
        ambience_url: atmosphericBed,
        music_url: cinematicPulse
      }
    ]
  },
  {
    story_slug: "nelson-mandela-release",
    cover_image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    narration_url: "",
    ambience_url: softSynth,
    music_url: atmosphericBed,
    gallery_images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80"
    ],
    scenes: [
      {
        id: "mandela-scene-1",
        title: "Miaka ya kifungo",
        caption: "Safari ya uvumilivu inaanza kwenye kuta za gereza lakini mawazo yake yanaendelea kuwa huru.",
        start_time_seconds: 0,
        end_time_seconds: 24,
        image_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80",
        ambience_url: softSynth,
        music_url: atmosphericBed
      },
      {
        id: "mandela-scene-2",
        title: "Siku ya kuachiwa",
        caption: "Macho ya dunia yote yanaelekezwa kwenye hatua za mwanzo za uhuru.",
        start_time_seconds: 25,
        end_time_seconds: 52,
        image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
        ambience_url: atmosphericBed,
        music_url: cinematicPulse
      },
      {
        id: "mandela-scene-3",
        title: "Urithi wa matumaini",
        caption: "Kuachiwa kwake kunakuwa ishara ya mabadiliko makubwa kwa taifa na dunia.",
        start_time_seconds: 53,
        end_time_seconds: 90,
        image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
        ambience_url: softSynth,
        music_url: atmosphericBed
      }
    ]
  }
];

export async function getStoryMediaConfigBySlug(slug: string): Promise<StoryMediaConfig | null> {
  const localConfig = await getLocalMediaConfigBySlug(slug);
  if (localConfig) return localConfig;
  return configs.find((item) => item.story_slug === slug) ?? null;
}

export async function getAllStoryMediaConfigs(): Promise<StoryMediaConfig[]> {
  const local = await getLocalMediaConfigs();
  const localSlugs = new Set(local.map((item) => item.story_slug));
  return [...local, ...configs.filter((item) => !localSlugs.has(item.story_slug))];
}
