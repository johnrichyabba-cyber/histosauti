import { notFound } from "next/navigation";
import StoryModeExperience from "@/components/story-mode-experience";
import { getStoryMediaConfigBySlug } from "@/lib/media-manager";
import { getStoryBySlug } from "@/lib/stories";

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const mediaConfig = await getStoryMediaConfigBySlug(story.slug);
  const narrationUrl = mediaConfig?.narration_url || story.audioUrl || "";
  const posterUrl = mediaConfig?.cover_image_url || story.coverImage || null;
  const scenes = mediaConfig?.scenes || [];
  const galleryImages = mediaConfig?.gallery_images || [];
  const nextStory = story.relatedStories?.[0]
    ? {
        slug: story.relatedStories[0].slug,
        title: story.relatedStories[0].title,
        category: story.relatedStories[0].category,
        duration: story.relatedStories[0].duration,
        coverImage: story.relatedStories[0].coverImage,
      }
    : null;

  return (
    <section className="py-16">
      <div className="container space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">{story.category}</span>
            {story.publishedAt ? (
              <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                {new Date(story.publishedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ) : null}
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{story.duration}</span>
            {scenes.length > 0 ? (
              <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                {scenes.length} chapter{scenes.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">{story.title}</h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{story.summary}</p>
        </section>

        <StoryModeExperience
          story={{
            slug: story.slug,
            title: story.title,
            category: story.category,
            duration: story.duration,
            summary: story.summary,
            shortDescription: story.shortDescription,
            fullStoryText: story.fullStoryText,
            subtitleUrl: story.subtitleUrl,
            subtitleLanguage: story.subtitleLanguage,
            publishedAt: story.publishedAt,
          }}
          narrationUrl={narrationUrl}
          posterUrl={posterUrl}
          scenes={scenes}
          galleryImages={galleryImages}
          sources={story.sources}
          timeline={story.timeline}
          relatedStories={story.relatedStories}
          nextStory={nextStory}
        />
      </div>
    </section>
  );
}
