"use client";

import { useState } from "react";
import FileUploadField from "@/components/admin/file-upload-field";

export default function UploadTestPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-white">
      <div className="space-y-8 rounded-[2rem] border border-white/10 bg-card p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
            Upload test
          </p>
          <h1 className="mt-3 text-3xl font-bold">Jaribu image na audio upload</h1>
          <p className="mt-3 text-slate-300">
            Ukiona preview na URL, upload system yako inafanya kazi vizuri.
          </p>
        </div>

        <FileUploadField
          label="Pakia image"
          type="image"
          value={imageUrl}
          onChange={setImageUrl}
        />

        <FileUploadField
          label="Pakia audio"
          type="audio"
          value={audioUrl}
          onChange={setAudioUrl}
        />

        <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
          <p className="text-sm text-slate-400">Image URL</p>
          <p className="mt-2 break-all text-white">{imageUrl || "Hakuna bado"}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
          <p className="text-sm text-slate-400">Audio URL</p>
          <p className="mt-2 break-all text-white">{audioUrl || "Hakuna bado"}</p>
        </div>
      </div>
    </main>
  );
}