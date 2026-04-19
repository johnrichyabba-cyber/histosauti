import Link from "next/link";
import { Search } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/stories", label: "Stories" },
  { href: "/categories", label: "Categories" },
  { href: "/#trending", label: "Trending" },
  { href: "/about", label: "About" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="text-2xl font-bold text-gold">HistoSauti</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium text-slate-200 transition hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-gold hover:text-gold">
            <Search className="h-6 w-6" />
          </button>
          <Link href="/admin" className="rounded-full border border-white/10 px-6 py-3 text-lg font-semibold text-slate-100 transition hover:border-gold hover:text-gold">
            Admin
          </Link>
          <Link href="/stories" className="rounded-full bg-gold px-7 py-3 text-lg font-semibold text-slate-950 shadow-glow">
            Sikiliza Sasa
          </Link>
        </div>
      </div>
    </header>
  );
}
