import Link from "next/link";
import { getCategoriesWithCounts, getLatestStories } from "@/lib/stories";

export default async function CategoriesPage() {
  const [categories, latestStories] = await Promise.all([
    getCategoriesWithCounts(),
    getLatestStories(12),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
          Categories
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Chunguza simulizi kwa mada
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Hapa unaweza kuchagua simulizi kulingana na aina ya tukio, hisia,
          historia, au mtazamo wa documentary unaoutaka.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category, index) => {
            const relatedStories = latestStories.filter(
              (story) => story.category_id === category.id,
            );

            return (
              <div
                key={category.id || category.slug || `category-${index}`}
                className="rounded-[2rem] border border-white/10 bg-card p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    {category.name}
                  </h2>

                  <span className="rounded-full bg-platinumGold/10 px-3 py-1 text-sm text-platinumGold">
                    {category.story_count}
                  </span>
                </div>

                <p className="mt-4 text-slate-300">
                  {category.description || "Hakuna maelezo ya category bado."}
                </p>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Stories za karibu
                  </p>

                  <div className="mt-4 space-y-3">
                    {relatedStories.length > 0 ? (
                      relatedStories.slice(0, 3).map((story, storyIndex) => (
                        <Link
                          key={story.id || story.slug || `story-${storyIndex}`}
                          href={`/stories/${story.slug}`}
                          className="block rounded-2xl border border-white/10 bg-background/40 px-4 py-3 transition hover:border-platinumGold/30 hover:text-platinumGold"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-white">
                              {story.title}
                            </span>
                            <span className="text-xs text-slate-400">
                              {story.duration_seconds
                                ? `${Math.max(
                                    1,
                                    Math.round(story.duration_seconds / 60),
                                  )} min`
                                : "12 min"}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-400">
                        Hakuna stories za category hii bado.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {category.slug}
                  </span>
                  <Link
                    href="/stories"
                    className="text-sm font-semibold text-platinumGold hover:underline"
                  >
                    Tazama zaidi →
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-8 text-slate-400 md:col-span-2 xl:col-span-3">
            Hakuna categories bado. Ongeza categories kupitia admin au data source yako.
          </div>
        )}
      </section>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-background/40 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Continue
            </p>
            <h2 className="mt-3 text-3xl font-bold">Endelea kusikiliza</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Rudi kwenye stories zote au fungua admin kuongeza simulizi mpya,
              media, narration, na research ya OpenAI.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/stories"
              className="rounded-full bg-platinumGold px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Tazama stories
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-platinumGold/30 hover:text-platinumGold"
            >
              Fungua admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}