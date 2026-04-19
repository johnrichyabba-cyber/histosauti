"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SubtitleCue = {
  id: string;
  start: number;
  end: number;
  text: string;
};

type StorySubtitlePlayerProps = {
  title: string;
  category: string;
  summary: string;
  duration: string;
  audioLanguage: string;
  subtitleLanguage: string;
  audioUrl?: string;
  subtitleUrl?: string;
};

const subtitleFallback: SubtitleCue[] = [
  {
    id: "fallback-1",
    start: 0,
    end: 6,
    text: "This story begins with a real event that shook the world and changed history forever."
  },
  {
    id: "fallback-2",
    start: 6,
    end: 12,
    text: "As the Swahili narration plays, English subtitles will appear here line by line."
  },
  {
    id: "fallback-3",
    start: 12,
    end: 20,
    text: "Upload a valid VTT subtitle file to see fully synchronized subtitle timing in this panel."
  }
];

function parseTimestamp(value: string) {
  const cleaned = value.trim().replace(",", ".");
  const parts = cleaned.split(":");

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Number(minutes) * 60 + Number(seconds);
  }

  return Number(cleaned);
}

function parseVtt(content: string): SubtitleCue[] {
  const normalized = content.replace(/\r/g, "").trim();
  const blocks = normalized.split(/\n\n+/);
  const cues: SubtitleCue[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0 || lines[0] === "WEBVTT") {
      continue;
    }

    let cursor = 0;
    let cueId = "";

    if (!lines[cursor].includes("-->")) {
      cueId = lines[cursor];
      cursor += 1;
    }

    const timeLine = lines[cursor];

    if (!timeLine || !timeLine.includes("-->")) {
      continue;
    }

    const [startRaw, endRawWithSettings] = timeLine.split("-->");
    const endRaw = endRawWithSettings.trim().split(/\s+/)[0];
    const text = lines.slice(cursor + 1).join(" ").trim();

    if (!text) {
      continue;
    }

    cues.push({
      id: cueId || `cue-${cues.length + 1}`,
      start: parseTimestamp(startRaw),
      end: parseTimestamp(endRaw),
      text
    });
  }

  return cues;
}

export function StorySubtitlePlayer({
  title,
  category,
  summary,
  duration,
  audioLanguage,
  subtitleLanguage,
  audioUrl,
  subtitleUrl
}: StorySubtitlePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeCueRef = useRef<HTMLDivElement | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>(subtitleFallback);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitleStatus, setSubtitleStatus] = useState<"idle" | "loading" | "ready" | "missing" | "error">(
    subtitleUrl ? "loading" : "missing"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSubtitles() {
      if (!subtitleUrl) {
        if (isMounted) {
          setCues(subtitleFallback);
          setSubtitleStatus("missing");
        }
        return;
      }

      try {
        setSubtitleStatus("loading");
        const response = await fetch(subtitleUrl, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch subtitle file");
        }

        const text = await response.text();
        const parsed = parseVtt(text);

        if (!isMounted) {
          return;
        }

        if (parsed.length === 0) {
          setCues(subtitleFallback);
          setSubtitleStatus("error");
          return;
        }

        setCues(parsed);
        setSubtitleStatus("ready");
      } catch {
        if (!isMounted) {
          return;
        }
        setCues(subtitleFallback);
        setSubtitleStatus("error");
      }
    }

    loadSubtitles();

    return () => {
      isMounted = false;
    };
  }, [subtitleUrl]);

  const activeCueIndex = useMemo(() => {
    return cues.findIndex((cue) => currentTime >= cue.start && currentTime <= cue.end);
  }, [cues, currentTime]);

  useEffect(() => {
    if (activeCueRef.current) {
      activeCueRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeCueIndex]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleSeeked = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const subtitleMessage =
    subtitleStatus === "loading"
      ? "Loading English subtitles..."
      : subtitleStatus === "ready"
        ? "Subtitles are synced live with the Swahili narration."
        : subtitleStatus === "error"
          ? "Subtitle file could not be parsed. Fallback preview text is showing for now."
          : "No subtitle file has been uploaded yet. Fallback preview text is showing for now.";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-gold">{category}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{summary}</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">{duration}</span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">{audioLanguage} audio</span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">{subtitleLanguage} subtitles</span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <audio ref={audioRef} controls className="w-full">
              {audioUrl ? <source src={audioUrl} type="audio/mpeg" /> : null}
              {subtitleUrl ? <track src={subtitleUrl} kind="subtitles" srcLang="en" label="English" default /> : null}
            </audio>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Narration</p>
              <p className="mt-2 text-sm font-semibold text-white">{audioLanguage}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Subtitles</p>
              <p className="mt-2 text-sm font-semibold text-white">{subtitleLanguage}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Playback status</p>
              <p className="mt-2 text-sm font-semibold text-white">{audioUrl ? "Ready to play" : "Awaiting audio upload"}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {audioUrl
              ? "Play the narration to watch English subtitle lines highlight automatically in the panel on the right."
              : "Upload a Swahili narration audio file to activate the full listening experience on this page."}
          </p>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">English Subtitles</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{subtitleMessage}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
            {Math.max(0, Math.floor(currentTime))}s
          </div>
        </div>

        <div className="mt-6 max-h-[32rem] space-y-3 overflow-y-auto pr-2">
          {cues.map((cue, index) => {
            const isActive = index === activeCueIndex;

            return (
              <div
                key={`${cue.id}-${index}`}
                ref={isActive ? activeCueRef : null}
                className={
                  isActive
                    ? "rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-white shadow-[0_0_0_1px_rgba(245,158,11,0.08)]"
                    : "rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300"
                }
              >
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {cue.start.toFixed(0)}s - {cue.end.toFixed(0)}s
                </div>
                <p>{cue.text}</p>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
