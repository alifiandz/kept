"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, ImageIcon } from "lucide-react";
import { KeptLogo } from "@/components/kept-logo";
import { Button } from "@/components/ui/button";

type Credit = {
  path: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  source?: string;
};

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([]);

  useEffect(() => {
    Promise.all(["/cover-credits.json", "/image-credits.json"].map((url) => fetch(url).then((response) => response.ok ? response.json() : [])))
      .then(([covers, gallery]) => setCredits([...covers, ...gallery]))
      .catch(() => setCredits([]));
  }, []);

  return <main className="credits-page">
    <header className="site-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><Button variant="outline" asChild><a href="/"><ArrowLeft /> Beranda</a></Button></header>
    <section className="section-wrap credits-intro"><span className="section-kicker">TRANSPARANSI ASET</span><h1>Kredit foto</h1><p>Kept menggunakan foto destinasi yang berbeda untuk konteks yang berbeda. Aset disimpan lokal dan dioptimalkan untuk performa; hak cipta tetap milik para kreator.</p></section>
    <section className="section-wrap credits-grid" aria-live="polite">
      {credits.length ? credits.map((credit) => <article key={credit.path}><img src={credit.path} alt="" loading="lazy" /><div><h2>{credit.title}</h2><p>{credit.creator}</p><span>{credit.license}</span><div>{credit.source && <a href={credit.source} target="_blank" rel="noreferrer">Sumber <ExternalLink /></a>}{credit.licenseUrl && <a href={credit.licenseUrl} target="_blank" rel="noreferrer">Lisensi <ExternalLink /></a>}</div></div></article>) : <div className="empty-state"><ImageIcon /><h2>Memuat kredit foto…</h2></div>}
    </section>
  </main>;
}
