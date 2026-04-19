import type { StoryRecord, StorySourceRecord, StoryTimelineEventRecord } from "@/lib/types";

export const categories = [
  "Historical Events",
  "True Crime",
  "Disasters",
  "Influential People",
  "Mysteries"
];

export const stories: StoryRecord[] = [
  {
    id: "1",
    slug: "titanic-1912",
    title: "Titanic: Safari Iliyoishia Kwenye Giza la Bahari",
    category: "Disasters",
    duration: "12 min",
    durationSeconds: 720,
    shortDescription:
      "Simulizi ya usiku ambao meli maarufu zaidi duniani ilizama na kubadili historia ya usafiri wa baharini.",
    summary:
      "Kutoka kuondoka Southampton hadi kugonga barafu usiku wa Aprili 1912, hii ni hadithi ya matumaini, hofu na maamuzi ya sekunde chache yaliyobadili maisha ya mamia ya watu.",
    featured: true,
    coverImage:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    subtitleLanguage: "English",
    subtitleUrl: "/media/subtitles/titanic-1912.vtt",
    audioLanguage: "Kiswahili",
    fullStoryText:
      "Titanic ilipoondoka Southampton mnamo Aprili 1912, wengi waliamini ilikuwa ishara ya ushindi wa teknolojia ya kisasa. Ndani yake kulikuwa na ndoto, mali, matumaini na safari mpya za maisha. Lakini usiku mmoja baridi katika Atlantiki ya Kaskazini, meli hiyo iligonga barafu na kila kitu kikabadilika. Simulizi hili linafuatilia dakika za mwisho za amani, taharuki ya walio ndani, na urithi wa ajali hii katika sheria za usafiri wa baharini.",
    publishedAt: "1912-04-15T00:00:00.000Z"
  },
  {
    id: "2",
    slug: "princess-diana-final-night",
    title: "Princess Diana: Usiku wa Mwisho Ulioishtua Dunia",
    category: "Influential People",
    duration: "10 min",
    durationSeconds: 600,
    shortDescription:
      "Masimulizi ya tukio lililoacha simanzi duniani na kuanzisha mjadala mkubwa kuhusu vyombo vya habari na faragha.",
    summary:
      "Safari ya dakika chache ndani ya Paris iligeuka kuwa moja ya matukio ya kusikitisha zaidi kuwahi kushuhudiwa duniani.",
    coverImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
    subtitleLanguage: "English",
    subtitleUrl: "/media/subtitles/princess-diana-final-night.vtt",
    audioLanguage: "Kiswahili",
    fullStoryText:
      "Diana alikuwa sura ya huruma, ushawishi, na mabadiliko katika familia ya kifalme. Kifo chake kilipochukua dunia kwa mshangao, kilifungua mjadala mzito juu ya ufuatiliaji wa paparazzi, usalama wa watu mashuhuri, na namna dunia inavyotumia habari za hisia kubwa. Katika simulizi hili tunafuatilia mazingira ya Paris, msukumo wa vyombo vya habari, na athari za msiba huo kwa mamilioni ya watu duniani.",
    publishedAt: "1997-08-31T00:00:00.000Z"
  },
  {
    id: "3",
    slug: "dyatlov-pass-mystery",
    title: "Dyatlov Pass: Siri ya Kifo cha Wapandaji Tisa",
    category: "Mysteries",
    duration: "14 min",
    durationSeconds: 840,
    shortDescription:
      "Kisa cha kutatanisha kilichowaacha wachunguzi na dunia nzima wakiwa na maswali mengi kuliko majibu.",
    summary:
      "Katika barafu kali la Urusi, kundi la wapandaji lilikutwa limekufa katika mazingira yasiyoeleweka mpaka leo.",
    coverImage:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
    subtitleLanguage: "English",
    subtitleUrl: "/media/subtitles/dyatlov-pass-mystery.vtt",
    audioLanguage: "Kiswahili",
    fullStoryText:
      "Kisa cha Dyatlov Pass kimebakia kuwa fumbo la kihistoria kwa miongo mingi. Je, kilichowakuta wapandaji wale kilikuwa nguvu ya asili, makosa ya kibinadamu, au jambo ambalo halikuwahi kuelezwa wazi? Hapa tunafuatilia mazingira, ushahidi, na nadharia kuu ambazo zimeendelea kubishaniwa. Ni simulizi linalochanganya baridi kali, hofu isiyoelezeka, na maswali ambayo mpaka leo hayajapata majibu ya mwisho.",
    publishedAt: "1959-02-02T00:00:00.000Z"
  },
  {
    id: "4",
    slug: "nelson-mandela-release",
    title: "Mandela: Kutoka Gerezani Hadi Kuongoza Taifa",
    category: "Influential People",
    duration: "11 min",
    durationSeconds: 660,
    shortDescription:
      "Hadithi ya uvumilivu, mapambano na siku iliyobadili Afrika Kusini milele.",
    summary:
      "Baada ya miaka 27 gerezani, kuachiwa kwa Mandela kulikua alama ya mwanzo wa zama mpya.",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    subtitleLanguage: "English",
    subtitleUrl: "/media/subtitles/nelson-mandela-release.vtt",
    audioLanguage: "Kiswahili",
    fullStoryText:
      "Kuachiwa kwa Nelson Mandela kulionekana kama mlango wa matumaini kwa taifa lililogawanyika kwa muda mrefu. Simulizi hili linaangalia gharama ya mapambano, nguvu ya msamaha, na namna tukio hilo lilivyogeuka kuwa alama ya mabadiliko duniani. Kutoka gerezani hadi uongozi wa taifa, hii ni hadithi ya uvumilivu, imani, na uwezo wa historia kubadilika mbele ya macho ya dunia.",
    publishedAt: "1990-02-11T00:00:00.000Z"
  }
];

