import Link from "next/link";

const items = [
  { href: "/admin", label: "Overview", helper: "Dashboard na analytics" },
  { href: "/admin/stories/new", label: "Integrated Story Studio", helper: "Story, images, scenes, soundtrack, subtitle" },
  { href: "/admin/stories", label: "Stories", helper: "Simamia content zote" },
  { href: "/admin/categories", label: "Categories", helper: "Panga makundi ya stories" },
  { href: "/admin/media", label: "Media Workspace", helper: "JSON helper kwa visuals, ambience, music" }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-glow backdrop-blur">
      <div className="rounded-[1.5rem] border border-gold/15 bg-gradient-to-br from-gold/15 to-transparent p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold/80">HistoSauti</p>
        <h2 className="mt-2 text-xl font-bold text-white">Admin Control Room</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Simamia true stories, audio, subtitle, visuals, soundtrack, na scenes kwa mtiririko mmoja.
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-[1.25rem] border border-transparent px-4 py-3 transition hover:border-gold/20 hover:bg-gold/10"
          >
            <span className="block text-sm font-semibold text-slate-100">{item.label}</span>
            <span className="mt-1 block text-xs text-slate-400">{item.helper}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/5 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Local studio mode</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>• Create/edit stories bila Supabase</li>
          <li>• Save media configs moja kwa moja ndani ya project</li>
          <li>• Preview changes mara moja kwenye public pages</li>
        </ul>
      </div>
    </aside>
  );
}
