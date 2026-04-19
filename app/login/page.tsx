import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="py-20">
      <div className="container max-w-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-card p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">HistoSauti Admin</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Demo mode ya portal</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Toleo hili limeandaliwa likitumika mara moja bila setup ya ziada ya login.
            Kwa sasa unaweza kufungua admin moja kwa moja, kuona media manager, na kusimamia muundo wa stories.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/admin" className="rounded-full bg-gold px-6 py-3 font-semibold text-slate-950">
              Fungua admin moja kwa moja
            </Link>
            <Link href="/admin/media" className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white hover:border-gold hover:text-gold">
              Fungua media manager
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
