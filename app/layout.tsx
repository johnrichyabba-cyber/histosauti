import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "HistoSauti",
  description:
    "Portal ya documentary storytelling ya Kiswahili yenye true stories, narration, subtitles, na cinematic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}