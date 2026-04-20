import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "HistoSauti",
  description:
    "Portal ya documentary storytelling ya Kiswahili yenye simulizi za kweli, audio, subtitles, na cinematic experience.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
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