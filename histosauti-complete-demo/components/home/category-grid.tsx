import Link from "next/link";
import type { CategoryRecord, StoryRecord } from "@/lib/types";

type CategoryGridProps = {
  categories: CategoryRecord[];
  stories: StoryRecord[];
};

export function CategoryGrid({ categories, stories }: CategoryGridProps) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-platnumGold">Explore</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Makundi ya Stori</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Chagua mkondo wa simulizi unaokuvutia—kutoka true crime hadi matukio ya kihistoria yaliyoacha alama kubwa duniani.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => {
            const count = stories.filter((story) => story.category.toLowerCase() === category.name.toLowerCase()).length;
            return (
              <Link
                key={category.id}
                href={`/stories?category=${category.slug}`}
                className="group rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-platnumGold/25 hover:shadow-glow"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-white">{category.name}</p>
                  <span className="rounded-full bg-platnumGold/12 px-3 py-1 text-xs text-platnumGold">{count} story{count === 1 ? "" : "ies"}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {category.description || "Bofya kufungua archive ya simulizi ndani ya kundi hili."}
                </p>
                <p className="mt-5 text-sm font-semibold text-platnumGold transition group-hover:translate-x-1">Explore category →</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
