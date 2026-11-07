/* eslint-disable @next/next/no-img-element -- official transparent logos are already optimized and must retain exact artwork */
const partners = [
  { src: "/partners/jhic-2.png", alt: "Jagoan Hosting Innovation Competition 2.0" },
  { src: "/partners/jagoan-hosting.png", alt: "Jagoan Hosting" },
  { src: "/partners/komdigi.png", alt: "Kementerian Komunikasi dan Digital Republik Indonesia" },
  { src: "/partners/garuda-spark.png", alt: "Garuda Spark Innovation Hub" },
  { src: "/partners/ngalup.png", alt: "Ngalup" },
];

export function CompetitionLogos() {
  return <aside className="competition-partners" aria-label="Penyelenggara dan pendukung JHIC 2.0"><div className="section-wrap"><p>Dikembangkan untuk JHIC 2.0 · Team Knot — SMA LHI</p><div>{partners.map((partner) => <img key={partner.src} src={partner.src} alt={partner.alt} loading="lazy" />)}</div></div></aside>;
}
