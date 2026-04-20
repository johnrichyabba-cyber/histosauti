import { getLatestStories } from "@/lib/stories";
import StoryCard from "@/components/home/story-card";

export default async function StoriesPage() {
  const stories = await getLatestStories(24);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
          Stories
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Simulizi zote za HistoSauti
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Chunguza true stories zetu zote kwa Kiswahili, zikiwa na cinematic
          presentation, subtitles, audio, na documentary-style experience.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <StoryCard
              key={story.id || story.slug || `story-${index}`}
              story={{
                id: story.id,
                slug: story.slug,
                title: story.title,
                short_description: story.short_description,
                story_summary: story.story_summary,
                duration_seconds: story.duration_seconds,
                status: story.status,
                cover_image_url: (story as any).cover_image_url ?? null,
                featured_image: (story as any).featured_image ?? null,
                published_at: story.published_at,
                category_name: (story as any).category_name ?? null,
              }}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-card p-8 text-slate-400 md:col-span-2 xl:col-span-3">
            Hakuna stories bado. Ukishaongeza simulizi kupitia admin studio,
            zitaonekana hapa.
          </div>
        )}
      </section>
    </main>
  );
}