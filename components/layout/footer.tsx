import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-slate-300 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h3 className="text-xl font-bold text-platinumGold">HistoSauti</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Simulizi za kweli za kihistoria kwa Kiswahili, zikiwa na subtitle,
            sauti, na muonekano wa cinematic documentary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/" className="hover:text-platinumGold">
            Home
          </Link>
          <Link href="/stories" className="hover:text-platinumGold">
            Stories
          </Link>
          <Link href="/categories" className="hover:text-platinumGold">
            Categories
          </Link>
          <Link href="/about" className="hover:text-platinumGold">
            About
          </Link>
          <Link href="/admin" className="hover:text-platinumGold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}