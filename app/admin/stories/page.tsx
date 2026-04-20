import Link from "next/link";
import { getStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

function getStoryDescription(story: Record<string, unknown>) {
  const shortDescription =
    typeof story.short_description === "string"
      ? story.short_description
      : "";

  const description =
    typeof story.description === "string" ? story.description : "";

  const body = typeof story.body === "string" ? story.body : "";
  const content = typeof story.content === "string" ? story.content : "";
  const script = typeof story.story === "string" ? story.story : "";

  return (
    shortDescription ||
    description ||
    body.slice(0, 160) ||
    content.slice(0, 160) ||
    script.slice(0, 160) ||
    "Hakuna maelezo."
  );
}

function getStoryStatus(story: Record<string, unknown>) {
  return typeof story.status === "string" ? story.status : "draft";
}

function getStoryCategory(story: Record<string, unknown>) {
  return typeof story.category === "string" && story.category.trim()
    ? story.category
    : "General";
}

function isFeatured(story: Record<string, unknown>) {
  return story.featured === true;
}

export default async function AdminStoriesPage() {
  const stories = await getStories();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Admin
              </p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                Simamia stories
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                Orodha ya stories zote za HistoSauti. Fungua, hariri, na
                simamia publication flow bila kuvunja production build.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/stories/new"
                className="rounded-full bg-[#d4b26a] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Ongeza story
              </Link>

              <Link
                href="/stories"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Angalia public page
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          {stories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-left text-sm uppercase tracking-[0.22em] text-slate-400">
                    <th className="px-4 py-2">Story</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Featured</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {stories.map((item) => {
                    const story = item as Record<string, unknown>;
                    const id =
                      typeof story.id === "string" || typeof story.id === "number"
                        ? String(story.id)
                        : "";
                    const slug =
                      typeof story.slug === "string" ? story.slug : "";
                    const title =
                      typeof story.title === "string"
                        ? story.title
                        : "Untitled story";
                    const description = getStoryDescription(story);
                    const category = getStoryCategory(story);
                    const status = getStoryStatus(story);
                    const featured = isFeatured(story);

                    return (
                      <tr key={id || slug || title}>
                        <td className="rounded-l-3xl border border-r-0 border-white/10 bg-[#081121] px-4 py-5 align-top">
                          <div className="font-semibold text-white">{title}</div>
                          <div className="mt-1 text-sm text-slate-400">
                            {slug || "hakuna-slug"}
                          </div>
                          <div className="mt-3 max-w-md text-sm text-slate-400">
                            {description}
                          </div>
                        </td>

                        <td className="border border-r-0 border-l-0 border-white/10 bg-[#081121] px-4 py-5 align-top text-sm text-slate-300">
                          {category}
                        </td>

                        <td className="border border-r-0 border-l-0 border-white/10 bg-[#081121] px-4 py-5 align-top">
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                            {status}
                          </span>
                        </td>

                        <td className="border border-r-0 border-l-0 border-white/10 bg-[#081121] px-4 py-5 align-top text-sm text-slate-300">
                          {featured ? "Yes" : "No"}
                        </td>

                        <td className="rounded-r-3xl border border-l-0 border-white/10 bg-[#081121] px-4 py-5 align-top">
                          <div className="flex flex-wrap gap-2">
                            {slug ? (
                              <Link
                                href={`/stories/${slug}`}
                                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                              >
                                View
                              </Link>
                            ) : null}

                            {id ? (
                              <Link
                                href={`/admin/stories/${id}/edit`}
                                className="rounded-full bg-[#d4b26a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                              >
                                Edit
                              </Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[#081121] p-8 text-slate-400">
              Hakuna stories bado. Ukishaongeza story kupitia admin studio,
              itaonekana hapa.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}