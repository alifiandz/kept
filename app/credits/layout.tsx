import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kredit Foto",
  description: "Sumber, kreator, dan lisensi foto yang digunakan dalam prototype Kept.",
  alternates: { canonical: "/credits" },
};

export default function CreditsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
