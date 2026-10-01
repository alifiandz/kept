"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft, BadgeCheck, CalendarDays, Check, CheckCircle2, Clock3, Copy, FileCheck2,
  History, LockKeyhole, MapPin, MessageCircle, ShieldCheck,
  TicketCheck, TriangleAlert, Upload, Users,
} from "lucide-react";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, getDestination, getTour, type Tour } from "@/lib/kept-data";
import { readKeptUser } from "@/lib/kept-account";

function NotFound() {
  return <main className="detail-page"><header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><AccountControls /></header><section className="section-wrap empty-state page-empty-state"><h1>Perjalanan tidak ditemukan</h1><p>Kept tidak membuat data pengganti untuk tautan perjalanan yang tidak valid.</p><Button asChild><a href="/"><ArrowLeft /> Kembali ke beranda</a></Button></section></main>;
}

export default function TourPage() {
  const [tour, setTour] = useState<Tour | null | undefined>(undefined);
  const [passMode, setPassMode] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [realityOpen, setRealityOpen] = useState(false);
  const [realitySubmitted, setRealitySubmitted] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const [demoChanges, setDemoChanges] = useState<Array<{ title: string; tour: string; reason: string; replacement: string; recordedAt: string; evidence: string }>>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchedTour = getTour(params.get("slug"));
    setTour(matchedTour);
    const requestedPass = params.get("pass");
    const validPass = Boolean(matchedTour?.tripPassCode && requestedPass === matchedTour.tripPassCode);
    setInvalidPass(Boolean(requestedPass && !validPass));
    if (matchedTour && window.localStorage.getItem(`kept-reality-${matchedTour.slug}`)) setRealitySubmitted(true);
    if (matchedTour) {
      try {
        const storedChanges = JSON.parse(window.localStorage.getItem("kept-demo-changes") || "[]");
        setDemoChanges(Array.isArray(storedChanges) ? storedChanges.filter((item) => item.tour === matchedTour.slug) : []);
      } catch {
        setDemoChanges([]);
      }
    }
    if (validPass && !readKeptUser()) {
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "login", redirect: window.location.pathname + window.location.search } })), 0);
    } else setPassMode(validPass);
  }, []);

  if (tour === undefined) return <main className="detail-page"><div className="page-loading" role="status">Memuat perjalanan…</div></main>;
  if (!tour) return <NotFound />;

  const destination = getDestination(tour.destinationSlug)!;
  const completed = tour.status === "Selesai";
  const score = tour.score ?? 0;
  const changedCount = tour.reality.filter((item) => item.kind === "changed").length;
  const keptCount = tour.reality.filter((item) => item.kind === "kept").length;
  const missedCount = tour.reality.filter((item) => item.kind === "missed").length;
  const total = tour.reality.length || 1;
  const changeCount = tour.changes.length + demoChanges.length;
  const contactMessage = `Halo ${tour.operator.name}, saya sudah memeriksa Promise Card ${tour.name} di Kept dan ingin menanyakan ketersediaan peserta.`;

  const submitReality = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = tour.promises.map((promise, index) => ({ promise: promise.title, outcome: data.get(`promise-${index}`) }));
    window.localStorage.setItem(`kept-reality-${tour.slug}`, JSON.stringify({ result, note: data.get("reality-note"), evidence: data.get("reality-evidence") instanceof File ? (data.get("reality-evidence") as File).name : "" }));
    setRealitySubmitted(true);
    setRealityOpen(false);
  };

  return <main className="detail-page tour-detail-page">
    <header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><nav className="main-nav" aria-label="Navigasi perjalanan"><a href="#overview">Ringkasan</a><a href="#promise">Promise Card</a><a href="#changes">Change Log</a><a href="#reality">Reality Check</a></nav><div className="detail-account-actions"><AccountControls /><Button variant="outline" onClick={() => history.back()}><ArrowLeft /> Kembali</Button></div></header>
    <nav className="detail-mobile-nav" aria-label="Bagian perjalanan"><a href="#overview">Ringkasan</a><a href="#promise">Promise Card</a><a href="#changes">Change Log</a><a href="#reality">Reality Check</a></nav>

    {invalidPass && <div className="trip-pass-banner invalid"><TriangleAlert /><span><strong>Trip Pass tidak cocok</strong>Kode ini tidak terhubung dengan perjalanan yang sedang dibuka.</span></div>}
    {passMode && <div className="trip-pass-banner"><TicketCheck /><span><strong>{realitySubmitted ? "Reality Check berhasil dikirim" : `Trip Pass ${tour.tripPassCode} dikenali`}</strong>{realitySubmitted ? "Jawaban demo tersimpan pada perangkat ini." : "Mode prototype: kode cocok dengan perjalanan dan akun demo ini."}</span>{completed && !realitySubmitted && <Button onClick={() => setRealityOpen(true)}>Isi Reality Check</Button>}</div>}

    <section className="tour-detail-hero section-wrap" id="overview">
      <div className="breadcrumb"><a href="/">Beranda</a><span>/</span><a href={`/destination?slug=${destination.slug}`}>{destination.name}</a><span>/</span><strong>{tour.name}</strong></div>
      <div className="tour-detail-grid">
        <div className="tour-detail-copy"><span className="detail-kicker">OPEN TRIP {tour.status.toUpperCase()} · {completed ? "BUKTI TERSEDIA" : "JANJI TERKUNCI"}</span><h1>{tour.name}</h1><p>{tour.summary}</p><div className="tour-detail-meta"><span><CalendarDays />{tour.date}</span><span><MapPin />{tour.meetingPoint}</span><span><Users />Maksimal {tour.capacity} peserta</span><span><Clock3 />{tour.departureTime}</span></div><div className="tour-price-row"><div><small>Harga per peserta</small><strong>{formatPrice(tour.price)}</strong></div><div><small>{completed ? "Truth Score" : "Truth Score"}</small><strong className="kept-score"><ShieldCheck />{completed ? `${score}%` : "Menunggu hasil"}</strong></div></div></div>
        <div className="tour-visual-panel"><img src={tour.image} alt={`Foto ${tour.name}`} /><div className="operator-profile-inline"><div className="operator-avatar">{tour.operator.initials}</div><div><small>OPERATOR</small><strong>{tour.operator.name}</strong><span><BadgeCheck />{tour.operator.verified ? " Identitas operator terverifikasi" : " Verifikasi tertunda"}</span></div><a href="#truth-guard">Lihat pemeriksaan</a></div></div>
      </div>
    </section>

    <section className="promise-section section-wrap" id="promise">
      <div className="section-heading"><div><span className="section-kicker">SEBELUM PESERTA MENGHUBUNGI OPERATOR</span><h2>Promise Card</h2><p>Versi janji yang dikunci agar perubahan tidak dapat disembunyikan.</p></div><div className="snapshot-lock"><FileCheck2 /><span><strong>Terkunci · {tour.promiseVersion}</strong><small>{tour.promiseLockedAt}</small></span></div></div>
      <div className="promise-detail-grid">{tour.promises.map((promise) => <article key={promise.title}><LockKeyhole /><div><h3>{promise.title}</h3><p>{promise.detail}</p></div><CheckCircle2 /></article>)}</div>
    </section>

    <section className="change-detail-section" id="changes"><div className="section-wrap"><div className="section-heading"><div><span className="section-kicker light">SAAT RENCANA BERUBAH</span><h2>Change Log</h2><p>Perubahan harus memiliki alasan, waktu pemberitahuan, pengganti, dan bukti.</p></div><span className="change-badge">{changeCount} perubahan tercatat</span></div>{changeCount ? <>{tour.changes.map((change) => <article className="change-detail-card" key={change.title}><div className="change-time"><strong>CATATAN</strong><span>{change.recordedAt}</span></div><div><span className="status-tag changed"><History />Berubah transparan</span><h3>{change.title}</h3><p>{change.explanation}</p></div><div className="change-evidence"><small>BUKTI OPERATOR</small>{change.evidence.map((item) => <strong key={item}>{item}</strong>)}</div></article>)}{demoChanges.map((change, index) => <article className="change-detail-card" key={`${change.title}-${index}`}><div className="change-time"><strong>DEMO TERSIMPAN</strong><span>{change.recordedAt || "Waktu tercatat"}</span></div><div><span className="status-tag changed"><History />Menunggu konfirmasi peserta</span><h3>{change.title}</h3><p>{change.reason} Pengganti yang diberikan: {change.replacement}</p></div><div className="change-evidence"><small>NAMA BUKTI</small><strong>{change.evidence || "Belum ada bukti"}</strong></div></article>)}</> : <div className="empty-state dark-empty"><CheckCircle2 /><h3>Belum ada perubahan</h3><p>Jika operator mengubah janji, catatannya akan tampil di sini dan tidak menggantikan versi awal.</p></div>}</div></section>

    <section className="reality-report section-wrap" id="reality">
      <div className="section-heading"><div><span className="section-kicker">SETELAH PERJALANAN</span><h2>Promise vs Reality</h2><p>Hanya peserta dengan Trip Pass perjalanan ini yang dapat mengirim Reality Check.</p></div><div className="verified-participants"><Users /><span><strong>{tour.verifiedParticipants} peserta</strong><small>terverifikasi</small></span></div></div>
      {completed ? <><div className="integrity-summary"><div className="score-circle"><strong>{score}%</strong><span>TRUTH<br />SCORE</span></div><div><span>HASIL INTEGRITAS</span><h3>{missedCount ? "Ada janji yang perlu ditinjau" : "Mayoritas janji dipenuhi"}</h3><p>Tingkat keyakinan bukti: <strong>{tour.verifiedParticipants >= 8 ? "Tinggi" : "Sedang"}</strong></p><small>Skor demo merangkum konfirmasi peserta per janji. Perubahan transparan dinilai dari pemberitahuan, bukti, dan penerimaan pengganti—bukan rating kepuasan.</small></div><div className="summary-breakdown"><span><i className="kept-dot" /><strong>{Math.round(keptCount / total * 100)}%</strong> Dipenuhi</span><span><i className="changed-dot" /><strong>{Math.round(changedCount / total * 100)}%</strong> Berubah transparan</span><span><i className="missed-dot" /><strong>{Math.round(missedCount / total * 100)}%</strong> Tidak dipenuhi</span></div></div><div className="reality-table">{tour.reality.map((item) => <article key={item.promise}><div><strong>{item.promise}</strong><span>{item.reality}</span></div><span className={`status-tag ${item.kind}`}>{item.kind === "kept" ? <CheckCircle2 /> : item.kind === "changed" ? <History /> : <TriangleAlert />}{item.status}</span></article>)}</div></> : <div className="empty-state"><TicketCheck /><h3>Reality Check belum dibuka</h3><p>Hasil tidak akan ditampilkan sebelum perjalanan selesai dan peserta terverifikasi mengirim konfirmasi.</p></div>}
    </section>

    <section className="truth-guard-section section-wrap" id="truth-guard"><div className="section-heading"><div><span className="section-kicker">LAPISAN KEPERCAYAAN</span><h2>Truth Guard</h2><p>Truth Guard menjelaskan sinyal yang dipakai Kept—bukan sekadar menampilkan angka.</p></div></div><div className="truth-guard-grid"><article><BadgeCheck /><h3>Identitas operator</h3><p>{tour.operator.verified ? "Nama dan kontak operator cocok dengan profil yang diperiksa." : "Pemeriksaan operator belum selesai."}</p></article><article><LockKeyhole /><h3>Versi janji terkunci</h3><p>Promise Card {tour.promiseVersion} tetap tersedia meskipun terjadi perubahan.</p></article><article><TicketCheck /><h3>Peserta terverifikasi</h3><p>{completed ? `${tour.verifiedParticipants} Trip Pass cocok dengan daftar perjalanan.` : "Verifikasi peserta dimulai setelah manifest ditutup."}</p></article><article><ShieldCheck /><h3>Status skor</h3><p>{completed ? `Skor ${score}% dihitung dari Reality Check dan perubahan yang tercatat.` : "Belum ada skor karena perjalanan belum selesai."}</p></article></div></section>

    <section className="tour-bottom-cta section-wrap"><div><ShieldCheck /><span><strong>Sudah yakin setelah memeriksa bukti?</strong><small>Kept tidak memproses booking atau pembayaran. Pendaftaran dilakukan langsung dengan operator.</small></span></div><Button onClick={() => setContactOpen(true)}>Hubungi Operator</Button></section>

    <footer className="site-footer expanded-footer detail-footer"><div className="footer-brand"><span className="brand-mark"><KeptLogo /></span><span><strong>Kept</strong><small>Did they keep their promise?</small></span></div><div className="footer-column"><strong>Jelajahi</strong><a href="/">Beranda</a><a href={`/destination?slug=${destination.slug}`}>{destination.name}</a><a href="#promise">Promise Card</a></div><div className="footer-column"><strong>Catatan</strong><span>Data perjalanan pada prototype ini adalah data demonstrasi.</span><a href="/credits">Kredit foto</a></div></footer>

    <Dialog open={contactOpen} onOpenChange={setContactOpen}><DialogContent className="contact-operator-dialog"><DialogHeader><span className="dialog-kicker"><MessageCircle /> HUBUNGI OPERATOR</span><DialogTitle>Hubungi {tour.operator.name}</DialogTitle><DialogDescription>Kept membantu kamu memeriksa janji dan bukti. Booking dan pembayaran tetap dilakukan langsung dengan operator.</DialogDescription></DialogHeader><div className="operator-contact-card"><div className="operator-avatar">{tour.operator.initials}</div><div><strong>{tour.operator.name}</strong><span><BadgeCheck /> Profil operator demo</span></div></div><div className="contact-message-preview"><small>PESAN YANG DISIAPKAN</small><p>{contactMessage}</p></div><p className="prototype-contact-note">Kontak pada dataset ini adalah data demonstrasi, jadi Kept tidak akan mengirim pesan ke pihak luar.</p><DialogFooter><Button variant="outline" onClick={async () => { await navigator.clipboard.writeText(contactMessage); setMessageCopied(true); }}><Copy /> {messageCopied ? "Pesan tersalin" : "Salin pesan"}</Button><Button disabled>Kontak langsung saat data operator aktif</Button></DialogFooter></DialogContent></Dialog>

    <Dialog open={realityOpen} onOpenChange={setRealityOpen}><DialogContent className="reality-check-dialog"><DialogHeader><span className="dialog-kicker"><TicketCheck /> REALITY CHECK</span><DialogTitle>Cocokkan setiap janji</DialogTitle><DialogDescription>Pilih hasil untuk seluruh Promise Card. Jawaban negatif tetap dapat dikirim dan tidak akan diubah oleh operator.</DialogDescription></DialogHeader><form className="reality-check-form" onSubmit={submitReality}>{tour.promises.map((promise, index) => <fieldset className="reality-outcome" key={promise.title}><legend>{promise.title}</legend><label><input type="radio" name={`promise-${index}`} value="fulfilled" required /> Dipenuhi</label><label><input type="radio" name={`promise-${index}`} value="changed" required /> Berubah, tetapi dijelaskan</label><label><input type="radio" name={`promise-${index}`} value="missed" required /> Tidak dipenuhi</label></fieldset>)}<label htmlFor="reality-note">Catatan tambahan<textarea name="reality-note" id="reality-note" placeholder="Jelaskan perubahan atau hal yang perlu diperiksa (opsional)" /></label><label className="reality-evidence" htmlFor="reality-evidence"><Upload /> Bukti pendukung (opsional)<input name="reality-evidence" id="reality-evidence" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" /></label><DialogFooter><Button variant="outline" type="button" onClick={() => setRealityOpen(false)}>Batal</Button><Button type="submit"><Check /> Kirim Reality Check</Button></DialogFooter></form></DialogContent></Dialog>
  </main>;
}
