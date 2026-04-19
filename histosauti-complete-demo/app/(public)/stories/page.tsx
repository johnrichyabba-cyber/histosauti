import Link from "next/link";
import { ArrowDownWideNarrow, Filter, Library, Search, Sparkles, Wand2 } from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";
import { StoryCard } from "@/components/home/story-card";
import { getCategories, getFeaturedStory, getPublishedStories } from "@/lib/stories";
import type { StoryRecord } from "@/lib/types";

type StoriesPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    duration?: string;
    subtitles?: string;
    audio?: string;
  }>;
};

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeCategorySlug(value: string) {
  return normalize(value.replace(/-/g, " "));
}

function hasSubtitleSupport(story: StoryRecord) {
  return Boolean(story.subtitleUrl || story.subtitleLanguage);
}

function hasAudioReady(story: StoryRecord) {
  return Boolean(story.audioUrl || story.audioLanguage);
}

function matchesDuration(durationFilter: string, durationSeconds?: number | null) {
  const seconds = durationSeconds || 0;

  switch (durationFilter) {
    case "short":
      return seconds > 0 && seconds < 600;
    case "medium":
      return seconds >= 600 && seconds <= 900;
    case "long":
      return seconds > 900;
    case "unknown":
      return !seconds;
    default:
      return true;
  }
}

function sortStories(stories: StoryRecord[], sort: string) {
  const sorted = [...stories];

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return aTime - bTime;
      });
    case "az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "duration":
      return sorted.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
    case "popular":
      return sorted.sort((a, b) => {
        const aScore = (a.featured ? 1000 : 0) + (a.durationSeconds || 0);
        const bScore = (b.featured ? 1000 : 0) + (b.durationSeconds || 0);
        return bScore - aScore;
      });
    case "newest":
    default:
      return sorted.sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      });
  }
}

function buildStoriesQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all" && value !== "any") {
      search.set(key, value);
    }
  });

  const queryString = search.toString();
  return queryString ? `/stories?${queryString}` : "/stories";
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = (await searchParams) || {};
  const [stories, categories, featuredStory] = await Promise.all([
    getPublishedStories(),
    getCategories(),
    getFeaturedStory()
  ]);

  const activeQuery = params.q?.trim() || "";
  const activeCategory = params.category?.trim() || "all";
  const activeSort = params.sort?.trim() || "newest";
  const activeDuration = params.duration?.trim() || "any";
  const activeSubtitles = params.subtitles?.trim() || "any";
  const activeAudio = params.audio?.trim() || "any";

  const filteredStories = sortStories(
    stories.filter((story) => {
      const matchesQuery =
        !activeQuery ||
        [story.title, story.shortDescription, story.summary, story.category]
          .join(" ")
          .toLowerCase()
          .includes(activeQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || normalize(story.category) === normalizeCategorySlug(activeCategory);

      const matchesSubtitle =
        activeSubtitles === "any" ||
        (activeSubtitles === "supported" ? hasSubtitleSupport(story) : !hasSubtitleSupport(story));

      const matchesAudio =
        activeAudio === "any" || (activeAudio === "ready" ? hasAudioReady(story) : !hasAudioReady(story));

      return (
        matchesQuery &&
        matchesCategory &&
        matchesSubtitle &&
        matchesAudio &&
        matchesDuration(activeDuration, story.durationSeconds)
      );
    }),
    activeSort
  );

  const activeCategoryName =
    activeCategory === "all"
      ? "All Stories"
      : categories.find((category) => category.slug === activeCategory)?.name || activeCategory.replace(/-/g, " ");

  const storiesWithSubtitle = stories.filter(hasSubtitleSupport).length;
  const storiesWithAudio = stories.filter(hasAudioReady).length;

  return (
    <section className="pb-16 pt-10 md:pt-16">
      <div className="container space-y-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,190,138,0.16),rgba(10,14,22,0.86)_45%,rgba(7,11,20,0.96))] p-6 shadow-glow md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.95fr] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-platnumGold/25 bg-platnumGold/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-platnumGold">
                <Library className="h-3.5 w-3.5" />
                HistoSauti Archive
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
                Simulizi zote za matukio ya kweli, zikiwa na filters za kisasa na archive ya premium.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/85 md:text-base">
                Tafuta stori kwa jina, category, muda wa kusikiliza, subtitle support, au namna unavyotaka zipangwe.
              </p>

              <form className="mt-6 grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4 backdrop-blur md:grid-cols-2 xl:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] xl:items-center md:p-5">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 md:col-span-2 xl:col-span-1">
                  <Search className="h-4 w-4 text-platnumGold" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={activeQuery}
                    placeholder="Tafuta Titanic, Mandela, mysteries..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-platnumGold" />
                  <select name="category" defaultValue={activeCategory} className="w-full bg-transparent text-sm text-white outline-none">
                    <option value="all" className="bg-slate-950 text-white">All categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug} className="bg-slate-950 text-white">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <ArrowDownWideNarrow className="h-4 w-4 text-platnumGold" />
                  <select name="sort" defaultValue={activeSort} className="w-full bg-transparent text-sm text-white outline-none">
                    <option value="newest" className="bg-slate-950 text-white">Newest first</option>
                    <option value="oldest" className="bg-slate-950 text-white">Oldest first</option>
                    <option value="popular" className="bg-slate-950 text-white">Featured / popular</option>
                    <option value="duration" className="bg-slate-950 text-white">Longest duration</option>
                    <option value="az" className="bg-slate-950 text-white">A to Z</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-platnumGold" />
                  <select name="duration" defaultValue={activeDuration} className="w-full bg-transparent text-sm text-white outline-none">
                    <option value="any" className="bg-slate-950 text-white">Any duration</option>
                    <option value="short" className="bg-slate-950 text-white">Short under 10 min</option>
                    <option value="medium" className="bg-slate-950 text-white">Medium 10 to 15 min</option>
                    <option value="long" className="bg-slate-950 text-white">Long 15+ min</option>
                    <option value="unknown" className="bg-slate-950 text-white">Duration unknown</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-platnumGold" />
                  <select name="subtitles" defaultValue={activeSubtitles} className="w-full bg-transparent text-sm text-white outline-none">
                    <option value="any" className="bg-slate-950 text-white">Any subtitle status</option>
                    <option value="supported" className="bg-slate-950 text-white">English subtitles</option>
                    <option value="missing" className="bg-slate-950 text-white">No subtitles</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-platnumGold" />
                  <select name="audio" defaultValue={activeAudio} className="w-full bg-transparent text-sm text-white outline-none">
                    <option value="any" className="bg-slate-950 text-white">Any audio status</option>
                    <option value="ready" className="bg-slate-950 text-white">Audio ready</option>
                    <option value="missing" className="bg-slate-950 text-white">Audio missing</option>
                  </select>
                </label>

                <div className="flex gap-3 md:col-span-2 xl:col-span-6">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-platnumGold px-5 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90 md:w-auto"
                  >
                    Apply Filters
                  </button>
                  <Link
                    href="/stories"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-platnumGold hover:text-platnumGold"
                  >
                    Reset
                  </Link>
                </div>
              </form>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-platnumGold">Featured pick</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{featuredStory.title}</h2>
                </div>
                <Sparkles className="h-6 w-6 text-platnumGold" />
              </div>
              <p className="text-sm leading-7 text-slate-300">{featuredStory.shortDescription}</p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span className="rounded-full border border-platnumGold/25 bg-platnumGold/10 px-3 py-2 text-platnumGold">
                  {featuredStory.category}
                </span>
                <span>{featuredStory.duration}</span>
                <span>{featuredStory.subtitleLanguage} subtitles</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Archive</p>
                  <p className="mt-2 text-2xl font-black text-white">{stories.length}</p>
                  <p className="mt-1 text-xs text-slate-400">published stories</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Subtitles</p>
                  <p className="mt-2 text-2xl font-black text-white">{storiesWithSubtitle}</p>
                  <p className="mt-1 text-xs text-slate-400">with English support</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Audio</p>
                  <p className="mt-2 text-2xl font-black text-white">{storiesWithAudio}</p>
                  <p className="mt-1 text-xs text-slate-400">ready to play</p>
                </div>
              </div>
              <Link
                href={`/stories/${featuredStory.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-platnumGold/25 bg-platnumGold/10 px-4 py-2 text-sm font-semibold text-platnumGold transition hover:border-platnumGold hover:bg-platnumGold hover:text-slate-950"
              >
                Sikiliza featured story
                <Wand2 className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeader
            eyebrow="Archive"
            title={activeCategory === "all" ? "Stories" : `${activeCategoryName}`}
            description="Orodha ya simulizi zote za matukio ya kweli yaliyowahi kutokea duniani. Chuja kwa category, duration, subtitle, audio status, au sorting ya kisasa."
          />
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300">
              <span className="font-semibold text-white">{filteredStories.length}</span> results
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300">
              <span className="font-semibold text-white">{stories.length}</span> total stories
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300">
              sort: <span className="font-semibold text-white">{activeSort}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={buildStoriesQuery({ q: activeQuery || undefined, sort: activeSort, duration: activeDuration, subtitles: activeSubtitles, audio: activeAudio })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === "all"
                ? "bg-platnumGold text-slate-950"
                : "border border-white/10 bg-white/[0.03] text-slate-200 hover:border-platnumGold hover:text-platnumGold"
            }`}
          >
            All Stories
          </Link>
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <Link
                key={category.id}
                href={buildStoriesQuery({
                  q: activeQuery || undefined,
                  category: category.slug,
                  sort: activeSort,
                  duration: activeDuration,
                  subtitles: activeSubtitles,
                  audio: activeAudio
                })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-platnumGold text-slate-950"
                    : "border border-white/10 bg-white/[0.03] text-slate-200 hover:border-platnumGold hover:text-platnumGold"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-platnumGold">No match found</p>
            <h3 className="mt-4 text-2xl font-bold text-white">Hakuna story iliyopatikana kwa filter hizi</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Jaribu kubadilisha jina la kutafuta, category, duration, au subtitle filter. Archive ya HistoSauti itaendelea kukua kadri unavyoongeza simulizi mpya.
            </p>
            <Link
              href="/stories"
              className="mt-6 inline-flex rounded-full bg-platnumGold px-5 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90"
            >
              Rudisha archive yote
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
