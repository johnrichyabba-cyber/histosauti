import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B14",
        card: "#0F172A",
        platnumGold: "#D6BE8A",
        gold: "#D6BE8A",
        muted: "#94A3B8",
        border: "rgba(255,255,255,0.08)",
        surface: "#111827",
        surfaceAlt: "#0B1220"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)",
        glow: "0 0 0 1px rgba(214,190,138,0.15), 0 18px 40px rgba(0,0,0,0.28)"
      },
      backgroundImage: {
        hero: "linear-gradient(180deg, rgba(7,11,20,0.32) 0%, rgba(7,11,20,0.88) 72%), url('https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1600&q=80')",
        platinumGlow:
          "radial-gradient(circle at top, rgba(214,190,138,0.20), transparent 40%), radial-gradient(circle at bottom right, rgba(214,190,138,0.10), transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
