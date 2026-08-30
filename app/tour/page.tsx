"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  AtSign,
  BadgeCheck,
  BedDouble,
  BusFront,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  History,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  TicketCheck,
  TriangleAlert,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";

const tourNames: Record<string, { name: string; operator: string; price: string; date: string; rating: number; image: string; description: string }> = {
  "bromo-sunrise-weekend": { name: "Bromo Sunrise Weekend", operator: "Jelajah Aruna", price: "Rp649.000", date: "12–13 September 2026", rating: 94, image: "/bromo.webp", description: "Open trip dua hari dari Malang menuju sunrise Penanjakan, Lautan Pasir, kawah Bromo, dan Bukit Teletubbies." },
  "bromo-midnight-escape": { name: "Bromo Midnight Escape", operator: "Langkah Pagi", price: "Rp475.000", date: "19 September 2026", rating: 90, image: "https://anekatempatwisata.com/wp-content/uploads/2015/07/Gunung-Bromo-Jawa-Timur.jpg", description: "Perjalanan tengah malam dari Surabaya dengan jeep, sunrise, kawah Bromo, dan sarapan setelah perjalanan." },
  "bromo-tumpak-sewu": { name: "Bromo + Tumpak Sewu", operator: "Ruang Jelajah", price: "Rp1.250.000", date: "25–27 September 2026", rating: 91, image: "https://newint.org/sites/default/files/2025-10/pg46a-1_0.jpg", description: "Kombinasi Bromo dan air terjun Tumpak Sewu dalam perjalanan tiga hari dari Malang." },
};

const promises = [
  { icon: WalletCards, title: "Harga final Rp649.000", detail: "Jeep, tiket kawasan, homestay, sarapan, dan pemandu termasuk." },
  { icon: Users, title: "Maksimal 15 peserta", detail: "Kapasitas grup tidak akan melebihi jumlah yang dipromosikan." },
  { icon: BusFront, title: "Minibus ber-AC", detail: "Transportasi pulang-pergi dari meeting point Malang." },
  { icon: BedDouble, title: "2–3 orang per kamar", detail: "Homestay Cemara Indah dengan kamar mandi dalam." },
  { icon: MapPin, title: "Sunrise Point Penanjakan", detail: "Sunrise, Lautan Pasir, kawah, dan Bukit Teletubbies." },
  { icon: ReceiptText, title: "Tanpa biaya wajib tambahan", detail: "Semua biaya wajib ditampilkan sebelum peserta membayar." },
];

const reality = [
  { promise: "Maksimal 15 peserta", reality: "Trip berjalan dengan 14 peserta", status: "Dipenuhi", kind: "kept" },
  { promise: "Minibus ber-AC", reality: "Kendaraan sesuai Promise Snapshot", status: "Dipenuhi", kind: "kept" },
  { promise: "2–3 orang per kamar", reality: "Satu kamar diisi empat peserta", status: "Tidak dipenuhi", kind: "missed" },
  { promise: "Tanpa biaya wajib tambahan", reality: "Tidak ada pungutan tambahan", status: "Dipenuhi", kind: "kept" },
  { promise: "Sunrise Point Penanjakan", reality: "Dialihkan ke Bukit Cinta karena akses ditutup", status: "Berubah transparan", kind: "changed" },
];

