import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KEPT — Find a Trip Worth Trusting",
  description: "Jelajahi open trip melalui janji yang tercatat dan bukti dari peserta terverifikasi.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
