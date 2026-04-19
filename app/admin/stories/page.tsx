import Link from "next/link";
import { getAdminStories } from "@/lib/stories";

export default async function AdminStoriesPage() {
  const stories = await getAdminStories();

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Stories</h1>
          <p className="mt-2 text-sm text-slate-400">Stories zote za demo pamoja na ulizo-save kwenye local studio mode.</p>
        </div>
        <Link href="/admin/stories/new" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-slate-950">
          New story
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-b border-white/5 align-top">
                <td className="px-4 py-4 text-white">
                  <div className="font-semibold">{story.title}</div>
                  <div className="mt-1 text-xs text-slate-400">/{story.slug}</div>
                </td>
                <td className="px-4 py-4">{story.category}</td>
                <td className="px-4 py-4">{story.duration}</td>
                <td className="px-4 py-4 capitalize">{story.status}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/stories/${story.slug}`} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:border-gold hover:text-gold">
                      View
                    </Link>
                    <Link href={`/admin/stories/${story.id}/edit`} className="rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold hover:bg-gold/10">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
