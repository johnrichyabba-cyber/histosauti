export type NarratorProfile = {
  id: string;
  name: string;
  region: string;
  language: string;
  accent: string;
  style: string;
  description: string;
  badge: string;
};

export const narratorProfiles: NarratorProfile[] = [
  {
    id: "east-africa-documentary",
    name: "Msimulizi wa Afrika Mashariki",
    region: "East Africa",
    language: "Kiswahili",
    accent: "Kiswahili cha Afrika Mashariki",
    style: "Documentary, calm, deep, emotional",
    description:
      "Lafudhi ya Kiswahili sanifu cha Afrika Mashariki inayofaa kwa simulizi za kihistoria, documentary, na true stories.",
    badge: "East African Swahili",
  },
  {
    id: "east-africa-calm-female",
    name: "Msimulizi wa Kike wa Afrika Mashariki",
    region: "East Africa",
    language: "Kiswahili",
    accent: "Kiswahili cha Afrika Mashariki",
    style: "Warm, clear, reflective",
    description:
      "Sauti ya kike yenye utulivu na usikivu mzuri kwa simulizi za hisia, maisha ya watu, na historia zenye mafunzo.",
    badge: "EA Swahili Female",
  },
  {
    id: "east-africa-investigative",
    name: "Msimulizi wa Upelelezi wa Afrika Mashariki",
    region: "East Africa",
    language: "Kiswahili",
    accent: "Kiswahili cha Afrika Mashariki",
    style: "Investigative, tense, serious",
    description:
      "Inafaa kwa mystery, disasters, political stories, na simulizi zenye tension ya documentary ya uchunguzi.",
    badge: "EA Investigative",
  },
];

export function getNarratorProfileById(id?: string | null): NarratorProfile | null {
  if (!id) return narratorProfiles[0] ?? null;
  return narratorProfiles.find((item) => item.id === id) ?? narratorProfiles[0] ?? null;
}