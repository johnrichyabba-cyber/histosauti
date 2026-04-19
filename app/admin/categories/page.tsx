import { getCategories } from "@/lib/stories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-soft">
      <h1 className="text-2xl font-bold text-white">Categories</h1>
      <p className="mt-2 text-sm text-slate-400">Makundi yaliyopakiwa tayari ndani ya demo hii ya HistoSauti.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-white">
            <p className="font-semibold">{category.name}</p>
            <p className="mt-2 text-sm text-slate-400">{category.description || category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
