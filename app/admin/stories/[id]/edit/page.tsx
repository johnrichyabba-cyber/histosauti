import { notFound } from "next/navigation";
import { getStories } from "@/lib/stories";
import { saveStoryStudioAction } from "../../actions";

type EditStoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

export default async function EditStoryPage({
  params,
}: EditStoryPageProps) {
  const { id } = await params;
  const stories = await getStories();

  const story = stories.find((item) => String(item.id) === String(id));

  if (!story) {
    notFound();
  }

  const safeStory = story as Record<string, unknown>;

  const title = asString(safeStory.title);
  const slug = asString(safeStory.slug);
  const shortDescription =
    asString(safeStory.short_description) ||
    asString(safeStory.description) ||
    asString(safeStory.summary);
  const category = asString(safeStory.category);
  const status = asString(safeStory.status, "draft");
  const body =
    asString(safeStory.body) ||
    asString(safeStory.story) ||
    asString(safeStory.content);
  const audioUrl = asString(safeStory.audio_url);
  const subtitleUrl = asString(safeStory.subtitle_url);
  const posterUrl =
    asString(safeStory.poster_url) ||
    asString(safeStory.cover_image_url) ||
    asString(safeStory.image_url);
  const ambianceUrl = asString(safeStory.ambiance_url);
  const musicUrl = asString(safeStory.music_url);
  const featured = asBoolean(safeStory.featured);

  const galleryImages = Array.isArray(safeStory.gallery_images)
    ? safeStory.gallery_images
        .map((item) => asString(item))
        .filter(Boolean)
        .join("\n")
    : "";

  const scenes = Array.isArray(safeStory.scenes)
    ? JSON.stringify(safeStory.scenes, null, 2)
    : "";

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
              HistoSauti
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Admin Control Room
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-300">
              Hariri story, audio, subtitle, visuals, soundtrack, na scenes
              kutoka sehemu moja.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Rekebisha taarifa kuu za story yako.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Integrated Story Studio</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Body, media links, gallery, na cinematic scenes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Stories</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Simamia content yote ya documentary.
                </p>
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4b26a]">
              Admin
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Hariri story
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Sasisha title, slug, description, body, media links, na data zote
              za story bila kuvunja build ya production.
            </p>

            <form action={saveStoryStudioAction} className="mt-8 space-y-6">
              <input type="hidden" name="id" value={String(story.id ?? "")} />

              <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[#081121] p-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Title
                  </label>
                  <input
                    name="title"
                    defaultValue={title}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="Mfano: Titanic - Safari ya mwisho"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Slug
                  </label>
                  <input
                    name="slug"
                    defaultValue={slug}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="mfano titanic-1912"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">
                    Short description
                  </label>
                  <textarea
                    name="short_description"
                    defaultValue={shortDescription}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="Maelezo mafupi ya story..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Category
                  </label>
                  <input
                    name="category"
                    defaultValue={category}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="History, Mystery, Politics..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={status}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    defaultChecked={featured}
                    className="h-5 w-5 rounded border-white/20 bg-[#050816]"
                  />
                  <label htmlFor="featured" className="text-sm text-slate-300">
                    Weka story hii kama featured
                  </label>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-[#081121] p-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Story body / script
                  </label>
                  <textarea
                    name="body"
                    defaultValue={body}
                    rows={14}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="Weka maandishi ya story hapa..."
                  />
                </div>
              </section>

              <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[#081121] p-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Audio URL
                  </label>
                  <input
                    name="audio_url"
                    defaultValue={audioUrl}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Subtitle URL
                  </label>
                  <input
                    name="subtitle_url"
                    defaultValue={subtitleUrl}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Poster / Cover image URL
                  </label>
                  <input
                    name="poster_url"
                    defaultValue={posterUrl}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Ambience URL
                  </label>
                  <input
                    name="ambiance_url"
                    defaultValue={ambianceUrl}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">
                    Music URL
                  </label>
                  <input
                    name="music_url"
                    defaultValue={musicUrl}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="https://..."
                  />
                </div>
              </section>

              <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[#081121] p-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Gallery images
                  </label>
                  <textarea
                    name="gallery_images"
                    defaultValue={galleryImages}
                    rows={8}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder="Weka image URLs, moja kila mstari..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Scenes JSON
                  </label>
                  <textarea
                    name="scenes"
                    defaultValue={scenes}
                    rows={8}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 font-mono text-sm text-white outline-none transition focus:border-[#d4b26a]"
                    placeholder='[{"title":"Scene 1","text":"..."}, {"title":"Scene 2","text":"..."}]'
                  />
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#d4b26a] px-8 py-4 font-semibold text-black transition hover:opacity-90"
                >
                  Hifadhi mabadiliko
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}