export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      <p className="text-sm uppercase tracking-[0.25em] text-platnumGold">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
    </div>
  );
}
