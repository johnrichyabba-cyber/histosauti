import Link from "next/link";
import { notFound } from "next/navigation";
import { getStories } from "@/lib/stories";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item))
    .filter((item) => item.trim().length > 0);
}

type SceneItem = {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  duration?: number;
};

function asScenes(value: unknown): SceneItem[] {
  if (!Array.isArray(value)) return [];

  const scenes: SceneItem[] = [];

  value.forEach((scene, index) => {
    if (!scene || typeof scene !== "object") return;

    const item = scene as Record<string, unknown>;

    scenes.push({
      id: asString(item.id, `scene-${index + 1}`),
      title: asString(item.title, `Scene ${index + 1}`),
      text:
        asString(item.text) ||
        asString(item.description) ||
        asString(item.caption),
      imageUrl:
        asString(item.imageUrl) ||
        asString(item.image_url) ||
        asString(item.image) ||
        undefined,
      duration:
        typeof item.duration === "number"
          ? item.duration
          : Number(item.duration ?? 0) || undefined,
    });
  });

  return scenes;
}

function pickStoryDescription(story: Record<string, unknown>) {
  return (
    asString(story.short_description) ||
    asString(story.description) ||
    asString(story.body).slice(0, 220) ||
    asString(story.content).slice(0, 220) ||
    "Hakuna maelezo ya story kwa sasa."
  );
}

function pickStoryBody(story: Record<string, unknown>) {
  return (
    asString(story.body) ||
    asString(story.content) ||
    asString(story.story) ||
    ""
  );
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const stories = await getStories();

  const matched = stories.find((item) => item.slug === slug);

  if (!matched) {
    notFound();
  }

  const story = matched as Record<string, unknown>;
  const allStories = stories as Array<Record<string, unknown>>;

  const id = asString(story.id, slug);
  const title = asString(story.title, "Untitled story");
  const storySlug = asString(story.slug, slug);
  const category = asString(story.category, "General");
  const description = pickStoryDescription(story);
  const body = pickStoryBody(story);

  const subtitleUrl = asString(story.subtitle_url);
  const narrationUrl =
    asString(story.audio_url) || asString(story.narration_url);
  const posterUrl =
    asString(story.poster_url) ||
    asString(story.cover_image_url) ||
    asString(story.image_url);
  const ambianceUrl = asString(story.ambiance_url);
  const musicUrl = asString(story.music_url);

  const featured = asBoolean(story.featured);
  const galleryImages = asStringArray(story.gallery_images);
  const scenes = asScenes(story.scenes);

  const relatedStories = allStories
    .filter((item) => asString(item.slug) !== storySlug)
    .filter((item) => asString(item.category, "General") === category)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Story detail
              </p>

              <h1 className="mt-4 text-4xl font-bold md:text-6xl">{title}</h1>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 px-4 py-2">
                  {category}
                </span>

                <span className="rounded-full border border-white/10 px-4 py-2">
                  {featured ? "Featured" : "Standard"}
                </span>

                <span className="rounded-full border border-white/10 px-4 py-2">
                  {storySlug}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/stories"
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Stories zote
                </Link>

                <Link
                  href={`/admin/stories/${id}/edit`}
                  className="rounded-full bg-[#d4b26a] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Edit story
                </Link>
              </div>
            </div>

            <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-[#081121] p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-[#d4b26a]">
                Audio player
              </p>

              <div className="mt-5 space-y-5">
                {posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={posterUrl}
                    alt={title}
                    className="h-64 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0d1728] text-slate-400">
                    Hakuna poster image
                  </div>
                )}

                {narrationUrl ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-4">
                    <p className="mb-3 text-sm font-semibold text-slate-300">
                      Sikiliza narration
                    </p>
                    <audio controls className="w-full" preload="metadata">
                      <source src={narrationUrl} />
                      Browser yako haisupport audio player.
                    </audio>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1728] p-4 text-sm text-slate-400">
                    Hakuna narration audio kwa sasa.
                  </div>
                )}

                {subtitleUrl ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Subtitle file</p>
                    <p className="mt-2 break-all text-slate-400">
                      {subtitleUrl}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.25fr,0.75fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
              Story script
            </p>

            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-200">
              {body || "Hakuna maandishi ya story kwa sasa."}
            </div>
          </div>

          <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Media status
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081121] px-4 py-3">
                  <span>Narration</span>
                  <span>{narrationUrl ? "Ready" : "Missing"}</span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081121] px-4 py-3">
                  <span>Subtitle</span>
                  <span>{subtitleUrl ? "Ready" : "Missing"}</span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081121] px-4 py-3">
                  <span>Poster</span>
                  <span>{posterUrl ? "Ready" : "Missing"}</span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081121] px-4 py-3">
                  <span>Ambience</span>
                  <span>{ambianceUrl ? "Ready" : "Missing"}</span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081121] px-4 py-3">
                  <span>Music</span>
                  <span>{musicUrl ? "Ready" : "Missing"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Scenes
              </p>

              {scenes.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="rounded-2xl border border-white/10 bg-[#081121] p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {scene.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-400">
                        {scene.text || "Hakuna scene text."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#081121] p-5 text-sm text-slate-400">
                  Hakuna scenes kwa sasa.
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Gallery
              </p>

              {galleryImages.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {galleryImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#081121]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`${title} gallery ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#081121] p-5 text-sm text-slate-400">
                  Hakuna gallery images kwa sasa.
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
                Related stories
              </p>
              <h2 className="mt-3 text-3xl font-bold">Stories zinazofanana</h2>
            </div>

            <Link
              href="/stories"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Fungua zote
            </Link>
          </div>

          {relatedStories.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedStories.map((item) => {
                const related = item as Record<string, unknown>;
                const relatedTitle = asString(related.title, "Untitled story");
                const relatedSlug = asString(related.slug);
                const relatedCategory = asString(related.category, "General");
                const relatedDescription = pickStoryDescription(related);

                return (
                  <Link
                    key={relatedSlug || relatedTitle}
                    href={relatedSlug ? `/stories/${relatedSlug}` : "/stories"}
                    className="rounded-[1.5rem] border border-white/10 bg-[#081121] p-5 transition hover:border-[#d4b26a]/40"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#d4b26a]">
                      {relatedCategory}
                    </p>

                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {relatedTitle}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {relatedDescription}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.25rem] border border-dashed border-white/10 p-5 text-slate-400">
              Hakuna related stories kwa sasa.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}