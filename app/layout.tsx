import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KEPT Prototype",
  description: "A clickable prototype that turns open-trip promises into verifiable proof.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
