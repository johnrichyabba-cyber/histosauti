import Link from "next/link";
import { getCategories, getFeaturedStory, getLatestStories } from "@/lib/stories";

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds <= 0) return "12 min";
  return `${Math.max(1, Math.round(durationSeconds / 60))} min`;
}

export default async function HomePage() {
  const featuredStory = await getFeaturedStory();
  const latestStories = await getLatestStories(6);
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
          <div className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-white/90">
            ✦ HistoSauti • True Stories • Kiswahili Narration
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] md:text-7xl">
            Historia ya kweli,
            <br />
            ikisimuliwa kwa
            <br />
            sauti yenye mvuto.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            HistoSauti ni portal ya documentary storytelling inayokuleta matukio
            halisi yaliyotikisa dunia, kwa masimulizi ya Kiswahili na subtitle za
            Kiingereza.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={featuredStory ? `/stories/${featuredStory.slug}` : "/stories"}
              className="rounded-full bg-platinumGold px-8 py-4 text-lg font-semibold text-black transition hover:scale-[1.02]"
            >
              ▶ Sikiliza Story ya Kwanza
            </Link>

            <Link
              href="/stories"
              className="rounded-full border border-white/10 px-8 py-4 text-lg font-semibold text-white transition hover:border-platinumGold/30 hover:text-platinumGold"
            >
              Tazama Stories Zote
            </Link>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
          <div className="flex items-center justify-between">
            <p className="text-4xl text-white">Featured Story</p>
            <span className="text-4xl text-slate-200">
              {formatDuration(featuredStory?.duration_seconds)}
            </span>
          </div>

          <h2 className="mt-12 text-6xl font-bold leading-tight">
            {featuredStory?.title || "Karibu HistoSauti"}
          </h2>

          <p className="mt-8 text-xs uppercase tracking-[0.4em] text-slate-400">
            History
          </p>

          <p className="mt-8 text-2xl leading-[1.8] text-slate-200">
            {featuredStory?.short_description ||
              "Sikiliza simulizi za matukio ya kweli ya kihistoria kwa Kiswahili, zikiwa na subtitle za Kiingereza na muonekano wa documentary ya kisasa."}
          </p>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-background/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-2xl text-white">Narration preview</p>
              <span className="text-3xl">🔊</span>
            </div>

            <p className="mt-6 text-4xl font-bold leading-tight">
              Kiswahili cha Afrika Mashariki
            </p>

            <p className="mt-4 text-lg text-slate-300">
              Bonyeza story yoyote kisha Play. Kama hakuna narration mp3 bado,
              engine itatumia browser voice fallback.
            </p>

            <div className="mt-8">
              <Link
                href={featuredStory ? `/stories/${featuredStory.slug}` : "/stories"}
                className="inline-flex rounded-full bg-platinumGold px-7 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Fungua featured story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-platinumGold">
            Narration
          </p>
          <h3 className="mt-4 text-2xl font-bold">East Africa voice mode</h3>
          <p className="mt-4 text-slate-300">
            Mfumo unapendelea sauti za Kiswahili za Kenya/Tanzania kabla ya fallback nyingine.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-platinumGold">
            Subtitles
          </p>
          <h3 className="mt-4 text-2xl font-bold">Live scene subtitles</h3>
          <p className="mt-4 text-slate-300">
            Kila story inaweza kuonyesha scene subtitle kwa mtiririko wa documentary.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-platinumGold">
            Story studio
          </p>
          <h3 className="mt-4 text-2xl font-bold">Tayari kwa production</h3>
          <p className="mt-4 text-slate-300">
            Unaweza kuongeza image, audio, scenes, soundtrack, na details za story moja kwa moja.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
              Latest stories
            </p>
            <h2 className="mt-3 text-3xl font-bold">Chagua story ya kusikiliza</h2>
          </div>

          <Link
            href="/stories"
            className="text-sm font-semibold text-platinumGold hover:underline"
          >
            Tazama zote
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestStories.map((story, index) => (
            <Link
              key={story.id || story.slug || `home-story-${index}`}
              href={`/stories/${story.slug}`}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-card transition hover:-translate-y-1 hover:border-platinumGold/30"
            >
              <div className="aspect-[16/10] overflow-hidden bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    story.cover_image_url ||
                    story.featured_image ||
                    "/images/placeholders/story-cover.jpg"
                  }
                  alt={story.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-platinumGold/10 px-3 py-1 text-sm text-platinumGold">
                    {story.category_name || "Story"}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatDuration(story.duration_seconds)}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold">{story.title}</h3>

                <p className="mt-4 line-clamp-4 text-slate-300">
                  {story.short_description || story.story_summary}
                </p>

                <div className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white">
                  Fungua na play →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
              Categories
            </p>
            <h2 className="mt-3 text-3xl font-bold">Explore by category</h2>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-platinumGold hover:underline"
          >
            Fungua categories
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id || `category-${index}`}
              href={`/categories`}
              className="rounded-[1.5rem] border border-white/10 bg-card p-5 transition hover:border-platinumGold/30"
            >
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="mt-2 text-slate-300">
                {category.story_count} stories
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}