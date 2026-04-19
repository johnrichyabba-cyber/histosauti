"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StoryCinematicPlayer from "@/components/story-cinematic-player";
import type { ManagedScene } from "@/lib/media-manager";
import type { StoryRecord, StorySourceRecord, StoryTimelineEventRecord } from "@/lib/types";

type Props = {
  story: {
    slug: string;
    title: string;
    category: string;
    duration: string;
    summary: string;
    shortDescription: string;
    fullStoryText?: string;
    subtitleUrl?: string;
    subtitleLanguage?: string;
    publishedAt?: string | null;
  };
  narrationUrl?: string | null;
  posterUrl?: string | null;
  scenes: ManagedScene[];
  galleryImages: string[];
  sources: StorySourceRecord[];
  timeline: StoryTimelineEventRecord[];
  relatedStories: StoryRecord[];
  nextStory?: {
    slug: string;
    title: string;
    category?: string;
    duration?: string;
    coverImage?: string;
  } | null;
};

type Mode = "story" | "evidence";

function buildQuoteCards(
  summary: string,
  timeline: StoryTimelineEventRecord[],
  sources: StorySourceRecord[],
  scenes: ManagedScene[],
) {
  const quotes: Array<{ label: string; text: string }> = [];

  if (timeline[0]?.description) {
    quotes.push({ label: timeline[0].yearLabel || "Context", text: timeline[0].description });
  }
  if (scenes[0]?.caption) {
    quotes.push({ label: "Scene note", text: scenes[0].caption });
  }
  if (sources[0]?.notes) {
    quotes.push({ label: sources[0].publisher || "Reference", text: sources[0].notes });
  }
  if (quotes.length < 3 && summary) {
    quotes.push({ label: "Story note", text: summary });
  }

  return quotes.slice(0, 3);
}

