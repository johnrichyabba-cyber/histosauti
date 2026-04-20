import Link from "next/link";
import { getStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

function formatDate(value?: string | null) {
  if (!value) return "Bado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("sw-TZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminStoriesPage() {
  const stories = await getStories();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
              Admin
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Simamia simulizi zote
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
              Hapa unaona simulizi zote zilizopo kwenye mfumo, unaweza
              kuongeza, kufungua, au kuhariri kila moja.
            </p>
          </div>

          <Link
            href="/admin/stories/new"
            className="inline-flex items-center justify-center rounded-full bg-[#d4b26a] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Ongeza story mpya
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Title
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Slug
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Category
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Duration
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Published
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {stories.length > 0 ? (
                  stories.map((story) => (
                    <tr key={story.id} className="hover:bg-white/5">
                      <td className="px-5 py-4 align-top">
                        <div className="font-semibold text-white">
                          {story.title}
                        </div>
                        <div className="mt-1 max-w-md text-sm text-slate-400">
                          {story.summary || "Hakuna summary."}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top text-sm text-slate-300">
                        {story.slug}
                      </td>

                      <td className="px-5 py-4 align-top text-sm text-slate-300">
                        {story.category || "General"}
                      </td>

                      <td className="px-5 py-4 align-top text-sm text-slate-300">
                        {story.duration || "—"}
                      </td>

                      <td className="px-5 py-4 align-top text-sm text-slate-300">
                        {formatDate(
                          (story as { published_at?: string | null }).published_at
                        )}
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/stories/${story.slug}`}
                            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                          >
                            Open
                          </Link>

                          <Link
                            href={`/admin/stories/${story.id}/edit`}
                            className="rounded-full bg-[#d4b26a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      Hakuna stories bado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}