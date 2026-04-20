import Link from "next/link";
import { getCategories, getStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default async function CategoriesPage({
  searchParams,
}: CategoryPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim() ?? "";

  const [categories, latestStories] = await Promise.all([
    getCategories(),
    getStories(),
  ]);

  const filteredCategories = categories.filter((category) => {
    if (!query) return true;

    const haystack = [
      category.name ?? "",
      String(category.story_count ?? ""),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalize(query));
  });

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 md:p-12">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
            Categories
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Chunguza categories za HistoSauti
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Tafuta na fungua simulizi kulingana na mada zake. Kila category
            inaonyesha stories zake za karibu ili mtumiaji afike haraka kwenye
            anachotaka kusikiliza.
          </p>

          <form className="mt-8">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Tafuta category..."
                className="w-full rounded-full border border-white/10 bg-[#081121] px-5 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="rounded-full bg-[#d4b26a] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Tafuta
              </button>
            </div>
          </form>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => {
              const relatedStories = latestStories.filter(
                (story) =>
                  (story.category ?? "").trim().toLowerCase() ===
                  (category.name ?? "").trim().toLowerCase(),
              );

              return (
                <div
                  key={category.id || `category-${index}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-[#d4b26a]">
                        Category
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        {category.name}
                      </h2>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {category.story_count ?? 0} stories
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {relatedStories.length > 0 ? (
                      relatedStories.slice(0, 4).map((story) => (
                        <Link
                          key={story.id}
                          href={`/stories/${story.slug}`}
                          className="block rounded-2xl border border-white/10 bg-[#081121] p-4 transition hover:border-[#d4b26a]/40 hover:bg-white/5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                {story.title}
                              </h3>
                              <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                                {story.summary}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                              {story.duration || "—"}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#081121] p-4 text-sm text-slate-400">
                        Hakuna stories bado ndani ya category hii.
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/stories"
                      className="inline-flex rounded-full bg-[#d4b26a] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                      Fungua stories zote
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
                Hakuna categories zilizopatikana kwa sasa.
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}