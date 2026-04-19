import type { StoryMediaConfig } from "@/lib/media-manager";
import type { CategoryRecord, StoryAdminRecord } from "@/lib/types";

type StoryFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => void | Promise<void>;
  categories: CategoryRecord[];
  story?: StoryAdminRecord;
  error?: string;
  mediaConfig?: StoryMediaConfig | null;
};

function buildSourcesValue(story?: StoryAdminRecord) {
  if (!story?.sources?.length) return "";

  return story.sources
    .map((source) => [source.title, source.publisher || "", source.url || "", source.notes || ""].join(" | "))
    .join("\n");
}

function buildTimelineValue(story?: StoryAdminRecord) {
  if (!story?.timeline?.length) return "";

  return story.timeline
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((event) => [event.yearLabel, event.title, event.description].join(" | "))
    .join("\n");
}

function buildGalleryValue(mediaConfig?: StoryMediaConfig | null) {
  if (!mediaConfig?.gallery_images?.length) return "";
  return mediaConfig.gallery_images.join("\n");
}

function buildScenesValue(mediaConfig?: StoryMediaConfig | null) {
  if (!mediaConfig?.scenes?.length) return "";

  return mediaConfig.scenes
    .map((scene) => [
      scene.id,
      scene.title,
      scene.start_time_seconds,
      scene.end_time_seconds,
      scene.image_url || "",
      scene.ambience_url || "",
      scene.music_url || "",
      scene.caption || ""
    ].join(" | "))
    .join("\n");
}

