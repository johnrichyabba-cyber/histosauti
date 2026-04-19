import Link from "next/link";

const trendingStories = [
  {
    id: "trend-1",
    title: "Titanic: Safari Iliyoishia Kwenye Giza la Bahari",
    slug: "titanic-1912",
    category: "Disasters",
    duration: "12 min",
    summary:
      "Kutoka kuondoka Southampton hadi kugonga barafu usiku wa Aprili 1912, hii ni hadithi ya matumaini, hofu, na maamuzi ya sekunde chache yaliyobadili maisha ya maelfu.",
  },
  {
    id: "trend-2",
    title: "Princess Diana: Usiku wa Mwisho Uliobadili Dunia",
    slug: "princess-diana-final-night",
    category: "Biography",
    duration: "10 min",
    summary:
      "Simulizi ya saa za mwisho za Princess Diana huko Paris, tukio lililotikisa dunia na kubadili mazungumzo kuhusu vyombo vya habari, faragha, na uwajibikaji.",
  },
  {
    id: "trend-3",
    title: "Chunguza Simulizi Zote za HistoSauti",
    slug: "",
    category: "Collection",
    duration: "Explore",
    summary:
      "Tazama mkusanyiko mzima wa simulizi za kweli za kihistoria, zikiwa na narration ya Kiswahili, subtitle, picha, na cinematic experience.",
  },
];

export default function TrendingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-white lg:px-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-platinumGold">
          Trending
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Simulizi zinazovuma sasa
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Hapa ndipo unapata simulizi zinazovutia wasikilizaji wengi kwa sasa.
          Tumeweka mchanganyiko wa true stories zenye hisia, historia, ushahidi,
          na documentary storytelling ya Kiswahili.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {trendingStories.map((story) => {
          const href = story.slug ? `/stories/${story.slug}` : "/stories";

          return (
            <Link
              key={story.id}
              href={href}
              className="group rounded-[2rem] border border-white/10 bg-card p-6 transition hover:-translate-y-1 hover:border-platinumGold/30"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-platinumGold/10 px-3 py-1 text-sm text-platinumGold">
                  {story.category}
                </span>
                <span className="text-sm text-slate-400">{story.duration}</span>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white group-hover:text-platinumGold">
                {story.title}
              </h2>

              <p className="mt-4 text-slate-300">{story.summary}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-400">HistoSauti</span>
                <span className="text-sm font-semibold text-platinumGold">
                  Fungua →
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-background/40 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
              Explore more
            </p>
            <h2 className="mt-3 text-3xl font-bold">Endelea kusikiliza zaidi</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Fungua stories zote, categories tofauti, au ingia admin kuongeza
              simulizi mpya kwa portal yako.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/stories"
              className="rounded-full bg-platinumGold px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Tazama stories zote
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-platinumGold/30 hover:text-platinumGold"
            >
              Fungua admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}