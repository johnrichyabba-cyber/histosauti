"use client";

import { useMemo, useState } from "react";

export default function MediaConfigForm() {
  const [slug, setSlug] = useState("karibu-histosauti");
  const [cover, setCover] = useState("");
  const [gallery, setGallery] = useState("");
  const [narration, setNarration] = useState("");
  const [ambience, setAmbience] = useState("");
  const [music, setMusic] = useState("");
  const [copied, setCopied] = useState(false);

  const json = useMemo(
    () => ({
      story_slug: slug.trim(),
      cover_image_url: cover.trim(),
      narration_url: narration.trim(),
      ambience_url: ambience.trim(),
      music_url: music.trim(),
      gallery_images: gallery.split("\n").map((v) => v.trim()).filter(Boolean),
      scenes: []
    }),
    [slug, cover, gallery, narration, ambience, music]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-gold">Media manager</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Panga visuals na audio za simulizi</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Hapa unaweza kuandaa cover image, gallery, narration, ambience, na soundtrack kwa kila story.
          Kwa toleo hili la demo, form hii huzalisha JSON ya media configuration iliyo tayari kupaste kwenye mfumo.
        </p>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft md:grid-cols-2">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="story slug" />
        <input value={cover} onChange={(e) => setCover(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="cover image URL" />
        <input value={narration} onChange={(e) => setNarration(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="narration audio URL" />
        <input value={ambience} onChange={(e) => setAmbience(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="ambience URL" />
        <input value={music} onChange={(e) => setMusic(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none md:col-span-2" placeholder="music URL" />
        <textarea value={gallery} onChange={(e) => setGallery(e.target.value)} rows={6} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none md:col-span-2" placeholder={"gallery image URLs, one per line"} />
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Generated JSON</h2>
          <button onClick={handleCopy} className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-slate-950">
            {copied ? "Imekopiwa" : "Copy JSON"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-7 text-slate-200">{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  );
}
