import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinasi Open Trip",
  description: "Bandingkan jadwal, harga, operator, Promise Card, dan rekam bukti perjalanan untuk destinasi open trip di Kept.",
  alternates: { canonical: "/destination" },
};

export default function DestinationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