export default function StoryModeExperience({
  story,
  narrationUrl,
  posterUrl,
  scenes,
  galleryImages,
  sources,
  timeline,
  relatedStories,
  nextStory,
}: Props) {
  const [mode, setMode] = useState<Mode>("story");

  const evidenceFacts = useMemo(
    () => [
      { label: "Published", value: story.publishedAt ? new Date(story.publishedAt).toLocaleDateString("en-GB") : "Unknown" },
      { label: "Duration", value: story.duration },
      { label: "Scenes", value: String(scenes.length || 0) },
      { label: "Gallery", value: String(galleryImages.length || 0) },
      { label: "Sources", value: String(sources.length || 0) },
      { label: "Timeline points", value: String(timeline.length || 0) },
      { label: "Subtitles", value: story.subtitleLanguage || "English" },
      { label: "Category", value: story.category },
    ],
    [story, scenes.length, galleryImages.length, sources.length, timeline.length],
  );

  const quoteCards = useMemo(
    () => buildQuoteCards(story.summary, timeline, sources, scenes),
    [story.summary, timeline, sources, scenes],
  );

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-card p-5 shadow-soft md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">Experience mode</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Choose how to explore this story</h2>
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setMode("story")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === "story" ? "bg-gold text-black" : "text-slate-300"
              }`}
            >
              Story Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("evidence")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === "evidence" ? "bg-gold text-black" : "text-slate-300"
              }`}
            >
              Evidence Mode
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
          Story Mode inaleta cinematic listening experience. Evidence Mode inaleta chronology, sources,
          facts, na quote cards ili mtumiaji aweze kuthibitisha simulizi kwa urahisi.
        </p>
      </section>

      {mode === "story" ? (
        <div className="space-y-10">
          <StoryCinematicPlayer
            storyKey={story.slug}
            storyTitle={story.title}
            narrationUrl={narrationUrl}
            subtitleUrl={story.subtitleUrl || undefined}
            subtitleLanguage={story.subtitleLanguage || "English"}
            storyText={story.fullStoryText || story.summary || story.shortDescription}
            scenes={scenes}
            posterUrl={posterUrl}
            nextStory={nextStory}
          />

          {scenes.length > 0 ? (
            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gold">Chapter guide</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Fuata simulizi kwa sura</h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-400">
                  Kila chapter ina visual, mazingira ya sauti, na point yake ya kihistoria ili simulizi lisibaki kuwa sauti peke yake.
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {scenes.map((scene, index) => (
                  <div key={`${story.slug}-chapter-${scene.id}`} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60">
                    {scene.image_url ? (
                      <div className="h-44 overflow-hidden bg-background">
                        <img src={scene.image_url} alt={scene.title} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold">Chapter {index + 1}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{scene.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {Math.floor(scene.start_time_seconds / 60)}:{String(scene.start_time_seconds % 60).padStart(2, "0")} - {Math.floor(scene.end_time_seconds / 60)}:{String(scene.end_time_seconds % 60).padStart(2, "0")}
                      </p>
                      {scene.caption ? <p className="mt-3 text-sm leading-6 text-slate-300">{scene.caption}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-gold">Story gallery</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.length > 0 ? (
                galleryImages.map((image, index) => (
                  <div key={`${story.slug}-gallery-${index}`} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
                    <img src={image} alt={`${story.title} visual ${index + 1}`} className="h-72 w-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400 md:col-span-2 xl:col-span-3">
                  Hakuna gallery images bado kwa simulizi hili.
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Story Overview</p>
              <p className="mt-4 text-base leading-8 text-slate-300">{story.shortDescription}</p>
              <p className="mt-4 text-base leading-8 text-slate-300">{story.summary}</p>
              {story.fullStoryText ? (
                <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-gold">Narrative Context</p>
                  <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-300">{story.fullStoryText}</p>
                </div>
              ) : null}
            </article>

            <aside className="space-y-8">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft">
                <p className="text-sm uppercase tracking-[0.25em] text-gold">Related stories</p>
                <div className="mt-6 space-y-4">
                  {relatedStories.length > 0 ? (
                    relatedStories.map((item, index) => (
                      <Link key={item.id || item.slug || `related-${index}`} href={`/stories/${item.slug}`} className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-gold/40">
                        <h3 className="text-base font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.shortDescription || item.summary || "Related story"}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-400">
                      Hakuna related stories kwa sasa.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <aside className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Evidence facts</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {evidenceFacts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{fact.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{fact.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Quote cards</p>
              <div className="mt-6 space-y-4">
                {quoteCards.map((quote, index) => (
                  <blockquote key={`${quote.label}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-gold">{quote.label}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">“{quote.text}”</p>
                  </blockquote>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Verified Sources</p>
              <div className="mt-6 space-y-4">
                {sources.length > 0 ? (
                  sources.map((source, index) => (
                    <div key={source.id || `${story.slug}-source-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <h3 className="text-base font-semibold text-white">{source.title}</h3>
                      {source.publisher ? <p className="mt-2 text-sm text-slate-400">{source.publisher}</p> : null}
                      {source.notes ? <p className="mt-3 text-sm leading-6 text-slate-300">{source.notes}</p> : null}
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-gold transition hover:text-amber-300">
                          Open source
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-400">
                    No sources have been attached to this story yet.
                  </div>
                )}
              </div>
            </section>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Timeline evidence</p>
              <div className="mt-8 space-y-6">
                {timeline.length > 0 ? (
                  timeline.map((event, index) => (
                    <div key={event.id || `${story.slug}-timeline-${index}`} className="relative pl-8">
                      <div className="absolute left-0 top-1 h-full w-px bg-white/10" />
                      <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-gold" />
                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gold">{event.yearLabel}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{event.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-5 text-sm leading-6 text-slate-400">
                    No timeline has been added yet.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gold">Evidence interpretation</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">How this story is supported</h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm font-semibold text-white">Chronology</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Timeline points show the order of events so the listener can distinguish verified sequence from cinematic pacing.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm font-semibold text-white">Source confidence</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Sources and archive notes show where the story draws its facts, helping HistoSauti remain educational and trustworthy.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:col-span-2">
                  <p className="text-sm font-semibold text-white">Storytelling note</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Story Mode is built for immersion. Evidence Mode is built for verification. Together, they make each simulizi more engaging without losing historical grounding.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
