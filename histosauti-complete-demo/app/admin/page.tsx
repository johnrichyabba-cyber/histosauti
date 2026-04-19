import Link from "next/link";
import { getAdminOverview } from "@/lib/stories";

function formatDate(value?: string | null) {
  if (!value) return "Not published yet";
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function AdminHomePage() {
  const overview = await getAdminOverview();
  const { stats, recentStories, categoryBreakdown } = overview;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-gold/15 bg-gradient-to-br from-gold/10 via-slate-950/80 to-slate-950/70 p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white md:text-4xl">HistoSauti admin demo</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Toleo hili limekamilishwa kwa demo data, media configs, na story visuals tayari kwa kutest mara moja.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/admin/media" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-slate-950">
            Fungua media manager
          </Link>
          <Link href="/stories" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">
            Fungua public portal
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Stories", value: stats.totalStories, note: `${stats.publishedStories} published` },
          { label: "Featured", value: stats.featuredStories, note: `${stats.audioReadyStories} audio-ready` },
          { label: "Subtitles", value: stats.subtitleReadyStories, note: `${stats.totalMinutes} total minutes` },
          { label: "Latest publish", value: formatDate(stats.latestPublishedAt), note: "most recent" }
        ].map((card) => (
          <article key={card.label} className="rounded-[1.75rem] border border-white/10 bg-card/90 p-6 shadow-soft">
            <p className="text-sm text-slate-400">{card.label}</p>
            <h2 className="mt-4 text-3xl font-bold text-white">{card.value}</h2>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-gold/70">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-card/90 p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-white">Recent stories</h2>
          <div className="mt-6 space-y-4">
            {recentStories.map((story) => (
              <div key={story.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{story.title}</p>
                    <p className="mt-2 text-sm text-slate-400">{story.category} • {story.duration}</p>
                  </div>
                  <Link href={`/stories/${story.slug}`} className="text-sm font-semibold text-gold">Open</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card/90 p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-white">Category health</h2>
          <div className="mt-6 space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{category.name}</p>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">{category.count}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{category.description || "Category ya portal"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
