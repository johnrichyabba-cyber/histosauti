export function Newsletter() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-glow md:p-12">
          <p className="text-sm uppercase tracking-[0.25em] text-platnumGold">Newsletter</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Pata stori mpya kila wiki</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Jisajili ili upokee simulizi mpya za matukio ya kweli, curated kwa style ya documentary na narration ya Kiswahili.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              placeholder="Weka email yako"
              className="h-12 flex-1 rounded-full border border-white/10 bg-slate-950 px-5 text-white outline-none placeholder:text-slate-500 focus:border-platnumGold/40"
            />
            <button className="h-12 rounded-full bg-platnumGold px-6 font-semibold text-slate-950 shadow-glow transition hover:opacity-95">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
