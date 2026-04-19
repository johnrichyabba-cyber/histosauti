"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ManagedScene } from "@/lib/media-manager";

type Props = {
  storyKey: string;
  storyTitle: string;
  narrationUrl?: string | null;
  subtitleUrl?: string | null;
  subtitleLanguage?: string | null;
  storyText?: string | null;
  scenes: ManagedScene[];
  posterUrl?: string | null;
  nextStory?: {
    slug: string;
    title: string;
    category?: string;
    duration?: string;
    coverImage?: string;
  } | null;
};

type SpeechState = "idle" | "playing" | "paused";

type SubtitleCue = {
  id: string;
  start: number;
  end: number;
  text: string;
};

const AUTO_NEXT_STORAGE_KEY = "histosauti-auto-next-enabled";
const PROGRESS_STORAGE_PREFIX = "histosauti-progress:";

function chunkText(text: string, count: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [] as string[];
  if (count <= 1) return [words.join(" ")];
  const chunkSize = Math.ceil(words.length / count);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

function parseTimestamp(value: string) {
  const cleaned = value.trim().replace(",", ".");
  const parts = cleaned.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(cleaned);
}

function parseVtt(content: string): SubtitleCue[] {
  const normalized = content.replace(/\r/g, "").trim();
  if (!normalized) return [];
  const blocks = normalized.split(/\n\n+/);
  const cues: SubtitleCue[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length || lines[0] === "WEBVTT") continue;

    let cursor = 0;
    let cueId = "";

    if (!lines[cursor].includes("-->")) {
      cueId = lines[cursor];
      cursor += 1;
    }

    const timeLine = lines[cursor];
    if (!timeLine || !timeLine.includes("-->")) continue;

    const [startRaw, endRawWithSettings] = timeLine.split("-->");
    const endRaw = endRawWithSettings.trim().split(/\s+/)[0];
    const text = lines.slice(cursor + 1).join(" ").trim();
    if (!text) continue;

    cues.push({
      id: cueId || `cue-${cues.length + 1}`,
      start: parseTimestamp(startRaw),
      end: parseTimestamp(endRaw),
      text,
    });
  }

  return cues;
}

