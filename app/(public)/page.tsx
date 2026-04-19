import Link from "next/link";
import {
  getCategoriesWithCounts,
  getFeaturedStory,
  getLatestStories,
} from "@/lib/stories";

export default async function HomePage() {
  const [featuredStory, latestStories, categories] = await Promise.all([
    getFeaturedStory(),
    getLatestStories(6),
    getCategoriesWithCounts(),
  ]);

  const safeFeaturedStory = featuredStory ?? {
    id: "fallback-featured",
    title: "Karibu HistoSauti",
    slug: "stories",
    category: "HISTORY",
    summary:
      "Sikiliza simulizi za matukio ya kweli ya kihistoria kwa Kiswahili, zikiwa na subtitle za Kiingereza na muonekano wa documentary ya kisasa.",
    duration: "12 min",
    audioLabel: "Kiswahili cha Afrika Mashariki",
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm text-white/90">
            ✦ HistoSauti • True Stories • Kiswahili Narration
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Historia ya kweli,
              <br />
              ikisimuliwa kwa sauti
              <br />
              yenye mvuto.
            </h1>

            <p className="max-w-3xl text-xl leading-9 text-slate-200">
              HistoSauti ni portal ya documentary storytelling inayokuleta matukio
              halisi yaliyotikisa dunia, kwa masimulizi ya Kiswahili na subtitle za
              Kiingereza.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={
                safeFeaturedStory.slug === "stories"
                  ? "/stories"
                  : `/stories/${safeFeaturedStory.slug}`
              }
              className="rounded-full bg-platinumGold px-8 py-4 text-lg font-semibold text-black transition hover:scale-[1.02]"
            >
              Anza Kusikiliza
            </Link>

            <Link
              href={
                safeFeaturedStory.slug === "stories"
                  ? "/stories"
                  : `/stories/${safeFeaturedStory.slug}`
              }
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Tazama Featured Story
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Narration
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Kiswahili sanifu
              </h3>
              <p className="mt-3 text-slate-300">
                Sauti iliyolengwa kwa experience ya Afrika Mashariki.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Subtitles
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                English live sync
              </h3>
              <p className="mt-3 text-slate-300">
                Subtitle panel inayofuatilia simulizi kwa wakati halisi.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Tone
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Cinematic
              </h3>
              <p className="mt-3 text-slate-300">
                Mchanganyiko wa ambience, music, na visual scenes.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-white/10 bg-card p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xl text-slate-200">Featured Story</span>
            <span className="text-xl text-slate-300">
              {safeFeaturedStory.duration}
            </span>
          </div>

          <div className="mt-10 space-y-6">
            <h2 className="text-5xl font-bold leading-tight text-white">
              {safeFeaturedStory.title}
            </h2>

            <p className="text-sm uppercase tracking-[0.45em] text-slate-400">
              {safeFeaturedStory.category}
            </p>

            <p className="text-2xl leading-10 text-slate-200">
              {safeFeaturedStory.summary}
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-background/60 p-6">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xl">Narration preview</span>
              <span className="text-2xl">🔊</span>
            </div>

            <h3 className="mt-5 text-4xl font-bold text-white">
              {safeFeaturedStory.audioLabel}
            </h3>

            <div className="mt-8 h-4 w-full rounded-full bg-white/10">
              <div className="h-4 w-1/2 rounded-full bg-platinumGold" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-background/40 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Audio Experience
              </p>
              <p className="mt-3 text-lg leading-8 text-slate-200">
                Storytelling yenye pacing na mood ya documentary.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-background/40 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Subtitle Mode
              </p>
              <p className="mt-3 text-lg leading-8 text-slate-200">
                English subtitle panel inayofuatilia audio live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Latest stories
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Simulizi za kusikiliza sasa
            </h2>
          </div>

          <Link
            href="/stories"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            Tazama zote
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestStories.length > 0 ? (
            latestStories.map((story, index) => (
              <Link
                key={story.id || story.slug || `story-${index}`}
                href={`/stories/${story.slug}`}
                className="group rounded-[2rem] border border-white/10 bg-card p-6 transition hover:-translate-y-1 hover:border-platinumGold/30"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-platinumGold/10 px-3 py-1 text-sm text-platinumGold">
                    Story
                  </span>
                  <span className="text-sm text-slate-400">
                    {story.duration_seconds
                      ? `${Math.max(1, Math.round(story.duration_seconds / 60))} min`
                      : "12 min"}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-white group-hover:text-platinumGold">
                  {story.title}
                </h3>

                <p className="mt-4 line-clamp-4 text-slate-300">
                  {story.short_description ||
                    story.story_summary ||
                    "Simulizi la kweli la kihistoria linalosubiri kusikilizwa."}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {story.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm font-semibold text-platinumGold">
                    Fungua story →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-8 text-slate-400 md:col-span-2 xl:col-span-3">
              Hakuna stories bado. Ukishaongeza stories kwenye studio, zitaonekana hapa.
            </div>
          )}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
            Categories
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Chunguza kwa mada
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link
                key={category.id || category.slug || `category-${index}`}
                href={`/categories/${category.slug}`}
                className="rounded-[2rem] border border-white/10 bg-card p-6 transition hover:border-platinumGold/30"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                    {category.story_count}
                  </span>
                </div>

                <p className="mt-4 text-slate-300">
                  {category.description || "Hakuna maelezo ya category bado."}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-8 text-slate-400 md:col-span-2 xl:col-span-3">
              Hakuna categories bado.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}