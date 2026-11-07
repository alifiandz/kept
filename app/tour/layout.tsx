import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Open Trip & Bukti",
  description: "Periksa Promise Card, Change Log, Reality Check, dan Truth Guard sebuah open trip sebelum menghubungi operator.",
  alternates: { canonical: "/tour" },
};

export default function TourLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
