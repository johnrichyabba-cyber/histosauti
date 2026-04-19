import Link from "next/link";
import { ArrowUpRight, Layers3, Library, Sparkles } from "lucide-react";
import { getCategories, getPublishedStories } from "@/lib/stories";

export default async function CategoriesPage() {
  const [categories, stories] = await Promise.all([getCategories(), getPublishedStories()]);

  const categoryCards = categories.map((category) => {
    const categoryStories = stories.filter((story) => story.category.toLowerCase() === category.name.toLowerCase());
    return {
      ...category,
      count: categoryStories.length,
      sampleStories: categoryStories.slice(0, 3),
      latestStory: categoryStories[0] || null
    };
  });

  return (
    <section className="pb-16 pt-10 md:pt-16">
      <div className="container space-y-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(214,190,138,0.14),rgba(9,13,21,0.88)_40%,rgba(7,11,20,0.98))] p-6 shadow-glow md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.95fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-platnumGold/25 bg-platnumGold/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-platnumGold">
                <Layers3 className="h-3.5 w-3.5" />
                Story Categories
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
                Chagua mkondo wa simulizi unaolingana na hisia na aina ya historia unayotaka kusikiliza.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/85 md:text-base">
                HistoSauti imepangwa kwa categories ili iwe rahisi kutafuta true crime, majanga, viongozi waliobadili dunia, na mafumbo ya kihistoria kwa mpangilio wa kisasa.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-platnumGold">Total categories</p>
                <p className="mt-3 text-3xl font-black text-white">{categories.length}</p>
                <p className="mt-2 text-sm text-slate-300">Makundi makuu ya content ndani ya portal yako.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-platnumGold">Stories indexed</p>
                <p className="mt-3 text-3xl font-black text-white">{stories.length}</p>
                <p className="mt-2 text-sm text-slate-300">Simulizi ambazo tayari zinaweza kuingia kwenye archive na related sections.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-platnumGold">Explore mode</p>
                <p className="mt-3 flex items-center gap-2 text-lg font-bold text-white">
                  <Sparkles className="h-5 w-5 text-platnumGold" />
                  Premium navigation
                </p>
                <p className="mt-2 text-sm text-slate-300">Bofya category yoyote uende moja kwa moja kwenye archive iliyochujwa.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {categoryCards.map((category) => (
            <article
              id={category.slug}
              key={category.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-card/90 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-platnumGold/30 hover:shadow-glow md:p-7"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex rounded-full border border-platnumGold/20 bg-platnumGold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-platnumGold">
                    {category.count} stor{category.count === 1 ? "y" : "ies"}
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-white md:text-3xl">{category.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {category.description ||
                      "Kundi hili limebuniwa kwa simulizi zenye hisia, ushahidi wa kihistoria, na mtiririko wa documentary unaovuta msikilizaji."}
                  </p>
                </div>

                <Link
                  href={`/stories?category=${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-platnumGold/25 bg-platnumGold/10 px-4 py-2 text-sm font-semibold text-platnumGold transition hover:border-platnumGold hover:bg-platnumGold hover:text-slate-950"
                >
                  Open archive
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-platnumGold">Category preview</p>
                  {category.latestStory ? (
                    <>
                      <h3 className="mt-3 text-xl font-bold text-white">{category.latestStory.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{category.latestStory.shortDescription}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                        <span>{category.latestStory.duration}</span>
                        <span>{category.latestStory.audioLanguage}</span>
                        <span>{category.latestStory.subtitleLanguage} subtitles</span>
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Hili kundi bado halina story live kutoka database, lakini liko tayari kupokea content mpya kutoka admin dashboard.
                    </p>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-platnumGold">
                    <Library className="h-3.5 w-3.5" />
                    Stories inside
                  </p>
                  <div className="mt-4 space-y-3">
                    {category.sampleStories.length > 0 ? (
                      category.sampleStories.map((story) => (
                        <Link
                          key={story.id}
                          href={`/stories/${story.slug}`}
                          className="block rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 transition hover:border-platnumGold/30 hover:text-white"
                        >
                          <div className="font-semibold">{story.title}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{story.duration}</div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                        No stories yet in this category.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