export const storySources: Record<string, StorySourceRecord[]> = {
  "titanic-1912": [
    {
      id: "src-1",
      title: "British Wreck Commissioner's Inquiry",
      publisher: "UK Parliament Records",
      notes: "Moja ya kumbukumbu muhimu kuhusu ushahidi wa manusura na taratibu za usalama baada ya ajali."
    },
    {
      id: "src-2",
      title: "Titanic Historical Society Archives",
      url: "https://titanichistoricalsociety.org",
      publisher: "Titanic Historical Society",
      notes: "Kumbukumbu, picha, na rejea za kihistoria kuhusu safari ya Titanic."
    }
  ],
  "princess-diana-final-night": [
    {
      id: "src-3",
      title: "French judicial investigation summaries",
      publisher: "French Judicial Records",
      notes: "Muhtasari wa uchunguzi rasmi kuhusu ajali ya Paris."
    },
    {
      id: "src-4",
      title: "BBC archive coverage",
      url: "https://www.bbc.com",
      publisher: "BBC",
      notes: "Rejea ya namna tukio lilivyoripotiwa na athari zake kwa umma."
    }
  ],
  "dyatlov-pass-mystery": [
    {
      id: "src-5",
      title: "Regional prosecutor case records",
      publisher: "Soviet/Russian case archives",
      notes: "Faili za awali za uchunguzi wa tukio."
    }
  ],
  "nelson-mandela-release": [
    {
      id: "src-6",
      title: "Nelson Mandela Foundation Archive",
      url: "https://www.nelsonmandela.org",
      publisher: "Nelson Mandela Foundation",
      notes: "Kumbukumbu za kihistoria kuhusu maisha, kuachiliwa, na urithi wa Mandela."
    }
  ]
};

export const storyTimeline: Record<string, StoryTimelineEventRecord[]> = {
  "titanic-1912": [
    {
      id: "tl-1",
      yearLabel: "10 Apr 1912",
      title: "Titanic yaondoka Southampton",
      description: "Safari inaanza ikiwa imejaa matumaini, fahari ya teknolojia, na abiria kutoka tabaka mbalimbali.",
      sortOrder: 1
    },
    {
      id: "tl-2",
      yearLabel: "14 Apr 1912",
      title: "Onyo la barafu latumwa",
      description: "Meli inapokea taarifa za barafu katika njia yake, lakini usiku unaendelea kwa kasi kubwa.",
      sortOrder: 2
    },
    {
      id: "tl-3",
      yearLabel: "15 Apr 1912",
      title: "Mgongano na kuzama",
      description: "Titanic inagonga barafu na ndani ya saa chache meli inazama, ikisababisha vifo vingi sana.",
      sortOrder: 3
    }
  ],
  "princess-diana-final-night": [
    {
      id: "tl-4",
      yearLabel: "31 Aug 1997",
      title: "Safari ya usiku Paris",
      description: "Msafara wa gari unaondoka huku paparazzi wakiendelea kufuatilia kwa karibu.",
      sortOrder: 1
    },
    {
      id: "tl-5",
      yearLabel: "31 Aug 1997",
      title: "Ajali kwenye handaki",
      description: "Dakika chache baadaye, ajali inatokea na dunia inaanza kupokea habari za kushtua.",
      sortOrder: 2
    }
  ],
  "dyatlov-pass-mystery": [
    {
      id: "tl-6",
      yearLabel: "Jan 1959",
      title: "Kundi laanza safari",
      description: "Wapandaji wenye uzoefu wanaanza safari ya mlima katika mazingira ya baridi kali.",
      sortOrder: 1
    },
    {
      id: "tl-7",
      yearLabel: "Feb 1959",
      title: "Hema lakutwa limepasuliwa",
      description: "Waokoaji wanakuta eneo la kambi katika hali isiyo ya kawaida sana.",
      sortOrder: 2
    }
  ],
  "nelson-mandela-release": [
    {
      id: "tl-8",
      yearLabel: "1964",
      title: "Mandela afungwa gerezani",
      description: "Anaanza kifungo kirefu ambacho kingekuwa alama ya mateso na uvumilivu wa kisiasa.",
      sortOrder: 1
    },
    {
      id: "tl-9",
      yearLabel: "11 Feb 1990",
      title: "Mandela aachiwa huru",
      description: "Tukio hili linatazamwa duniani kote kama mwanzo wa sura mpya ya Afrika Kusini.",
      sortOrder: 2
    }
  ]
};

export const featuredStory = stories.find((story) => story.featured) || stories[0];