export function StoryForm({ mode, action, categories, story, error, mediaConfig }: StoryFormProps) {
  const isEdit = mode === "edit";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-gold">Admin Studio</p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            {isEdit ? "Edit Story + Media" : "Create Story + Media"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Hapa ndipo studio kuu ya HistoSauti. Andika story, panga timeline, sources, subtitle,
            gallery images, narration, ambience, soundtrack, na scene-by-scene visuals sehemu moja.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <form action={action} className="mt-8 space-y-8">
        {isEdit && story ? <input type="hidden" name="id" value={story.id} /> : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Story Core</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Main story details</h2>
          </div>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Story title</span>
            <input
              name="title"
              required
              defaultValue={story?.title || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="Mfano: Titanic: Safari Iliyoishia Kwenye Giza la Bahari"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Slug</span>
            <input
              name="slug"
              defaultValue={story?.slug || mediaConfig?.story_slug || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="titanic-1912"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Category</span>
            <select
              name="category_id"
              required
              defaultValue={story?.categoryId || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            >
              <option value="">Chagua category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Short description</span>
            <textarea
              name="short_description"
              rows={4}
              defaultValue={story?.shortDescription || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="Andika teaser ya stori..."
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Story summary</span>
            <textarea
              name="story_summary"
              rows={6}
              defaultValue={story?.summary || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="Andika muhtasari wa stori..."
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Full story text</span>
            <textarea
              name="full_story_text"
              rows={8}
              defaultValue={story?.fullStoryText || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="Andika body ya simulizi, background ya tukio, na context ya kihistoria..."
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Timeline entries</span>
            <textarea
              name="timeline_entries"
              rows={6}
              defaultValue={buildTimelineValue(story)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder={"Tumia mstari mmoja kwa event moja:\n1912 | Titanic leaves Southampton | Safari inaanza kwa matumaini makubwa\n15 Apr 1912 | Titanic sinks | Ajali inabadilisha historia ya usafiri wa baharini"}
            />
            <p className="text-xs leading-5 text-slate-400">
              Format: mwaka/tarehe | kichwa cha event | maelezo ya event
            </p>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Sources</span>
            <textarea
              name="sources_entries"
              rows={6}
              defaultValue={buildSourcesValue(story)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder={"Tumia mstari mmoja kwa source moja:\nTitanic Inquiry | UK Parliament Records | https://example.com | Ushahidi wa manusura na uchunguzi rasmi"}
            />
            <p className="text-xs leading-5 text-slate-400">Format: title | publisher | url | notes</p>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Duration (seconds)</span>
            <input
              name="duration_seconds"
              type="number"
              min="0"
              defaultValue={story?.durationSeconds ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="720"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Status</span>
            <select
              name="status"
              defaultValue={story?.status || "draft"}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>

          <label className="flex items-center gap-3 lg:col-span-2">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={Boolean(story?.featured)}
              className="h-4 w-4 rounded border-white/10 bg-slate-950/70 text-gold"
            />
            <span className="text-sm text-slate-200">Weka story hii kuwa featured</span>
          </label>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Media Studio</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Visuals, audio, ambience, na soundtrack</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Hapa ndipo unaweka kila kitu kinachofanya simulizi liwe documentary halisi. Unaweza
              kutumia URLs za media za bure au uploads. Kwa stories za demo, mfumo huu sasa una-save
              media config live kwenye local studio mode hata kama Supabase bado hujaunganisha.
            </p>
          </div>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Cover image URL</span>
            <input
              name="cover_image_url"
              defaultValue={story?.coverImage || mediaConfig?.cover_image_url || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="https://..."
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Upload cover image</span>
            <input
              name="cover_image_file"
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-slate-950"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Narration audio URL</span>
            <input
              name="audio_url"
              defaultValue={story?.audioUrl || mediaConfig?.narration_url || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="https://...mp3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Upload narration (.mp3)</span>
            <input
              name="audio_file"
              type="file"
              accept="audio/mpeg,audio/mp3"
              className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-slate-950"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Subtitle file URL</span>
            <input
              name="subtitle_file_url"
              defaultValue={story?.subtitleUrl || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="https://...vtt"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Upload subtitle (.vtt)</span>
            <input
              name="subtitle_file"
              type="file"
              accept=".vtt,text/vtt"
              className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-slate-950"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Default ambience URL</span>
            <input
              name="media_ambience_url"
              defaultValue={mediaConfig?.ambience_url || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="https://...mp3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Default soundtrack URL</span>
            <input
              name="media_music_url"
              defaultValue={mediaConfig?.music_url || ""}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder="https://...mp3"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Gallery image URLs</span>
            <textarea
              name="media_gallery_entries"
              rows={5}
              defaultValue={buildGalleryValue(mediaConfig)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder={"https://...\nhttps://...\nhttps://..."}
            />
            <p className="text-xs leading-5 text-slate-400">
              Tumia mstari mmoja kwa image moja. Hizi ndizo zitaonekana kwenye story gallery.
            </p>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Scene entries</span>
            <textarea
              name="media_scene_entries"
              rows={8}
              defaultValue={buildScenesValue(mediaConfig)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              placeholder={"scene-1 | Mwanzo wa simulizi | 0 | 25 | https://image.jpg | https://ambience.mp3 | https://music.mp3 | Caption ya scene\nscene-2 | Kuingia kwenye tukio | 26 | 55 | https://image.jpg |  | https://music.mp3 | Caption ya scene"}
            />
            <p className="text-xs leading-5 text-slate-400">
              Format: id | title | start_seconds | end_seconds | image_url | ambience_url | music_url | caption
            </p>
          </label>

          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm leading-6 text-slate-200 lg:col-span-2">
            <strong className="text-gold">Muhimu:</strong> local studio mode sasa ina-save story na media config
            moja kwa moja kwenye JSON za project yako. Ukiunganisha Supabase baadaye, story data itaweza kwenda live
            lakini cinematic media configs zitaendelea kufanya kazi pia.
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-slate-400">
            Ukimaliza, story itaongezwa kwenye archive na unaweza kuiboresha baadaye kwenye edit mode.
          </p>
          <button
            type="submit"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            {isEdit ? "Save changes" : "Create story"}
          </button>
        </div>
      </form>
    </div>
  );
}
