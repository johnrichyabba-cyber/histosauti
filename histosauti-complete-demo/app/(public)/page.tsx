import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { CategoryGrid } from "@/components/home/category-grid";
import { HeroSection } from "@/components/home/hero-section";
import { Newsletter } from "@/components/home/newsletter";
import { SectionHeader } from "@/components/home/section-header";
import { StoryCard } from "@/components/home/story-card";
import { getCategories, getFeaturedStory, getPublishedStories } from "@/lib/stories";

export default async function HomePage() {
  const [allStories, featuredStory, categories] = await Promise.all([
    getPublishedStories(),
    getFeaturedStory(),
    getCategories()
  ]);

  const latestStories = allStories.slice(0, 3);
  const trendingStories = [featuredStory, ...allStories.filter((story) => story.slug !== featuredStory.slug)].slice(0, 4);
  const stats = {
    stories: allStories.length,
    categories: categories.length,
    subtitles: allStories.filter((story) => story.subtitleLanguage).length
  };

  return (
    <>
      <HeroSection featuredStory={featuredStory} />

      <section className="-mt-10 pb-8">
        <div className="container grid gap-4 md:grid-cols-3">
          <div className="glass-panel platinum-ring rounded-[1.5rem] p-5">
            <p className="text-sm text-slate-400">Stories zilizopo</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.stories}</p>
            <p className="mt-2 text-sm text-slate-300">Simulizi za kweli tayari kwa kusikilizwa.</p>
          </div>
          <div className="glass-panel platinum-ring rounded-[1.5rem] p-5">
            <p className="text-sm text-slate-400">Makundi</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.categories}</p>
            <p className="mt-2 text-sm text-slate-300">Kategoria kuu za matukio ya kihistoria na true stories.</p>
          </div>
          <div className="glass-panel platinum-ring rounded-[1.5rem] p-5">
            <p className="text-sm text-slate-400">Subtitle support</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.subtitles}</p>
            <p className="mt-2 text-sm text-slate-300">Stories zenye English subtitle kwa audience pana zaidi.</p>
          </div>
        </div>
      </section>

      <section id="featured" className="py-16">
        <div className="container grid gap-8 rounded-[2rem] border border-white/10 bg-card bg-platinumGlow p-8 shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader eyebrow="Featured Story" title={featuredStory.title} description={featuredStory.summary} />
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-platnumGold/15 px-3 py-1 text-sm text-platnumGold">{featuredStory.category}</span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">{featuredStory.duration}</span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">
                {featuredStory.audioLanguage} audio • {featuredStory.subtitleLanguage} subtitles
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/stories/${featuredStory.slug}`} className="rounded-full bg-platnumGold px-5 py-3 font-semibold text-slate-950 shadow-glow">
                Fungua story hii
              </Link>
              <Link href="/stories" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-platnumGold/50 hover:text-platnumGold">
                Archive ya stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-platnumGold">
              <Sparkles className="h-4 w-4" />
              Teaser ya wiki hii
            </div>
            <p className="mt-4 text-lg leading-8 text-slate-200">{featuredStory.shortDescription}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 rounded-full bg-platnumGold" />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Hii ndiyo stori tunayoitumia kuonyesha kiwango cha HistoSauti: narrative ya Kiswahili, subtitle za Kiingereza, timeline, sources, na presentation ya premium.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <SectionHeader
            eyebrow="Latest"
            title="Stori Mpya"
            description="Hizi ni simulizi mpya zaidi kwenye HistoSauti, tayari kwa kusikilizwa kwa style ya cinematic documentary."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <CategoryGrid categories={categories} stories={allStories} />

      <section id="trending" className="py-16">
        <div className="container">
          <SectionHeader
            eyebrow="Trending"
            title="Inayosikilizwa Sasa"
            description="Sehemu ya stories zinazovutia zaidi kwenye homepage. Baadaye unaweza kuiunganisha na analytics halisi ya listens, completion rate, au bookmarks."
          />
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {trendingStories.slice(0, 2).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
              <div className="inline-flex items-center gap-2 rounded-full bg-platnumGold/10 px-3 py-1 text-sm text-platnumGold">
                <TrendingUp className="h-4 w-4" />
                Trending Notes
              </div>
              <h3 className="mt-5 text-2xl font-bold text-white">Muonekano wa premium kwa portal yako</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                HistoSauti sasa ina msingi wa homepage unaobeba brand ya documentary portal: featured block, latest stories, category intelligence, trending section, na PlatnumGold accent inayotoa premium identity.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">Featured story ina CTA ya moja kwa moja kwenda kusikiliza.</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">Categories sasa yanaweza kuonyesha count ya stories live.</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">Trending section iko tayari kuunganishwa na analytics halisi baadaye.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-6 rounded-[2rem] border border-white/10 bg-card bg-platinumGlow p-8 shadow-glow md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-white">Narration ya Kiswahili</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Masimulizi yenye hisia, pacing nzuri, na tone inayoendana na uzito wa tukio.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">English Subtitles</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Subtitle live kwa wasikilizaji wa kimataifa na urahisi wa kufuatilia simulizi.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Verified Documentary Feel</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Kila story inaweza kubeba sources, timeline, na related stories kwa presentation ya kitaalamu.</p>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
