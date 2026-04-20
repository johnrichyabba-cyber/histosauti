import Link from "next/link";

type StoryCardProps = {
  story: {
    id?: string;
    slug: string;
    title: string;
    short_description?: string | null;
    story_summary?: string | null;
    duration_seconds?: number | null;
    status?: string | null;
    cover_image_url?: string | null;
    featured_image?: string | null;
    published_at?: string | null;
    category_name?: string | null;
  };
};

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds <= 0) return "12 min";
  return `${Math.max(1, Math.round(durationSeconds / 60))} min`;
}

export default function StoryCard({ story }: StoryCardProps) {
  const image =
    story.cover_image_url ||
    story.featured_image ||
    "/images/placeholders/story-cover.jpg";

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-card transition hover:-translate-y-1 hover:border-platinumGold/30"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={story.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-platinumGold/10 px-3 py-1 text-sm text-platinumGold">
            {story.category_name || "Story"}
          </span>

          <span className="text-sm text-slate-400">
            {formatDuration(story.duration_seconds)}
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
            {story.status === "published" ? "Published" : "Ready to explore"}
          </span>

          <span className="text-sm font-semibold text-platinumGold">
            Fungua story →
          </span>
        </div>
      </div>
    </Link>
  );
}