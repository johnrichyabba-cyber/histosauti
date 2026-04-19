import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/stories", label: "Stories" },
  { href: "/categories", label: "Categories" },
  { href: "/trending", label: "Trending" },
  { href: "/about", label: "About" },
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-platinumGold">
          HistoSauti
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-white transition hover:text-platinumGold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Search"
            className="flex h-18 w-18 items-center justify-center rounded-full border border-white/10 bg-transparent px-5 py-5 text-white transition hover:border-platinumGold/40 hover:text-platinumGold"
          >
            <SearchIcon />
          </button>

          <Link
            href="/admin"
            className="rounded-full border border-white/10 px-7 py-4 text-lg font-semibold text-white transition hover:border-platinumGold/40 hover:text-platinumGold"
          >
            Admin
          </Link>

          <Link
            href="/stories"
            className="rounded-full bg-platinumGold px-8 py-4 text-lg font-semibold text-black transition hover:scale-[1.02]"
          >
            Sikiliza Sasa
          </Link>
        </div>
      </div>
    </header>
  );
}