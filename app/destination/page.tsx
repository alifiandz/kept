"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, ChevronDown, ImageIcon, MapPin, Search, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, getDestination, getToursForDestination, type Destination } from "@/lib/kept-data";

function NotFound() {
  return <main className="detail-page"><header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><AccountControls /></header><section className="section-wrap empty-state page-empty-state"><h1>Destinasi tidak ditemukan</h1><p>Tautan ini tidak cocok dengan destinasi yang tersedia di Kept.</p><Button asChild><a href="/"><ArrowLeft /> Kembali ke beranda</a></Button></section></main>;
}

export default function DestinationPage() {
  const [destination, setDestination] = useState<Destination | null | undefined>(undefined);
  const [departure, setDeparture] = useState("Semua");
  const [maxPrice, setMaxPrice] = useState("10000000");
  const [minScore, setMinScore] = useState("0");
  const [search, setSearch] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => setDestination(getDestination(new URLSearchParams(window.location.search).get("slug"))), []);

  const tours = useMemo(() => destination ? getToursForDestination(destination.slug) : [], [destination]);
  const departures = useMemo(() => [...new Set(tours.map((tour) => tour.departure))], [tours]);
  const filteredTours = useMemo(() => tours.filter((tour) => {
    const searchable = `${tour.name} ${tour.operator.name}`.toLowerCase();
    return (departure === "Semua" || tour.departure === departure) && tour.price <= Number(maxPrice) && (tour.score ?? 0) >= Number(minScore) && (!search || searchable.includes(search.toLowerCase()));
  }), [tours, departure, maxPrice, minScore, search]);

  if (destination === undefined) return <main className="detail-page"><div className="page-loading" role="status">Memuat destinasi…</div></main>;
  if (!destination) return <NotFound />;
  const lowestPrice = Math.min(...tours.map((tour) => tour.price));

  return <main className="detail-page">
    <header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><nav className="main-nav" aria-label="Navigasi destinasi"><a href="/">Beranda</a><a href="#available">Open Trip</a><a href="#about-place">Tentang Destinasi</a></nav><div className="detail-account-actions"><AccountControls /><Button variant="outline" onClick={() => history.back()}><ArrowLeft /> Kembali</Button></div></header>
    <nav className="detail-mobile-nav" aria-label="Bagian destinasi"><a href="#about-place">Tentang</a><a href="#available">Open Trip</a><a href="/">Beranda</a></nav>

    <section className="destination-hero section-wrap" id="about-place">
      <div className="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/#destinations">Destinasi</a><span>/</span><strong>{destination.name}</strong></div>
      <div className="place-hero"><img src={destination.heroImage} alt={`Pemandangan utama ${destination.name}`} /><div className="place-hero-overlay"><span className="place-eyebrow">{destination.category} · {destination.place}</span><h1>{destination.name}</h1><div className="place-hero-stats"><span><ShieldCheck /> {destination.score}% skor trip selesai</span><span>{tours.length} open trip terkurasi</span><span>Mulai {formatPrice(lowestPrice)}</span></div></div></div>
      <div className="place-intro-grid">
        <article className="place-description-card"><span className="detail-kicker">TENTANG DESTINASI</span><h2>Kenali {destination.name}</h2><p>{destination.longDescription}</p><div className="place-facts">{destination.facts.map((fact) => <div key={fact.label}><small>{fact.label}</small><strong>{fact.value}</strong></div>)}</div></article>
        <aside className="place-gallery-card"><div className="place-gallery-heading"><div><span className="detail-kicker">GALERI</span><h2>Lihat lebih dekat</h2></div><small>Setiap foto menampilkan sudut berbeda</small></div><div className="place-thumbnail-grid">{destination.gallery.map((photo, index) => <button key={photo.src} onClick={() => setSelectedPhoto(index)} aria-label={`Buka foto ${photo.label}`}><img src={photo.src} alt={photo.alt} loading="lazy" /><span>{photo.label}</span></button>)}</div><button className="show-all-photos" onClick={() => setSelectedPhoto(0)}><ImageIcon /> Lihat galeri <ArrowRight /></button></aside>
      </div>
    </section>

    <section className="tour-market section-wrap" id="available">
      <div className="section-heading"><div><span className="section-kicker">OPEN TRIP & REKAM BUKTI</span><h2>Pilih perjalanan ke {destination.name}</h2><p>Bandingkan jadwal mendatang atau periksa bukti perjalanan yang sudah selesai.</p></div><span className="result-count" aria-live="polite">{filteredTours.length} perjalanan ditemukan</span></div>
      <div className="tour-filter-bar">
        <label><Search /><span><small>Cari tour atau operator</small><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama tour atau operator" /></span></label>
        <label><MapPin /><span><small>Berangkat dari</small><select value={departure} onChange={(event) => setDeparture(event.target.value)}><option>Semua</option>{departures.map((item) => <option key={item}>{item}</option>)}</select></span><ChevronDown /></label>
        <label><SlidersHorizontal /><span><small>Harga maksimal</small><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="10000000">Semua harga</option><option value="3000000">Rp3.000.000</option><option value="1500000">Rp1.500.000</option><option value="750000">Rp750.000</option></select></span><ChevronDown /></label>
        <label><ShieldCheck /><span><small>Skor perjalanan</small><select value={minScore} onChange={(event) => setMinScore(event.target.value)}><option value="0">Semua</option><option value="85">85%+</option><option value="90">90%+</option><option value="95">95%+</option></select></span><ChevronDown /></label>
      </div>

      <div className="tour-card-grid">{filteredTours.length ? filteredTours.map((tour) => <article className="tour-market-card" key={tour.slug}>
        <a className="tour-market-image" href={`/tour?slug=${tour.slug}`}><img src={tour.image} alt={`Foto ${tour.name}`} loading="lazy" /><span>{tour.duration}</span></a>
        <div className="tour-market-body"><div className="tour-card-topline"><div className="operator-chip"><BadgeCheck />{tour.operator.name}</div><span className={`tour-state ${tour.status.toLowerCase()}`}>{tour.status}</span></div><h3>{tour.name}</h3><p>{tour.summary}</p><div className="tour-mini-meta"><span><CalendarDays />{tour.date}</span><span><MapPin />Dari {tour.departure}</span><span><Users />Maks. {tour.capacity}</span></div><div className="tour-market-footer"><div><small>{tour.status === "Selesai" ? "Harga tercatat" : "Harga per peserta"}</small><strong>{formatPrice(tour.price)}</strong></div><div><small>{tour.score === null ? "Belum ada hasil" : "Janji dipenuhi"}</small><strong className="kept-score"><ShieldCheck />{tour.score === null ? "—" : `${tour.score}%`}</strong></div></div><a className="full-tour-link" href={`/tour?slug=${tour.slug}`}>{tour.status === "Selesai" ? "Periksa rekam bukti" : "Periksa Promise Card"} <ArrowRight /></a></div>
      </article>) : <div className="empty-state"><h3>Tidak ada perjalanan yang cocok</h3><p>Ubah pencarian atau filter untuk melihat pilihan lain.</p><Button variant="outline" onClick={() => { setSearch(""); setDeparture("Semua"); setMaxPrice("10000000"); setMinScore("0"); }}>Atur ulang filter</Button></div>}</div>
    </section>

    <footer className="site-footer expanded-footer detail-footer"><div className="footer-brand"><span className="brand-mark"><KeptLogo /></span><span><strong>Kept</strong><small>Did they keep their promise?</small></span></div><div className="footer-column"><strong>Jelajahi</strong><a href="/">Beranda</a><a href="#available">Open Trip</a><a href="/account">Dashboard</a></div><div className="footer-column"><strong>Catatan</strong><span>Data perjalanan pada prototype ini adalah data demonstrasi.</span><a href="/credits">Kredit foto</a></div></footer>

    <Dialog open={selectedPhoto !== null} onOpenChange={(open) => !open && setSelectedPhoto(null)}><DialogContent className="gallery-dialog"><DialogHeader><DialogTitle>{selectedPhoto === null ? "Galeri" : destination.gallery[selectedPhoto].label}</DialogTitle><DialogDescription>{destination.name} · foto berlisensi dengan sumber pada halaman kredit.</DialogDescription></DialogHeader>{selectedPhoto !== null && <img src={destination.gallery[selectedPhoto].src} alt={destination.gallery[selectedPhoto].alt} />}<div className="gallery-dialog-actions"><Button variant="outline" disabled={selectedPhoto === 0} onClick={() => setSelectedPhoto((current) => Math.max(0, (current ?? 0) - 1))}><ArrowLeft /> Sebelumnya</Button><Button variant="outline" disabled={selectedPhoto === destination.gallery.length - 1} onClick={() => setSelectedPhoto((current) => Math.min(destination.gallery.length - 1, (current ?? 0) + 1))}>Berikutnya <ArrowRight /></Button></div></DialogContent></Dialog>
  </main>;
}
