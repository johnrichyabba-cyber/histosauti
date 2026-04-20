"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SceneItem = {
  id?: string;
  title?: string;
  time?: string;
  summary?: string;
  subtitle?: string;
  imageUrl?: string | null;
  ambienceUrl?: string | null;
};

type StoryCinematicPlayerProps = {
  title?: string;
  narrationUrl?: string | null;
  posterUrl?: string | null;
  ambienceUrl?: string | null;
  musicUrl?: string | null;
  scenes?: SceneItem[] | null;
  fallbackText?: string;
};

function parseTimeToSeconds(value?: string) {
  if (!value) return 0;

  const parts = value.split(":").map((item) => Number(item.trim()));
  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return 0;
}

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getBestVoice(voices: SpeechSynthesisVoice[]) {
  const priorities = ["sw-KE", "sw-TZ", "sw", "en-KE", "en-TZ"];

  for (const target of priorities) {
    const match = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(target.toLowerCase()),
    );
    if (match) return match;
  }

  return voices[0] ?? null;
}

export default function StoryCinematicPlayer({
  title,
  narrationUrl,
  posterUrl,
  ambienceUrl,
  musicUrl,
  scenes,
  fallbackText,
}: StoryCinematicPlayerProps) {
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [narrationVolume, setNarrationVolume] = useState(1);
  const [ambienceVolume, setAmbienceVolume] = useState(0.35);
  const [musicVolume, setMusicVolume] = useState(0.2);

  const safeScenes = useMemo(() => {
    if (!Array.isArray(scenes)) return [];

    return scenes.map((scene, index) => ({
      id: scene.id ?? `scene-${index + 1}`,
      title: scene.title ?? `Scene ${index + 1}`,
      time: scene.time ?? "0:00",
      summary: scene.summary ?? "",
      subtitle: scene.subtitle ?? scene.summary ?? "",
      imageUrl: scene.imageUrl ?? null,
      ambienceUrl: scene.ambienceUrl ?? null,
      startSeconds: parseTimeToSeconds(scene.time),
    }));
  }, [scenes]);

  const combinedFallbackText = useMemo(() => {
    const sceneText = safeScenes
      .map((scene) => `${scene.title}. ${scene.subtitle || scene.summary}`)
      .join(" ");

    return (
      fallbackText ||
      [title, sceneText].filter(Boolean).join(". ") ||
      "Hakuna simulizi la kusoma kwa sasa."
    );
  }, [fallbackText, safeScenes, title]);

  useEffect(() => {
    const narration = narrationRef.current;
    if (!narration) return;

    const handleLoaded = () => {
      setDuration(Number.isFinite(narration.duration) ? narration.duration : 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(
        Number.isFinite(narration.currentTime) ? narration.currentTime : 0,
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    narration.addEventListener("loadedmetadata", handleLoaded);
    narration.addEventListener("timeupdate", handleTimeUpdate);
    narration.addEventListener("ended", handleEnded);

    return () => {
      narration.removeEventListener("loadedmetadata", handleLoaded);
      narration.removeEventListener("timeupdate", handleTimeUpdate);
      narration.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (narrationRef.current) narrationRef.current.volume = narrationVolume;
  }, [narrationVolume]);

  useEffect(() => {
    if (ambienceRef.current) ambienceRef.current.volume = ambienceVolume;
  }, [ambienceVolume]);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentScene = useMemo(() => {
    if (safeScenes.length === 0) return null;

    let active = safeScenes[0];
    for (const scene of safeScenes) {
      if (currentTime >= scene.startSeconds) {
        active = scene;
      }
    }

    return active;
  }, [currentTime, safeScenes]);

  async function playAudioMode() {
    try {
      if (!narrationRef.current || !narrationUrl) return;

      await narrationRef.current.play();

      if (ambienceRef.current && ambienceUrl) {
        ambienceRef.current.currentTime = narrationRef.current.currentTime;
        await ambienceRef.current.play().catch(() => null);
      }

      if (musicRef.current && musicUrl) {
        musicRef.current.currentTime = narrationRef.current.currentTime;
        await musicRef.current.play().catch(() => null);
      }

      setIsVoiceMode(false);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function playVoiceMode() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(combinedFallbackText);
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = getBestVoice(voices);

    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = "sw";
    }

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = Math.max(0, Math.min(1, narrationVolume));

    utterance.onend = () => {
      setIsPlaying(false);
      setIsVoiceMode(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsVoiceMode(true);
    setIsPlaying(true);

    if (ambienceRef.current && ambienceUrl) {
      ambienceRef.current.currentTime = 0;
      void ambienceRef.current.play().catch(() => null);
    }

    if (musicRef.current && musicUrl) {
      musicRef.current.currentTime = 0;
      void musicRef.current.play().catch(() => null);
    }
  }

  function pauseAll() {
    narrationRef.current?.pause();
    ambienceRef.current?.pause();
    musicRef.current?.pause();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setIsVoiceMode(false);
  }

  function togglePlayback() {
    if (isPlaying) {
      pauseAll();
      return;
    }

    if (narrationUrl) {
      void playAudioMode();
      return;
    }

    playVoiceMode();
  }

  function seekTo(nextTime: number) {
    const safeTime = Math.max(0, Math.min(nextTime, duration || 0));

    if (narrationRef.current) narrationRef.current.currentTime = safeTime;
    if (ambienceRef.current) ambienceRef.current.currentTime = safeTime;
    if (musicRef.current) musicRef.current.currentTime = safeTime;

    setCurrentTime(safeTime);
  }

  function skipBy(amount: number) {
    if (!narrationUrl) return;
    seekTo(currentTime + amount);
  }

  const hasAudioFile = Boolean(narrationUrl);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-card p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
            Story Mode
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white">
            {title || "Cinematic narration"}
          </h2>

          <p className="mt-3 text-slate-300">
            {hasAudioFile
              ? "Story hii ina audio file tayari. Bonyeza play kusikiliza."
              : "Story hii haina narration mp3 bado, hivyo mfumo utatumia East Africa voice fallback kutoka kwenye browser yako."}
          </p>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-background/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl || "/images/placeholders/story-cover.jpg"}
              alt={title || "Story poster"}
              className="h-[280px] w-full object-cover"
            />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-background/40 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className="rounded-full bg-platinumGold px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={() => skipBy(-10)}
                disabled={!hasAudioFile}
                className="rounded-full border border-white/10 px-5 py-3 text-white transition hover:border-platinumGold/30 hover:text-platinumGold disabled:cursor-not-allowed disabled:opacity-40"
              >
                -10s
              </button>

              <button
                type="button"
                onClick={() => skipBy(10)}
                disabled={!hasAudioFile}
                className="rounded-full border border-white/10 px-5 py-3 text-white transition hover:border-platinumGold/30 hover:text-platinumGold disabled:cursor-not-allowed disabled:opacity-40"
              >
                +10s
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#071126] p-4 text-sm text-slate-300">
              <span className="font-semibold text-white">Playback mode:</span>{" "}
              {hasAudioFile
                ? "Audio file mode"
                : isVoiceMode
                  ? "East Africa browser voice mode"
                  : "Voice fallback mode ready"}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                <span>{formatClock(currentTime)}</span>
                <span>{hasAudioFile ? formatClock(duration) : "Voice mode"}</span>
              </div>

              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                disabled={!hasAudioFile}
                onChange={(event) => seekTo(Number(event.target.value))}
                className="w-full disabled:opacity-40"
              />

              {hasAudioFile ? (
                <div className="mt-2 text-xs text-slate-400">
                  Progress: {Math.round(progress)}%
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-400">
                  Progress bar inafanya kazi tu pale narration mp3 ipo.
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Narration</p>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={narrationVolume}
                  onChange={(event) => setNarrationVolume(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Ambience</p>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={ambienceVolume}
                  onChange={(event) => setAmbienceVolume(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-400">Music</p>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={musicVolume}
                  onChange={(event) => setMusicVolume(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </div>
            </div>

            {currentScene ? (
              <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-[#071126] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
                    Live Subtitle
                  </p>
                  <p className="text-sm text-slate-400">{currentScene.title}</p>
                </div>

                <p className="mt-4 text-xl leading-9 text-white">
                  {currentScene.subtitle || "Subtitle itaonekana hapa wakati simulizi inaendelea."}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="rounded-[1.5rem] border border-white/10 bg-background/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
                Story scenes
              </p>
              <p className="text-sm text-slate-400">
                {safeScenes.length > 0 ? `${safeScenes.length} scenes` : "No scenes"}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {safeScenes.length > 0 ? (
                safeScenes.map((scene) => {
                  const isActive = currentScene?.id === scene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => seekTo(scene.startSeconds)}
                      disabled={!hasAudioFile}
                      className={`block w-full rounded-[1.25rem] border p-4 text-left transition ${
                        isActive
                          ? "border-platinumGold/40 bg-platinumGold/10"
                          : "border-white/10 bg-card hover:border-platinumGold/20"
                      } disabled:cursor-not-allowed disabled:opacity-80`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-white">{scene.title}</h3>
                        <span className="text-sm text-slate-400">{scene.time}</span>
                      </div>

                      {scene.summary ? (
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {scene.summary}
                        </p>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-white/10 p-5 text-slate-400">
                  Hakuna scenes bado kwa story hii.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {narrationUrl ? (
        <audio ref={narrationRef} preload="metadata" src={narrationUrl} />
      ) : null}

      {ambienceUrl ? (
        <audio ref={ambienceRef} preload="metadata" loop src={ambienceUrl} />
      ) : null}

      {musicUrl ? (
        <audio ref={musicRef} preload="metadata" loop src={musicUrl} />
      ) : null}
    </section>
  );
}