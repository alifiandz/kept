import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Center",
  description: "Kelola perjalanan, Trip Pass, Promise Card, Change Log, dan Reality Check di Kept.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
