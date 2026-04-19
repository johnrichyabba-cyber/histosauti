import Link from "next/link";
import { Headphones, PlayCircle, Sparkles, Volume2 } from "lucide-react";
import type { StoryRecord } from "@/lib/types";

export function HeroSection({ featuredStory }: { featuredStory: StoryRecord }) {
  return (
    <section className="bg-hero bg-cover bg-center">
      <div className="container grid min-h-[84vh] items-center gap-10 py-20 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-platnumGold/35 bg-platnumGold/10 px-4 py-2 text-sm text-platnumGold">
            <Sparkles className="h-4 w-4" />
            HistoSauti • True Stories • Kiswahili Narration
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Historia ya kweli, ikisimuliwa kwa sauti yenye mvuto.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            HistoSauti ni portal ya documentary storytelling inayokuletea matukio halisi yaliyotikisa dunia, kwa masimulizi ya Kiswahili na subtitle za Kiingereza.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/stories" className="inline-flex items-center gap-2 rounded-full bg-platnumGold px-6 py-3 font-semibold text-slate-950 shadow-glow">
              <PlayCircle className="h-5 w-5" />
              Anza Kusikiliza
            </Link>
            <Link href="/#featured" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-platnumGold/60 hover:text-platnumGold">
              Tazama Featured Story
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="glass-panel platinum-ring rounded-2xl p-4">
              <p className="text-sm text-slate-400">Narration</p>
              <p className="mt-2 font-semibold text-white">Kiswahili sanifu</p>
            </div>
            <div className="glass-panel platinum-ring rounded-2xl p-4">
              <p className="text-sm text-slate-400">Subtitles</p>
              <p className="mt-2 font-semibold text-white">English live sync</p>
            </div>
            <div className="glass-panel platinum-ring rounded-2xl p-4">
              <p className="text-sm text-slate-400">Tone</p>
              <p className="mt-2 font-semibold text-white">Cinematic documentary</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-platnumGold/15 px-3 py-1 text-xs font-medium text-platnumGold">Featured Story</span>
            <span className="text-sm text-slate-300">{featuredStory.duration}</span>
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">{featuredStory.title}</h2>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">{featuredStory.category}</p>
          <p className="mt-4 leading-7 text-slate-300">{featuredStory.shortDescription}</p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/85 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Narration preview</p>
                <p className="font-semibold text-white">Kiswahili yenye hisia za tukio</p>
              </div>
              <Volume2 className="h-5 w-5 text-platnumGold" />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 rounded-full bg-platnumGold" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Headphones className="mt-0.5 h-5 w-5 text-platnumGold" />
              <div>
                <p className="text-sm font-semibold text-white">Audio Experience</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Storytelling yenye pacing na mood ya documentary.</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Subtitle Mode</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">English subtitle panel inayofuatilia audio live.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