export default function TourPage() {
  const [slug, setSlug] = useState("bromo-sunrise-weekend");
  const [passMode, setPassMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("slug") || "bromo-sunrise-weekend");
    setPassMode(params.get("pass") === "1");
  }, []);

  const tour = useMemo(() => tourNames[slug] ?? {
    name: slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    operator: "Jelajah Aruna",
    price: "Rp875.000",
    date: "Oktober 2026",
    rating: 91,
    image: "/bromo.webp",
    description: "Open trip terpilih dengan Promise Snapshot dan hasil perjalanan yang dapat diperiksa.",
  }, [slug]);

  return <main className="detail-page tour-detail-page">
    <header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><nav className="main-nav"><a href="#overview">Ringkasan</a><a href="#promise">Promise</a><a href="#changes">Perubahan</a><a href="#reality">Hasil</a></nav><div className="detail-account-actions"><AccountControls /><Button variant="outline" onClick={() => history.back()}><ArrowLeft /> Kembali</Button></div></header>

    {passMode && <div className="trip-pass-banner"><TicketCheck /><span><strong>Trip Pass #BRM-2409-017 terverifikasi</strong>Kamu dapat melihat janji trip dan mengisi Reality Check setelah perjalanan.</span></div>}

    <section className="tour-detail-hero section-wrap" id="overview">
      <div className="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/destination?slug=gunung-bromo">Gunung Bromo</a><span>/</span><strong>{tour.name}</strong></div>
      <div className="tour-detail-grid">
        <div className="tour-detail-copy"><span className="detail-kicker">OPEN TRIP · 2H1M</span><h1>{tour.name}</h1><p>{tour.description}</p><div className="tour-detail-meta"><span><CalendarDays />{tour.date}</span><span><MapPin />Meeting point Malang</span><span><Users />Maksimal 15 peserta</span><span><Clock3 />Berangkat 23.30 WIB</span></div><div className="tour-price-row"><div><small>Harga per peserta</small><strong>{tour.price}</strong></div><div><small>Rating KEPT</small><strong className="kept-score"><ShieldCheck />{tour.rating}%</strong></div></div></div>
        <div className="tour-visual-panel"><img src={tour.image} alt={tour.name} /><div className="operator-profile-inline"><div className="operator-avatar">JA</div><div><small>OPERATOR</small><strong>{tour.operator}</strong><span><BadgeCheck /> Integrity Profile aktif</span></div><a href="#reality">Lihat rekam jejak</a></div></div>
      </div>
    </section>

    <section className="promise-section section-wrap" id="promise">
      <div className="section-heading"><div><span className="section-kicker">SEBELUM PESERTA MEMBAYAR</span><h2>Promise Snapshot</h2><p>Versi final janji yang dipublikasikan dan tidak dapat diubah diam-diam.</p></div><div className="snapshot-lock"><FileCheck2 /><span><strong>Terkunci · v1.0</strong><small>20 Agustus 2026, 14.32 WIB</small></span></div></div>
      <div className="promise-detail-grid">{promises.map(({ icon: Icon, title, detail }) => <article key={title}><Icon /><div><h3>{title}</h3><p>{detail}</p></div><CheckCircle2 /></article>)}</div>
    </section>

    <section className="change-detail-section" id="changes"><div className="section-wrap"><div className="section-heading"><div><span className="section-kicker light">SAAT RENCANA BERUBAH</span><h2>Change Log</h2><p>Alasan dan pengganti ditampilkan agar perubahan dapat dinilai secara adil.</p></div><span className="change-badge">1 perubahan tercatat</span></div><article className="change-detail-card"><div className="change-time"><strong>13 SEP</strong><span>03.18 WIB</span></div><div><span className="status-tag changed"><History />Berubah transparan</span><h3>Sunrise Point Penanjakan dialihkan ke Bukit Cinta</h3><p>Akses Penanjakan ditutup petugas karena longsor ringan. Operator memberi tahu peserta sebelum jeep berangkat dan menyediakan lokasi pengganti dengan waktu sunrise yang sama.</p></div><div className="change-evidence"><small>BUKTI OPERATOR</small><strong>Foto penutupan akses</strong><strong>Pesan pemberitahuan</strong><strong>Lokasi pengganti</strong></div></article></div></section>

    <section className="reality-report section-wrap" id="reality">
      <div className="section-heading"><div><span className="section-kicker">SETELAH PERJALANAN</span><h2>Promise vs Reality</h2><p>Dikonfirmasi oleh peserta yang benar-benar mengikuti perjalanan ini.</p></div><div className="verified-participants"><Users /><span><strong>17 peserta</strong><small>terverifikasi</small></span></div></div>
      <div className="integrity-summary"><div className="score-circle"><strong>{tour.rating}%</strong><span>JANJI<br />DIPENUHI</span></div><div><span>HASIL INTEGRITAS</span><h3>Mayoritas janji dipenuhi</h3><p>Tingkat keyakinan bukti: <strong>Tinggi</strong></p></div><div className="summary-breakdown"><span><i className="kept-dot" /><strong>80%</strong> Dipenuhi</span><span><i className="changed-dot" /><strong>20%</strong> Berubah transparan</span><span><i className="missed-dot" /><strong>0%</strong> Tanpa penjelasan</span></div></div>
      <div className="reality-table">{reality.map((item) => <article key={item.promise}><div><strong>{item.promise}</strong><span>{item.reality}</span></div><span className={`status-tag ${item.kind}`}>{item.kind === "kept" ? <CheckCircle2 /> : item.kind === "changed" ? <History /> : <TriangleAlert />}{item.status}</span></article>)}</div>
    </section>

    <section className="tour-bottom-cta section-wrap"><div><ShieldCheck /><span><strong>Ingin mengikuti trip ini?</strong><small>KEPT tidak memproses booking. Lanjutkan ke operator setelah memeriksa semua bukti.</small></span></div><Button>Hubungi Operator</Button></section>

    <footer className="site-footer expanded-footer detail-footer"><div className="footer-brand"><span className="brand-mark"><KeptLogo /></span><span><strong>Kept</strong><small>Did they keep their promise?</small></span></div><div className="footer-column"><strong>Jelajahi</strong><a href="/">Beranda</a><a href="/destination?slug=gunung-bromo">Gunung Bromo</a><a href="#promise">Promise Snapshot</a></div><div className="footer-column"><strong>Hubungi Kami</strong><a href="mailto:hello@kept.id"><Mail />hello@kept.id</a><a href="tel:+6281234567890"><Phone />+62 812-3456-7890</a><a href="/"><AtSign />@kept.id</a></div></footer>
  </main>;
}
