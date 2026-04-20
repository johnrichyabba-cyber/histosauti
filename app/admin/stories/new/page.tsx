import { saveStoryStudioAction } from "../actions";

export default function NewStoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-card p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
          Admin
        </p>

        <h1 className="mt-4 text-4xl font-bold">Ongeza story mpya</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Jaza taarifa kuu za simulizi hapa. Mfumo utahifadhi story yako kwenye
          local studio mode bila kutegemea modules za nje zinazovunja build.
        </p>
      </section>

      <form action={saveStoryStudioAction} className="mt-8 space-y-6">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-card p-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Title</label>
            <input
              name="title"
              required
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="Mfano: Titanic: Safari Iliyoishia Kwenye Giza la Bahari"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Slug</label>
            <input
              name="slug"
              required
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="mfano: titanic-1912"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Short description</label>
            <textarea
              name="short_description"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="Maelezo mafupi ya story..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Story summary</label>
            <textarea
              name="story_summary"
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="Muhtasari wa kina wa simulizi..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Category</label>
            <input
              name="category"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="Disasters / Biography / War..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Duration seconds</label>
            <input
              name="duration_seconds"
              type="number"
              min="0"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="720"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Cover image URL</label>
            <input
              name="cover_image_url"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="/uploads/images/example.jpg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Narration URL</label>
            <input
              name="narration_url"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="/uploads/audio/example.mp3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Ambience URL</label>
            <input
              name="ambience_url"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="/uploads/audio/ambience.mp3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Music URL</label>
            <input
              name="music_url"
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder="/uploads/audio/music.mp3"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Gallery images</label>
            <textarea
              name="gallery_images"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder='["/uploads/images/one.jpg","/uploads/images/two.jpg"]'
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300">Scenes JSON</label>
            <textarea
              name="scenes"
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-white outline-none"
              placeholder='[{"title":"Scene 1","time":"0:00","summary":"..." }]'
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-platinumGold px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
          >
            Hifadhi story
          </button>
        </div>
      </form>
    </main>
  );
}