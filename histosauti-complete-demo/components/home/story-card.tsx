import Image from "next/image";
import Link from "next/link";
import { Clock3, Play } from "lucide-react";
import type { StoryRecord } from "@/lib/types";

export function StoryCard({ story }: { story: StoryRecord }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:border-platnumGold/25 hover:shadow-glow"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-platnumGold/30 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-platnumGold backdrop-blur">
          {story.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>{story.audioLanguage}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {story.duration}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">{story.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{story.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full bg-platnumGold/10 px-3 py-1 text-xs text-platnumGold">{story.subtitleLanguage} subtitles</span>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-platnumGold">
            <Play className="h-4 w-4" />
            Play Story
          </div>
        </div>
      </div>
    </Link>
  );
}
