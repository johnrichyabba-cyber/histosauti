import Link from "next/link";
import { getAdminOverview } from "@/lib/stories";

export const dynamic = "force-dynamic";

function formatDate(value?: string | null) {
  if (!value) return "Hakuna bado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Hakuna bado";

  return new Intl.DateTimeFormat("sw-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminHomePage() {
  const overview = await getAdminOverview();

  const {
    totals,
    recentStories,
    recentPublished,
    draftQueue,
    latestPublishedAt,
  } = overview;

  const quickCategoryPreview = Array.from(
    new Set(
      recentStories
        .map((story) => story.category)
        .filter((value): value is string => Boolean(value && value.trim())),
    ),
  ).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 md:p-12">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
            Admin overview
          </p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold md:text-6xl">
                Admin Control Room
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Simamia stories, categories, subtitle, audio, research, na
                publication flow ya HistoSauti kutoka sehemu moja.
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
                href="/admin/categories"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Simamia categories
              </Link>

              <Link
                href="/admin/research"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Research
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Published
            </p>
            <h2 className="mt-3 text-4xl font-bold">{totals.published}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Stories zilizo live kwa wasikilizaji.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Drafts
            </p>
            <h2 className="mt-3 text-4xl font-bold">{totals.drafts}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Stories ambazo bado hazijapublishiwa.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Featured
            </p>
            <h2 className="mt-3 text-4xl font-bold">{totals.featured}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Stories zilizowekwa spotlight.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Subtitle ready
            </p>
            <h2 className="mt-3 text-4xl font-bold">{totals.subtitleReady}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Zenye subtitle tayari kwa matumizi.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Audio ready
            </p>
            <h2 className="mt-3 text-4xl font-bold">{totals.audioReady}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Zenye audio tayari kwa playback.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Total audio minutes
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {totals.totalAudioMinutes}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Jumla ya dakika za audio zilizopo.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
                  Recent stories
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Stories zilizoongezwa karibuni
                </h3>
              </div>

              <Link
                href="/admin/stories"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Fungua zote
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {recentStories.length > 0 ? (
                recentStories.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl border border-white/10 bg-[#081121] p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {story.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-400">
                          {story.category || "General"} {"•"}{" "}
                          {story.status || "draft"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/stories/${story.slug}`}
                          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/stories/${story.id}/edit`}
                          className="rounded-full bg-[#d4b26a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#081121] p-6 text-slate-400">
                  Hakuna stories bado.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
                Latest publish
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                {formatDate(latestPublishedAt)}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Muda wa mwisho story ilipopublishiwa.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
                Draft queue
              </p>
              <h3 className="mt-3 text-2xl font-bold">{draftQueue.length}</h3>
              <div className="mt-4 space-y-3">
                {draftQueue.length > 0 ? (
                  draftQueue.slice(0, 5).map((story) => (
                    <div
                      key={story.id}
                      className="rounded-xl border border-white/10 bg-[#081121] p-3"
                    >
                      <p className="font-medium text-white">{story.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {story.category || "General"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Hakuna draft queue kwa sasa.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
                Quick category preview
              </p>
              <div className="mt-4 space-y-3">
                {quickCategoryPreview.length > 0 ? (
                  quickCategoryPreview.map((categoryName) => (
                    <div
                      key={categoryName}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#081121] p-3"
                    >
                      <span className="font-medium text-white">
                        {categoryName}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        Category
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Hakuna categories za preview kwa sasa.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
                  Recently published
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Zilizopublishiwa karibuni
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {recentPublished.length > 0 ? (
                recentPublished.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl border border-white/10 bg-[#081121] p-4"
                  >
                    <p className="font-semibold text-white">{story.title}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {story.category || "General"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#081121] p-6 text-slate-400">
                  Hakuna published stories bado.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              Quick links
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/stories/new"
                className="rounded-2xl border border-white/10 bg-[#081121] p-4 text-white transition hover:border-[#d4b26a]/40"
              >
                Ongeza story mpya
              </Link>

              <Link
                href="/admin/stories"
                className="rounded-2xl border border-white/10 bg-[#081121] p-4 text-white transition hover:border-[#d4b26a]/40"
              >
                Simamia stories
              </Link>

              <Link
                href="/admin/categories"
                className="rounded-2xl border border-white/10 bg-[#081121] p-4 text-white transition hover:border-[#d4b26a]/40"
              >
                Simamia categories
              </Link>

              <Link
                href="/admin/research"
                className="rounded-2xl border border-white/10 bg-[#081121] p-4 text-white transition hover:border-[#d4b26a]/40"
              >
                Research studio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}