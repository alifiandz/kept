import type { Metadata } from "next";
import { CompetitionLogos } from "@/components/competition-logos";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kept.my.id"),
  title: { default: "Kept — Open Trip yang Bisa Diperiksa", template: "%s · Kept" },
  description: "Bandingkan open trip melalui Promise Card, Change Log, dan Reality Check dari peserta terverifikasi.",
  icons: { icon: "/kept-logo.png", shortcut: "/kept-logo.png", apple: "/kept-logo.png" },
  openGraph: { title: "Kept — Open Trip yang Bisa Diperiksa", description: "Lihat janji operator sebelum berangkat dan periksa kenyataannya setelah perjalanan.", url: "https://kept.my.id", siteName: "Kept", locale: "id_ID", type: "website", images: [{ url: "/destinations/gunung-bromo/01.webp", width: 1200, height: 630, alt: "Kept — Promise versus Reality untuk open trip" }] },
  twitter: { card: "summary_large_image", title: "Kept — Open Trip yang Bisa Diperiksa", description: "Promise Card, Change Log, Reality Check, dan Truth Guard untuk open trip.", images: ["/destinations/gunung-bromo/01.webp"] },
  category: "travel",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}<CompetitionLogos /></body></html>;
}
