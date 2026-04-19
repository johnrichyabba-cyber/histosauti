export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-950/60 py-10">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-platnumGold">HistoSauti</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Portal ya simulizi za kweli za kihistoria kwa sauti ya Kiswahili, zikiwa na subtitle za Kiingereza.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Sehemu</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Stories</li>
            <li>Categories</li>
            <li>Trending</li>
            <li>About</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Taarifa</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Contact</li>
            <li>Terms</li>
            <li>Privacy</li>
            <li>Newsletter</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