function buildFallbackCues(
  storyText: string | null | undefined,
  scenes: ManagedScene[],
  duration: number,
) {
  const source = storyText?.trim() || "";
  if (!source) return [] as SubtitleCue[];

  if (scenes.length > 0) {
    const chunks = chunkText(source, scenes.length);
    return scenes.map((scene, index) => ({
      id: scene.id || `scene-cue-${index + 1}`,
      start: scene.start_time_seconds,
      end: scene.end_time_seconds,
      text: chunks[index] || chunks[chunks.length - 1] || source,
    }));
  }

  const chunks = chunkText(source, 4);
  const safeDuration = Math.max(duration || 60, 60);
  const segment = safeDuration / Math.max(chunks.length, 1);
  return chunks.map((text, index) => ({
    id: `fallback-${index + 1}`,
    start: index * segment,
    end: index === chunks.length - 1 ? safeDuration : (index + 1) * segment,
    text,
  }));
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function StoryCinematicPlayer({
  storyKey,
  storyTitle,
  narrationUrl,
  subtitleUrl,
  subtitleLanguage,
  storyText,
  scenes,
  posterUrl,
  nextStory,
}: Props) {
  const router = useRouter();
  const playerShellRef = useRef<HTMLDivElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const ambienceRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeCueRef = useRef<HTMLDivElement | null>(null);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [ambienceVolume, setAmbienceVolume] = useState(0.16);
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [narrationVolume, setNarrationVolume] = useState(1);
  const [subtitleStatus, setSubtitleStatus] = useState<"loading" | "ready" | "fallback">(
    subtitleUrl ? "loading" : "fallback",
  );
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([]);
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState(8);
  const [autoNextEnabled, setAutoNextEnabled] = useState(true);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [showStickyMiniPlayer, setShowStickyMiniPlayer] = useState(false);

  const usingBrowserNarration = !narrationUrl && Boolean(storyText);
  const progressStorageKey = `${PROGRESS_STORAGE_PREFIX}${storyKey}`;

  const activeScene = useMemo(() => {
    if (!scenes.length) return null;
    return (
      scenes.find(
        (scene) =>
          currentTime >= scene.start_time_seconds &&
          currentTime <= scene.end_time_seconds,
      ) ?? scenes[0]
    );
  }, [currentTime, scenes]);

  const activeSceneIndex = useMemo(() => {
    if (!activeScene) return -1;
    return scenes.findIndex((scene) => scene.id === activeScene.id);
  }, [activeScene, scenes]);

  const activeCue = useMemo(() => {
    if (!subtitleCues.length) return null;
    return subtitleCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end) ?? null;
  }, [currentTime, subtitleCues]);

  const chapterMarkers = useMemo(() => {
    if (!scenes.length || !duration) return [] as Array<ManagedScene & { left: number; width: number }>;
    return scenes.map((scene) => {
      const safeEnd = Math.max(scene.end_time_seconds, scene.start_time_seconds + 1);
      const left = Math.max(0, Math.min(100, (scene.start_time_seconds / duration) * 100));
      const width = Math.max(
        2,
        Math.min(100 - left, ((safeEnd - scene.start_time_seconds) / duration) * 100),
      );
      return { ...scene, left, width };
    });
  }, [duration, scenes]);

  const progressPercent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  const hasResume = typeof resumeAt === "number" && resumeAt > 5 && (!duration || resumeAt < duration - 5);

  const cancelAutoNext = () => {
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setShowAutoNext(false);
    setAutoNextCountdown(8);
  };

  const triggerAutoNext = () => {
    if (!nextStory?.slug) return;
    cancelAutoNext();
    router.push(`/stories/${nextStory.slug}`);
  };

  const beginAutoNext = () => {
    if (!nextStory?.slug || !autoNextEnabled) return;
    cancelAutoNext();
    setShowAutoNext(true);
    setAutoNextCountdown(8);

    autoNextTimerRef.current = setInterval(() => {
      setAutoNextCountdown((prev) => {
        if (prev <= 1) {
          if (autoNextTimerRef.current) {
            clearInterval(autoNextTimerRef.current);
            autoNextTimerRef.current = null;
          }
          router.push(`/stories/${nextStory.slug}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AUTO_NEXT_STORAGE_KEY);
    if (stored === "true") setAutoNextEnabled(true);
    if (stored === "false") setAutoNextEnabled(false);

    const savedProgress = window.localStorage.getItem(progressStorageKey);
    if (savedProgress) {
      const parsed = Number(savedProgress);
      if (Number.isFinite(parsed) && parsed > 0) {
        setResumeAt(parsed);
      }
    }
  }, [progressStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AUTO_NEXT_STORAGE_KEY, String(autoNextEnabled));
  }, [autoNextEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (duration && currentTime >= duration - 2) {
      window.localStorage.removeItem(progressStorageKey);
      setResumeAt(null);
      return;
    }
    if (currentTime > 0) {
      window.localStorage.setItem(progressStorageKey, String(Math.floor(currentTime)));
      setResumeAt(currentTime);
    }
  }, [currentTime, duration, progressStorageKey]);

  useEffect(() => {
    if (activeCueRef.current) {
      activeCueRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeCue?.id]);

  useEffect(() => {
    const onScroll = () => {
      const shell = playerShellRef.current;
      if (!shell) return;
      const rect = shell.getBoundingClientRect();
      const shouldShow = rect.top < -120 && rect.bottom > 180;
      setShowStickyMiniPlayer(shouldShow);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const audio = narrationRef.current;
    if (!audio) return;
    audio.volume = narrationVolume;
  }, [narrationVolume]);

  useEffect(() => {
    const audio = ambienceRef.current;
    if (!audio) return;
    audio.volume = ambienceVolume;
  }, [ambienceVolume]);

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    const narration = narrationRef.current;
    if (!narration || usingBrowserNarration) return;

    const onTimeUpdate = () => setCurrentTime(narration.currentTime || 0);
    const onLoaded = () => setDuration(narration.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      ambienceRef.current?.pause();
      musicRef.current?.pause();
      beginAutoNext();
    };

    narration.addEventListener("timeupdate", onTimeUpdate);
    narration.addEventListener("loadedmetadata", onLoaded);
    narration.addEventListener("ended", onEnded);

    return () => {
      narration.removeEventListener("timeupdate", onTimeUpdate);
      narration.removeEventListener("loadedmetadata", onLoaded);
      narration.removeEventListener("ended", onEnded);
    };
  }, [usingBrowserNarration, nextStory?.slug, autoNextEnabled]);

  useEffect(() => {
    if (!usingBrowserNarration || !storyText) return;
    setDuration(Math.max(60, Math.ceil(storyText.split(/\s+/).filter(Boolean).length / 2.4)));
  }, [storyText, usingBrowserNarration]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (usingBrowserNarration && isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= duration) {
            setIsPlaying(false);
            setSpeechState("idle");
            ambienceRef.current?.pause();
            musicRef.current?.pause();
            if (typeof window !== "undefined") window.speechSynthesis.cancel();
            beginAutoNext();
            return duration;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [usingBrowserNarration, isPlaying, duration, nextStory?.slug, autoNextEnabled]);

  useEffect(() => {
    let cancelled = false;

    async function loadSubtitles() {
      if (subtitleUrl) {
        try {
          setSubtitleStatus("loading");
          const response = await fetch(subtitleUrl, { cache: "no-store" });
          if (!response.ok) throw new Error("subtitle fetch failed");
          const text = await response.text();
          const cues = parseVtt(text);
          if (!cancelled && cues.length > 0) {
            setSubtitleCues(cues);
            setSubtitleStatus("ready");
            return;
          }
        } catch {
          // fallback below
        }
      }

      if (!cancelled) {
        setSubtitleCues(buildFallbackCues(storyText, scenes, duration));
        setSubtitleStatus("fallback");
      }
    }

    loadSubtitles();
    return () => {
      cancelled = true;
    };
  }, [subtitleUrl, storyText, scenes, duration]);

  useEffect(() => {
    const ambience = ambienceRef.current;
    const music = musicRef.current;
    if (!activeScene) return;

    const nextAmbience = activeScene.ambience_url || "";
    const nextMusic = activeScene.music_url || "";

    if (ambience) {
      const currentSrc = ambience.getAttribute("src") || "";
      if (nextAmbience !== currentSrc) {
        if (nextAmbience) {
          ambience.src = nextAmbience;
          ambience.loop = true;
          ambience.load();
          if (isPlaying) ambience.play().catch(() => {});
        } else {
          ambience.pause();
          ambience.removeAttribute("src");
          ambience.load();
        }
      }
    }

    if (music) {
      const currentSrc = music.getAttribute("src") || "";
      if (nextMusic !== currentSrc) {
        if (nextMusic) {
          music.src = nextMusic;
          music.loop = true;
          music.load();
          if (isPlaying) music.play().catch(() => {});
        } else {
          music.pause();
          music.removeAttribute("src");
          music.load();
        }
      }
    }
  }, [activeScene, isPlaying]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (event.code === "Space") {
        event.preventDefault();
        void handlePlayPause();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSeek(Math.min(duration || 0, currentTime + 10));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSeek(Math.max(0, currentTime - 10));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentTime, duration, usingBrowserNarration, isPlaying, speechState]);

  useEffect(() => {
    return () => {
      cancelAutoNext();
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
    };
  }, []);

  const playSpeech = async () => {
    if (typeof window === "undefined" || !storyText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = "sw-TZ";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = narrationVolume;
    utterance.onend = () => {
      setSpeechState("idle");
      setIsPlaying(false);
      ambienceRef.current?.pause();
      musicRef.current?.pause();
      beginAutoNext();
    };
    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeechState("playing");
  };

  const handlePlayPause = async () => {
    cancelAutoNext();

    if (usingBrowserNarration) {
      if (speechState === "playing") {
        if (typeof window !== "undefined") window.speechSynthesis.pause();
        ambienceRef.current?.pause();
        musicRef.current?.pause();
        setSpeechState("paused");
        setIsPlaying(false);
        return;
      }

      if (speechState === "paused") {
        if (typeof window !== "undefined") window.speechSynthesis.resume();
        if (ambienceRef.current?.getAttribute("src")) ambienceRef.current.play().catch(() => {});
        if (musicRef.current?.getAttribute("src")) musicRef.current.play().catch(() => {});
        setSpeechState("playing");
        setIsPlaying(true);
        return;
      }

      await playSpeech();
      if (ambienceRef.current?.getAttribute("src")) ambienceRef.current.play().catch(() => {});
      if (musicRef.current?.getAttribute("src")) musicRef.current.play().catch(() => {});
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    const narration = narrationRef.current;
    if (!narration) return;

    if (isPlaying) {
      narration.pause();
      ambienceRef.current?.pause();
      musicRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    await narration.play().catch(() => {});
    if (ambienceRef.current?.getAttribute("src")) ambienceRef.current.play().catch(() => {});
    if (musicRef.current?.getAttribute("src")) musicRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleSeek = (value: number) => {
    cancelAutoNext();
    if (usingBrowserNarration) {
      setCurrentTime(value);
      return;
    }
    const narration = narrationRef.current;
    if (!narration) return;
    narration.currentTime = value;
    setCurrentTime(value);
  };

  const handleResume = () => {
    if (resumeAt == null) return;
    handleSeek(resumeAt);
  };

  const clearResume = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(progressStorageKey);
    }
    setResumeAt(null);
  };

  return (
    <>
      <div ref={playerShellRef} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-card">
          <div className="relative aspect-[16/9] bg-black">
            {activeScene?.image_url || posterUrl ? (
              <img
                src={activeScene?.image_url || posterUrl || ""}
                alt={activeScene?.title || "Story visual"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">Hakuna visual bado</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">Active scene</p>
              <h3 className="mt-2 text-3xl font-bold text-white">{activeScene?.title || "Scene ya simulizi"}</h3>
              {activeScene?.caption ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">{activeScene.caption}</p>
              ) : null}
              {scenes.length > 0 ? (
                <div className="mt-4 inline-flex rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-200 backdrop-blur">
                  Chapter {activeSceneIndex + 1} of {scenes.length}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-5 p-6">
            {hasResume ? (
              <div className="rounded-[1.5rem] border border-platinumGold/25 bg-platinumGold/10 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-platinumGold">Continue listening</p>
                    <h4 className="mt-2 text-lg font-semibold text-white">Endelea ulipoishia kwenye {storyTitle}</h4>
                    <p className="mt-2 text-sm text-slate-300">Ulikuwa umefika dakika ya {formatTime(resumeAt || 0)}.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleResume}
                      className="rounded-full bg-platinumGold px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={clearResume}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePlayPause}
                className="rounded-full bg-platinumGold px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90"
              >
                {isPlaying ? "Pause simulizi" : usingBrowserNarration ? "Play browser narration" : "Play simulizi"}
              </button>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
              {usingBrowserNarration ? (
                <div className="rounded-full border border-platinumGold/20 bg-platinumGold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-platinumGold">
                  Browser TTS mode
                </div>
              ) : null}
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                {subtitleStatus === "ready"
                  ? `${subtitleLanguage || "English"} subtitles synced`
                  : "Fallback subtitle sync"}
              </div>
              {nextStory ? (
                <button
                  type="button"
                  onClick={() => setAutoNextEnabled((prev) => !prev)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    autoNextEnabled
                      ? "border-platinumGold/25 bg-platinumGold/10 text-platinumGold"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  Auto-next {autoNextEnabled ? "ON" : "OFF"}
                </button>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>Playback progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="relative rounded-full bg-white/10 px-1 py-1.5">
                <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-platinumGold"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {chapterMarkers.map((scene) => (
                    <button
                      key={`marker-${scene.id}`}
                      type="button"
                      title={scene.title}
                      onClick={() => handleSeek(scene.start_time_seconds)}
                      className="absolute inset-y-0 rounded-full border border-white/15 bg-white/10 transition hover:bg-platinumGold/35"
                      style={{ left: `${scene.left}%`, width: `${scene.width}%` }}
                    />
                  ))}
                </div>
              </div>

              {chapterMarkers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {chapterMarkers.map((scene, index) => {
                    const isActive = activeScene?.id === scene.id;
                    return (
                      <button
                        key={`chip-${scene.id}`}
                        type="button"
                        onClick={() => handleSeek(scene.start_time_seconds)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          isActive
                            ? "border-platinumGold/50 bg-platinumGold/10 text-platinumGold"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        Chapter {index + 1}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-400">
                Shortcut keys: <span className="text-white">Space</span> play/pause, <span className="text-white">←</span> rewind 10s, <span className="text-white">→</span> forward 10s
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
                <p className="text-sm text-slate-400">Narration</p>
                <input type="range" min={0} max={1} step={0.01} value={narrationVolume} onChange={(e) => setNarrationVolume(Number(e.target.value))} className="mt-3 w-full" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
                <p className="text-sm text-slate-400">Ambience</p>
                <input type="range" min={0} max={1} step={0.01} value={ambienceVolume} onChange={(e) => setAmbienceVolume(Number(e.target.value))} className="mt-3 w-full" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
                <p className="text-sm text-slate-400">Music</p>
                <input type="range" min={0} max={1} step={0.01} value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} className="mt-3 w-full" />
              </div>
            </div>

            {activeCue ? (
              <div className="rounded-2xl border border-white/10 bg-background/40 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-platinumGold">Live subtitle</p>
                  <p className="text-xs text-slate-400">{activeScene?.title || "Current moment"}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-200">{activeCue.text}</p>
              </div>
            ) : null}

            {showAutoNext && nextStory ? (
              <div className="rounded-[1.5rem] border border-platinumGold/25 bg-platinumGold/10 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-platinumGold">Next up in {autoNextCountdown}s</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{nextStory.title}</h4>
                    <p className="mt-2 text-sm text-slate-300">Auto-next imewashwa ili simulizi zifuate mfululizo bila kumsumbua msikilizaji.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={cancelAutoNext}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                    >
                      Sitisha auto-next
                    </button>
                    <button
                      type="button"
                      onClick={triggerAutoNext}
                      className="rounded-full bg-platinumGold px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      Fungua sasa
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {!usingBrowserNarration ? <audio ref={narrationRef} src={narrationUrl || undefined} preload="metadata" /> : null}
          <audio ref={ambienceRef} preload="auto" />
          <audio ref={musicRef} preload="auto" />
        </div>

        <aside className="grid gap-6">
          {nextStory ? (
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-card">
              {nextStory.coverImage ? (
                <div className="h-40 w-full overflow-hidden bg-background">
                  <img src={nextStory.coverImage} alt={nextStory.title} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">Up next</p>
                <h3 className="mt-2 text-2xl font-bold text-white">{nextStory.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                  {nextStory.category ? <span className="rounded-full bg-white/5 px-3 py-1">{nextStory.category}</span> : null}
                  {nextStory.duration ? <span className="rounded-full bg-white/5 px-3 py-1">{nextStory.duration}</span> : null}
                </div>
                <div className="mt-5 flex gap-3">
                  <Link href={`/stories/${nextStory.slug}`} className="rounded-full bg-platinumGold px-4 py-2 text-sm font-semibold text-slate-950">
                    Open next story
                  </Link>
                  <button
                    type="button"
                    onClick={beginAutoNext}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                  >
                    Start auto-next
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[1.75rem] border border-white/10 bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">Subtitle panel</p>
              <span className="text-xs text-slate-400">{subtitleLanguage || "English"}</span>
            </div>
            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {subtitleCues.length > 0 ? (
                subtitleCues.map((cue) => {
                  const isActive = activeCue?.id === cue.id;
                  return (
                    <div
                      key={cue.id}
                      ref={isActive ? activeCueRef : null}
                      className={`rounded-2xl border p-4 text-sm leading-7 transition ${
                        isActive
                          ? "border-platinumGold/50 bg-platinumGold/10 text-white"
                          : "border-white/10 bg-background/50 text-slate-300"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em]">
                        <span>{formatTime(cue.start)}</span>
                        <span>{formatTime(cue.end)}</span>
                      </div>
                      <p>{cue.text}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-sm text-slate-400">
                  Hakuna subtitle cues bado kwa simulizi hili.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">Story scenes</p>
              {scenes.length > 0 ? (
                <span className="text-xs text-slate-400">{activeSceneIndex >= 0 ? `Now on chapter ${activeSceneIndex + 1}` : `${scenes.length} chapters`}</span>
              ) : null}
            </div>
            <div className="mt-4 space-y-3">
              {scenes.length > 0 ? (
                scenes.map((scene, index) => {
                  const isActive = currentTime >= scene.start_time_seconds && currentTime <= scene.end_time_seconds;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSeek(scene.start_time_seconds)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive ? "border-platinumGold/50 bg-platinumGold/10" : "border-white/10 bg-background/50 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Chapter {index + 1}</p>
                          <p className="mt-1 font-semibold text-white">{scene.title}</p>
                        </div>
                        <span className="text-xs text-slate-400">{formatTime(scene.start_time_seconds)}</span>
                      </div>
                      {scene.caption ? <p className="mt-2 text-sm leading-6 text-slate-300">{scene.caption}</p> : null}
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-background/50 p-5 text-sm text-slate-400">
                  Hakuna scenes bado kwa simulizi hili.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {showStickyMiniPlayer ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-platinumGold">Now playing</p>
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handlePlayPause()}
                  className="rounded-full bg-platinumGold px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{storyTitle}</p>
                  <p className="truncate text-xs text-slate-400">{activeScene?.title || "Scene ya simulizi"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
