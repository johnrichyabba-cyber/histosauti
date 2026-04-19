"use client";

import { useRef, useState } from "react";

type UploadType = "image" | "audio";

type FileUploadFieldProps = {
  label: string;
  type: UploadType;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
};

export default function FileUploadField({
  label,
  type,
  value,
  onChange,
  accept,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      if (type === "image") {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-background/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-platinumGold px-4 py-2 text-sm font-semibold text-black"
        >
          {uploading ? "Ina-upload..." : "Upload file"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept || (type === "image" ? "image/*" : "audio/*")}
        onChange={handleSelectFile}
        className="hidden"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          type === "image" ? "/uploads/images/..." : "/uploads/audio/..."
        }
        className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-white outline-none"
      />

      {type === "image" && (previewUrl || value) ? (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <img
            src={previewUrl || value}
            alt="Upload preview"
            className="h-56 w-full object-cover"
          />
        </div>
      ) : null}

      {type === "audio" && value ? (
        <audio controls className="w-full">
          <source src={value} />
        </audio>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}