"use client";

import { useState } from "react";

type ResearchResult = {
  title: string;
  category: string;
  short_description: string;
  story_summary: string;
  full_story_text: string;
  narrator_profile_id: string;
  timeline: Array<{
    event_date: string;
    title: string;
    description: string;
  }>;
  sources: Array<{
    source_title: string;
    publisher: string;
    source_url: string;
    notes: string;
  }>;
  quotes: Array<{
    quote: string;
    speaker: string;
    context: string;
  }>;
};

export default function AdminResearchPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleResearch = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/research-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Research failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white">
      <div className="space-y-8 rounded-[2rem] border border-white/10 bg-card p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-platinumGold">
            OpenAI research
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Tafiti story halisi kwa OpenAI
          </h1>
          <p className="mt-3 text-slate-300">
            Andika topic, mfumo utakuletea draft ya story, timeline, sources, na
            narrator suggestion kwa Kiswahili cha Afrika Mashariki.
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
            placeholder="Mfano: The sinking of RMS Titanic in 1912"
            className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-white outline-none"
          />

          <button
            type="button"
            onClick={handleResearch}
            disabled={loading || !topic.trim()}
            className="rounded-full bg-platinumGold px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Inatafiti..." : "Research with OpenAI"}
          </button>

          {error ? <p className="text-red-300">{error}</p> : null}
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Title</p>
              <h2 className="mt-2 text-2xl font-bold">{result.title}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
                <p className="text-sm text-slate-400">Category</p>
                <p className="mt-2 text-white">{result.category}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
                <p className="text-sm text-slate-400">Narrator profile</p>
                <p className="mt-2 text-white">{result.narrator_profile_id}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Short description</p>
              <p className="mt-2 text-white">{result.short_description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Story summary</p>
              <p className="mt-2 text-white">{result.story_summary}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Full story</p>
              <p className="mt-2 whitespace-pre-line text-white">
                {result.full_story_text}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Timeline</p>
              <div className="mt-4 space-y-3">
                {result.timeline.map((item, index) => (
                  <div
                    key={`${item.event_date}-${item.title}-${index}`}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <p className="text-platinumGold">{item.event_date}</p>
                    <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Sources</p>
              <div className="mt-4 space-y-3">
                {result.sources.map((item, index) => (
                  <div
                    key={`${item.source_url}-${index}`}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <h3 className="font-semibold text-white">{item.source_title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.publisher}</p>
                    <p className="mt-2 text-slate-300">{item.notes}</p>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-platinumGold hover:underline"
                    >
                      Open source
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
              <p className="text-sm text-slate-400">Quotes</p>
              <div className="mt-4 space-y-3">
                {result.quotes.map((item, index) => (
                  <div
                    key={`${item.speaker}-${index}`}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <p className="text-white">“{item.quote}”</p>
                    <p className="mt-2 text-sm text-platinumGold">{item.speaker}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}