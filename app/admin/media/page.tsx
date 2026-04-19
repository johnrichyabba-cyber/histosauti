import Link from "next/link";
import MediaConfigForm from "@/components/admin/media-config-form";

export default function AdminMediaPage() {
  return (
    <main className="space-y-6">
      <div className="rounded-[2rem] border border-gold/20 bg-gold/5 p-6 text-slate-200 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Integrated workflow</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Media Manager</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Kwa sasa create/edit story tayari imeunganishwa na media studio ndani ya form moja. Page hii
          inabaki kama workspace ya kupanga JSON ya visuals, gallery, ambience, na soundtrack kwa haraka,
          kisha unaweza kuihamisha kwenye story editor yako.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/stories/new" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-slate-950">
            Open integrated story studio
          </Link>
          <Link href="/admin/stories" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">
            View all stories
          </Link>
        </div>
      </div>

      <MediaConfigForm />
    </main>
  );
}
