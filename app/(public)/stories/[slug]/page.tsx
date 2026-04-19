import Link from "next/link";
import StoryCinematicPlayer from "@/components/story-cinematic-player";
import { getRelatedStories, getStoryBySlug } from "@/lib/stories";
import { getStoryMediaConfigBySlug } from "@/lib/media-manager";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const storyBundle = await getStoryBySlug(slug);

  if (!storyBundle?.story) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-white">
        <div className="rounded-3xl border border-dashed border-white/10 bg-card p-10">
          <h1 className="text-3xl font-bold">Story haijapatikana</h1>
          <p className="mt-4 text-slate-300">
            Simulizi hili bado halipo au limeondolewa.
          </p>
          <Link
            href="/stories"
            className="mt-6 inline-flex rounded-full bg-platinumGold px-5 py-3 font-semibold text-black"
          >
            Rudi kwenye stories
          </Link>
        </div>
      </main>
    );
  }

  const { story, category, sources, timeline, narrator } = storyBundle;
  const relatedStories = await getRelatedStories(story.id, story.category_id, 3);
  const mediaConfig = await getStoryMediaConfigBySlug(story.slug);

  const narrationUrl = mediaConfig?.narration_url || story.audio_url || "";
  const posterUrl = mediaConfig?.cover_image_url || story.cover_image_url || null;
  const scenes = mediaConfig?.scenes || [];
  const galleryImages = mediaConfig?.gallery_images || [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-white lg:px-8">
      <section className="mb-10 rounded-[2rem] border border-white/10 bg-card p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-platinumGold/10 px-4 py-2 text-sm text-platinumGold">
            {category?.name || "History"}
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            {story.duration_seconds
              ? `${Math.max(1, Math.round(story.duration_seconds / 60))} min`
              : "Duration unknown"}
          </span>
          {narrator ? (
            <span className="rounded-full border border-platinumGold/30 bg-platinumGold/10 px-4 py-2 text-sm text-platinumGold">
              Narration: {narrator.badge}
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 text-4xl font-bold md:text-5xl">{story.title}</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
          {story.story_summary || story.short_description || "Hakuna summary kwa sasa."}
        </p>

        {narrator ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-background/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Narrator profile
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{narrator.name}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {narrator.description}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Accent: {narrator.accent} • Style: {narrator.style}
            </p>
          </div>
        ) : null}
      </section>

      <section className="mb-12">
        {narrationUrl ? (
          <StoryCinematicPlayer
            narrationUrl={narrationUrl}
            scenes={scenes}
            posterUrl={posterUrl}
          />
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-8 text-slate-300">
            Audio ya simulizi hili bado haijawekwa. Unaweza kuendelea kusoma summary,
            timeline, na sources huku ukisubiri narration iongezwe.
          </div>
        )}
      </section>

      <section className="mb-12 rounded-[2rem] border border-white/10 bg-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
          Story gallery
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.length > 0 ? (
            galleryImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-background"
              >
                <img
                  src={image}
                  alt={`Story gallery ${index + 1}`}
                  className="h-72 w-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-slate-400 md:col-span-2 xl:col-span-3">
              Hakuna gallery images bado.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Story summary
            </p>
            <div className="mt-4 space-y-4 text-slate-300">
              <p>{story.story_summary || story.short_description || "Hakuna summary kwa sasa."}</p>
              {story.full_story_text ? (
                <p className="whitespace-pre-line leading-8">{story.full_story_text}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Timeline
            </p>
            <div className="mt-6 space-y-4">
              {timeline.length > 0 ? (
                timeline.map((item, index) => (
                  <div
                    key={item.id || `${item.title}-${index}`}
                    className="rounded-2xl border border-white/10 bg-background/50 p-5"
                  >
                    <p className="text-sm text-platinumGold">
                      {item.event_date || `Step ${index + 1}`}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-2 text-slate-300">{item.description}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-slate-400">
                  Hakuna timeline bado.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Sources
            </p>
            <div className="mt-6 space-y-4">
              {sources.length > 0 ? (
                sources.map((source, index) => (
                  <div
                    key={source.id || `${source.source_title}-${index}`}
                    className="rounded-2xl border border-white/10 bg-background/50 p-5"
                  >
                    <h3 className="text-lg font-semibold text-white">{source.source_title}</h3>
                    {source.publisher ? (
                      <p className="mt-1 text-sm text-slate-400">{source.publisher}</p>
                    ) : null}
                    {source.notes ? (
                      <p className="mt-3 text-slate-300">{source.notes}</p>
                    ) : null}
                    {source.source_url ? (
                      <a
                        href={source.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-sm font-semibold text-platinumGold hover:underline"
                      >
                        Open source
                      </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-slate-400">
                  Hakuna sources bado.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-card p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Related stories
            </p>
            <div className="mt-6 space-y-4">
              {relatedStories.length > 0 ? (
                relatedStories.map((item, index) => (
                  <Link
                    key={item.id || item.slug || `related-${index}`}
                    href={`/stories/${item.slug}`}
                    className="block rounded-2xl border border-white/10 bg-background/50 p-5 transition hover:border-platinumGold/40"
                  >
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {item.short_description || item.story_summary || "Related story"}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-slate-400">
                  Hakuna related stories kwa sasa.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}