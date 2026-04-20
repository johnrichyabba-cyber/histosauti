import Link from "next/link";
import { getCategories } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
              Admin
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Simamia categories
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
              Hapa unaona categories zote zilizopo kwenye mfumo. Ukibadilisha
              data au kuongeza categories mpya, zitaonekana hapa.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Rudi Admin
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.length > 0 ? (
            categories.map((category, index) => (
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
                    <p className="mt-2 text-sm text-slate-400">
                      {category.slug}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                    {category.story_count ?? 0} stories
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/categories`}
                    className="rounded-full bg-[#d4b26a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    View public page
                  </Link>

                  <Link
                    href="/admin/stories/new"
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Add story
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
                Hakuna categories bado.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}