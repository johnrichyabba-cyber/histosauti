import Link from "next/link";
import { notFound } from "next/navigation";
import StoryCinematicPlayer from "@/components/story-cinematic-player";
import { getLatestStories, getStoryBySlug } from "@/lib/stories";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds <= 0) return "12 min";
  return `${Math.max(1, Math.round(durationSeconds / 60))} min`;
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

type SceneItem = {
  id: string;
  title: string;
  time: string;
  summary: string;
  subtitle: string;
  imageUrl: string | null;
  ambienceUrl: string | null;
};

function safeScenes(value: unknown): SceneItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((scene, index) => {
    const item = scene as Record<string, unknown>;

    return {
      id:
        typeof item.id === "string" && item.id.trim().length > 0
          ? item.id
          : `scene-${index + 1}`,
      title:
        typeof item.title === "string" && item.title.trim().length > 0
          ? item.title
          : `Scene ${index + 1}`,
      time:
        typeof item.time === "string" && item.time.trim().length > 0
          ? item.time
          : "0:00",
      summary: typeof item.summary === "string" ? item.summary : "",
      subtitle:
        typeof item.subtitle === "string"
          ? item.subtitle
          : typeof item.summary === "string"
            ? item.summary
            : "",
      imageUrl:
        typeof item.imageUrl === "string"
          ? item.imageUrl
          : typeof item.image_url === "string"
            ? (item.image_url as string)
            : null,
      ambienceUrl:
        typeof item.ambienceUrl === "string"
          ? item.ambienceUrl
          : typeof item.ambience_url === "string"
            ? (item.ambience_url as string)
            : null,
    };
  });
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const rawStory = story as Record<string, unknown>;

  const posterUrl =
    safeString(rawStory.cover_image_url) ||
    safeString(rawStory.featured_image) ||
    safeString(rawStory.image_url) ||
    "/images/placeholders/story-cover.jpg";

  const narrationUrl =
    safeString(rawStory.narration_url) ||
    safeString(rawStory.audio_url) ||
    null;

  const ambienceUrl = safeString(rawStory.ambience_url);
  const musicUrl =
    safeString(rawStory.music_url) || safeString(rawStory.soundtrack_url);

  const galleryImages = safeStringArray(rawStory.gallery_images);
  const scenes = safeScenes(rawStory.scenes);

  const relatedStories = (await getLatestStories(6)).filter(
    (item) => item.slug !== story.slug,
  );

  const fallbackText = [
    story.title,
    story.short_description,
    story.story_summary,
    ...scenes.map((scene) => scene.subtitle || scene.summary),
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-platinumGold/10 px-4 py-2 text-sm text-platinumGold">
            {safeString(rawStory.category_name) ||
              safeString(rawStory.category) ||
              "Story"}
          </span>

          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
            {safeString(rawStory.published_at) || "Not published yet"}
          </span>

          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
            {formatDuration(story.duration_seconds)}
          </span>

          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
            {scenes.length > 0 ? `${scenes.length} chapters` : "No chapters"}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
          {story.title}
        </h1>

        <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">
          {story.short_description ||
            story.story_summary ||
            "Hakuna maelezo mafupi ya story hii bado."}
        </p>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <StoryCinematicPlayer
            title={story.title}
            narrationUrl={narrationUrl}
            posterUrl={posterUrl}
            ambienceUrl={ambienceUrl}
            musicUrl={musicUrl}
            scenes={scenes}
            fallbackText={fallbackText}
          />

          <section className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
              Story summary
            </p>

            <div className="mt-5 space-y-5 text-lg leading-9 text-slate-200">
              <p>
                {story.story_summary ||
                  story.short_description ||
                  "Muhtasari wa kina wa story hii bado haujaongezwa."}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-card p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
                Gallery
              </p>
              <p className="text-sm text-slate-400">
                {galleryImages.length > 0
                  ? `${galleryImages.length} images`
                  : "No gallery yet"}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {galleryImages.length > 0 ? (
                galleryImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-background/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${story.title} gallery ${index + 1}`}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 p-6 text-slate-400 md:col-span-2">
                  Hakuna gallery images bado kwa story hii.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
              Story info
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="text-sm text-slate-400">Title</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {story.title}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="text-sm text-slate-400">Slug</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {story.slug}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="text-sm text-slate-400">Duration</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatDuration(story.duration_seconds)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {story.status || "draft"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-card p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
                Related stories
              </p>
              <Link
                href="/stories"
                className="text-sm font-semibold text-platinumGold hover:underline"
              >
                Tazama zote
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {relatedStories.length > 0 ? (
                relatedStories.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.id || item.slug || `related-${index}`}
                    href={`/stories/${item.slug}`}
                    className="block rounded-[1.25rem] border border-white/10 bg-background/40 p-4 transition hover:border-platinumGold/30"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-sm text-slate-400">
                        {formatDuration(item.duration_seconds)}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                      {item.short_description ||
                        item.story_summary ||
                        "Simulizi jingine la kweli la kihistoria."}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-white/10 p-5 text-slate-400">
                  Hakuna related stories kwa sasa.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}