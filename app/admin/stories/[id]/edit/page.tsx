import { notFound } from "next/navigation";
import { getLocalStoryById } from "@/lib/local-content-store";
import { saveStoryStudioAction } from "../../actions";

type EditStoryPageProps = {
  params: {
    id: string;
  };
};

export default async function EditStoryPage({
  params,
}: EditStoryPageProps) {
  const story = getLocalStoryById(params.id);

  if (!story) {
    notFound();
  }

  const galleryImages = Array.isArray((story as any).gallery_images)
    ? JSON.stringify((story as any).gallery_images, null, 2)
    : "[]";

  const scenes = Array.isArray((story as any).scenes)
    ? JSON.stringify((story as any).scenes, null, 2)
    : "[]";

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-card p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
          Admin
        </p>

        <h1 className="mt-4 text-4xl font-bold">Hariri story</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Badilisha title, summary, media, gallery, scenes, na taarifa nyingine
          za simulizi lako.
        </p>
      </section>

      <form action={saveStoryStudioAction} className="mt-8 space-y-6">
        <input type="hidden" name="id" value={story.id} />

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-card p-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Title</label>
            <input
              name="title"
              required
              defaultValue={story.title}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Slug</label>
            <input
              name="slug"
              required
              defaultValue={story.slug}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Short description</label>
            <textarea
              name="short_description"
              rows={3}
              defaultValue={story.short_description ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Story summary</label>
            <textarea
              name="story_summary"
              rows={5}
              defaultValue={story.story_summary ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Category</label>
            <input
              name="category"
              defaultValue={(story as any).category ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Duration seconds</label>
            <input
              name="duration_seconds"
              type="number"
              min="0"
              defaultValue={story.duration_seconds ?? 0}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Cover image URL</label>
            <input
              name="cover_image_url"
              defaultValue={(story as any).cover_image_url ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Narration URL</label>
            <input
              name="narration_url"
              defaultValue={(story as any).narration_url ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Ambience URL</label>
            <input
              name="ambience_url"
              defaultValue={(story as any).ambience_url ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Music URL</label>
            <input
              name="music_url"
              defaultValue={(story as any).music_url ?? ""}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Gallery images JSON</label>
            <textarea
              name="gallery_images"
              rows={4}
              defaultValue={galleryImages}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Scenes JSON</label>
            <textarea
              name="scenes"
              rows={8}
              defaultValue={scenes}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-platinumGold px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
          >
            Hifadhi mabadiliko
          </button>
        </div>
      </form>
    </main>
  );
}