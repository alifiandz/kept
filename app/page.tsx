"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Compass,
  FileCheck2,
  GitCompareArrows,
  Heart,
  History,
  KeyRound,
  LockKeyhole,
  MapPin,
  Menu,
  Mountain,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  TicketCheck,
  TreePalm,
  Users,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SearchMode = "trips" | "operator" | "compare" | "pass";
type Trip = {
  id: number;
  title: string;
  operator: string;
  image: string;
  location: string;
  duration: string;
  date: string;
  price: string;
  description: string;
  score: number;
  verified: number;
  changed: number;
  unresolved: number;
  tags: string[];
  promises: string[];
};

const searchModes: { id: SearchMode; label: string; helper: string; icon: typeof Search }[] = [
  { id: "trips", label: "Cari Open Trip", helper: "Jelajahi trip dengan bukti", icon: Compass },
  { id: "operator", label: "Cek Operator", helper: "Lihat rekam jejak operator", icon: ShieldCheck },
  { id: "compare", label: "Bandingkan", helper: "Bandingkan bukti trip", icon: GitCompareArrows },
  { id: "pass", label: "Trip Pass Saya", helper: "Akses trip yang kamu ikuti", icon: TicketCheck },
];

const trips: Trip[] = [
  {
    id: 1,
    title: "Bromo Sunrise Weekend",
    operator: "Jelajah Aruna",
    image: "/bromo.webp",
    location: "Bromo, Jawa Timur",
    duration: "2H1M",
    date: "12–13 Sep 2026",
    price: "Rp649.000",
    description: "Sunrise, Lautan Pasir, dan Bukit Teletubbies dari meeting point Malang.",
    score: 92,
    verified: 17,
    changed: 1,
    unresolved: 0,
    tags: ["Gunung", "Weekend"],
    promises: ["Maksimal 15 peserta", "Minibus AC", "2–3 orang per kamar", "Tanpa biaya wajib tambahan"],
  },
  {
    id: 2,
    title: "Labuan Bajo Sailing 3D2N",
    operator: "Nusa Sail",
    image: "/labuan-bajo.webp",
    location: "Labuan Bajo, NTT",
    duration: "3H2M",
    date: "18–20 Sep 2026",
    price: "Rp2.850.000",
    description: "Liveaboard bersama ke Pulau Padar, Pink Beach, dan Manta Point.",
    score: 96,
    verified: 24,
    changed: 0,
    unresolved: 0,
    tags: ["Laut & Pulau", "Petualangan"],
    promises: ["Kapal kabin AC", "Maksimal 12 peserta", "Makan 7 kali", "Dokumentasi drone termasuk"],
  },
  {
    id: 3,
    title: "Dieng Golden Sunrise",
    operator: "Langkah Pagi",
    image: "/dieng.webp",
    location: "Dieng, Jawa Tengah",
    duration: "2H1M",
    date: "26–27 Sep 2026",
    price: "Rp475.000",
    description: "Sikunir, Telaga Warna, dan kompleks candi dengan keberangkatan dari Yogyakarta.",
    score: 88,
    verified: 13,
    changed: 1,
    unresolved: 1,
    tags: ["Alam", "Budaya"],
    promises: ["Bus pariwisata AC", "Homestay 3 orang per kamar", "Tiket wisata termasuk", "Pemandu lokal"],
  },
];

const categories = [
  { label: "Semua", icon: Sparkles },
  { label: "Gunung", icon: Mountain },
  { label: "Laut & Pulau", icon: Waves },
  { label: "Alam", icon: TreePalm },
  { label: "Petualangan", icon: Compass },
];

export default function Home() {
  const [mode, setMode] = useState<SearchMode>("trips");
  const [category, setCategory] = useState("Semua");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<number[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const filteredTrips = useMemo(() => {
    if (category === "Semua") return trips;
    return trips.filter((trip) => trip.tags.includes(category));
  }, [category]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messages: Record<SearchMode, string> = {
      trips: "3 open trip dengan Promise Snapshot ditemukan.",
      operator: "Integrity Profile operator siap diperiksa.",
      compare: "Perbandingan bukti kedua trip berhasil dibuat.",
      pass: "Trip Pass ditemukan. Kamu dapat melihat Promise Snapshot trip ini.",
    };
    setResultMessage(messages[mode]);
    document.getElementById("recommended")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSaved = (tripId: number) => {
    setSavedTrips((current) => current.includes(tripId) ? current.filter((id) => id !== tripId) : [...current, tripId]);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KEPT home">
          <span className="brand-mark"><Check aria-hidden="true" /></span>
          <span>KEPT</span>
        </a>

        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="Navigasi utama">
          <a href="#recommended" onClick={() => setMobileOpen(false)}>Explore Trips</a>
          <a href="#operators" onClick={() => setMobileOpen(false)}>Operators</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>Cara Kerja</a>
          <a href="#for-operators" onClick={() => setMobileOpen(false)}>Untuk Operator</a>
        </nav>

        <div className="header-actions">
          <button className="saved-button" aria-label="Trip tersimpan"><Heart /> <span>Tersimpan</span>{savedTrips.length > 0 && <b>{savedTrips.length}</b>}</button>
          <Button variant="ghost" className="login-button">Masuk</Button>
          <Button className="signup-button">Daftar</Button>
          <button className="menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label="Buka menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow"><ShieldCheck /> BUKTI SEBELUM KAMU PERCAYA</span>
          <h1>Temukan trip yang<br />layak dipercaya.</h1>
          <p>Jelajahi open trip berdasarkan janji yang tercatat dan bukti dari peserta terverifikasi.</p>
        </div>

        <div className="search-shell">
          <div className="mode-tabs" role="tablist" aria-label="Pilihan layanan KEPT">
            {searchModes.map(({ id, label, helper, icon: Icon }) => (
              <button key={id} className={mode === id ? "mode-tab active" : "mode-tab"} onClick={() => { setMode(id); setResultMessage(""); }} role="tab" aria-selected={mode === id}>
                <span className="mode-icon"><Icon /></span>
                <span><strong>{label}</strong><small>{helper}</small></span>
              </button>
            ))}
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            {mode === "trips" && (
              <>
                <SearchField label="Mau ke mana?" value="Bromo, Jawa Timur" icon={MapPin} />
                <SearchField label="Berangkat dari" value="Malang" icon={Compass} />
                <SearchField label="Tanggal trip" value="12–13 Sep 2026" icon={CalendarDays} />
                <SearchField label="Peserta" value="2 orang" icon={Users} />
                <Button className="search-button" type="submit"><Search /> Cari Trip</Button>
              </>
            )}
            {mode === "operator" && (
              <>
                <SearchField label="Nama operator" value="Jelajah Aruna" icon={ShieldCheck} wide />
                <SearchField label="Akun atau tautan sosial" value="@jelajaharuna" icon={CircleUserRound} wide />
                <Button className="search-button" type="submit"><Search /> Cek Operator</Button>
              </>
            )}
            {mode === "compare" && (
              <>
                <SearchField label="Trip pertama" value="Bromo Sunrise" icon={Mountain} wide />
                <SearchField label="Trip kedua" value="Dieng Golden Sunrise" icon={Mountain} wide />
                <Button className="search-button" type="submit"><GitCompareArrows /> Bandingkan</Button>
              </>
            )}
            {mode === "pass" && (
              <>
                <SearchField label="Kode Trip Pass" value="BRM-2409-017" icon={KeyRound} wide />
                <div className="pass-note"><LockKeyhole /><span>Trip Pass hanya dapat digunakan oleh peserta yang terdaftar.</span></div>
                <Button className="search-button" type="submit"><TicketCheck /> Buka Trip Pass</Button>
              </>
            )}
          </form>
        </div>
      </section>

      <section className="category-section" aria-label="Kategori trip">
        <div className="category-row">
          {categories.map(({ label, icon: Icon }) => (
            <button key={label} className={category === label ? "category-chip active" : "category-chip"} onClick={() => setCategory(label)}><Icon />{label}</button>
          ))}
        </div>
        <div className="trust-prompt"><BadgeCheck /><span><strong>Semua trip di halaman ini punya Promise Snapshot.</strong> Kamu melihat janji sebelum melihat rating.</span></div>
      </section>

      <section className="recommended section-wrap" id="recommended">
        <div className="section-heading">
          <div><span className="section-kicker">PILIHAN TERVERIFIKASI</span><h2>Open trip yang bisa kamu periksa</h2><p>Bukan sekadar foto bagus—setiap pilihan punya janji, perubahan, dan bukti yang bisa dilihat.</p></div>
          <button className="view-all">Lihat semua trip <ArrowRight /></button>
        </div>

        {resultMessage && <div className="result-message"><CheckCircle2 />{resultMessage}</div>}

        <div className="trip-grid">
          {filteredTrips.length > 0 ? filteredTrips.map((trip) => (
            <article className="trip-card" key={trip.id}>
              <div className="trip-image-wrap">
                <img src={trip.image} alt={`Pemandangan ${trip.location}`} />
                <span className="trip-duration"><Clock3 />{trip.duration}</span>
                <button className={savedTrips.includes(trip.id) ? "heart-button saved" : "heart-button"} onClick={() => toggleSaved(trip.id)} aria-label={savedTrips.includes(trip.id) ? "Hapus dari tersimpan" : "Simpan trip"}><Heart /></button>
              </div>
              <div className="trip-body">
                <div className="operator-row"><span>{trip.operator}</span><BadgeCheck aria-label="Integrity Profile aktif" /></div>
                <h3>{trip.title}</h3>
                <div className="trip-meta"><span><MapPin />{trip.location}</span><span><CalendarDays />{trip.date}</span></div>
                <p>{trip.description}</p>
                <div className="evidence-bar">
                  <div><strong>{trip.score}%</strong><span>janji dipenuhi</span></div>
                  <div><strong>{trip.verified}</strong><span>peserta terverifikasi</span></div>
                  <span className={trip.unresolved ? "evidence-status warning" : "evidence-status"}>{trip.unresolved ? `${trip.unresolved} belum terselesaikan` : "0 pelanggaran"}</span>
                </div>
                <div className="trip-footer">
                  <div><small>Harga dari operator</small><strong>{trip.price}</strong></div>
                  <Button onClick={() => setSelectedTrip(trip)} className="evidence-button">Lihat Bukti <ArrowRight /></Button>
                </div>
              </div>
            </article>
          )) : <div className="empty-state">Belum ada trip dalam kategori ini. Pilih kategori lain.</div>}
        </div>
      </section>

      <section className="operator-showcase" id="operators">
        <div className="section-wrap operator-inner">
          <div className="operator-copy">
            <span className="section-kicker light">OPERATOR YANG TERBUKA</span>
            <h2>Rekam jejak yang lebih jelas dari sekadar testimoni.</h2>
            <p>Integrity Profile merangkum pola pemenuhan janji dari setiap trip yang telah selesai.</p>
            <Button variant="secondary">Jelajahi Operator <ArrowRight /></Button>
          </div>
          <div className="profile-card">
            <div className="profile-top"><div className="operator-avatar">JA</div><div><span>Integrity Profile</span><h3>Jelajah Aruna</h3><p>Malang, Jawa Timur</p></div><BadgeCheck /></div>
            <div className="profile-stats"><div><strong>92%</strong><span>Janji dipenuhi</span></div><div><strong>14</strong><span>Trip tercatat</span></div><div><strong>186</strong><span>Peserta terverifikasi</span></div></div>
            <div className="profile-note"><History /><span>Transparan pada <strong>6 dari 6 perubahan</strong> yang tercatat.</span></div>
          </div>
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works">
        <div className="section-heading centered"><div><span className="section-kicker">CARA KEPT BEKERJA</span><h2>Dari janji menjadi bukti.</h2><p>Tiga catatan sederhana membuat promosi open trip bisa diperiksa.</p></div></div>
        <div className="how-grid">
          <article><span>01</span><FileCheck2 /><h3>Promise Snapshot</h3><p>Harga, itinerary, fasilitas, dan batas peserta dicatat sebelum trip.</p></article>
          <article><span>02</span><History /><h3>Change Log</h3><p>Setiap perubahan terlihat bersama alasan dan solusi penggantinya.</p></article>
          <article><span>03</span><TicketCheck /><h3>Reality Check</h3><p>Peserta terverifikasi mencocokkan janji dengan kenyataan.</p></article>
        </div>
      </section>

      <section className="operator-cta section-wrap" id="for-operators">
        <div><span className="section-kicker light">UNTUK OPERATOR OPEN TRIP</span><h2>Biarkan bukti yang membangun kepercayaan.</h2><p>Buat Promise Snapshot dan tunjukkan rekam jejakmu kepada calon peserta.</p></div>
        <Button className="light-button">Buat Profil Operator <ArrowRight /></Button>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark"><Check /></span><span><strong>KEPT</strong><small>Did they keep their promise?</small></span></div>
        <div className="footer-links"><a href="#recommended">Explore Trips</a><a href="#operators">Operators</a><a href="#how-it-works">Cara Kerja</a></div>
        <p>Prototype concept · Semua data ditampilkan untuk demonstrasi.</p>
      </footer>

      <Dialog open={Boolean(selectedTrip)} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        {selectedTrip && (
          <DialogContent className="evidence-dialog">
            <DialogHeader>
              <span className="dialog-kicker"><ShieldCheck /> TRIP INTEGRITY PREVIEW</span>
              <DialogTitle>{selectedTrip.title}</DialogTitle>
              <DialogDescription>{selectedTrip.operator} · {selectedTrip.date}</DialogDescription>
            </DialogHeader>
            <div className="dialog-score">
              <div><strong>{selectedTrip.score}%</strong><span>janji dipenuhi</span></div>
              <div><strong>{selectedTrip.verified}</strong><span>peserta terverifikasi</span></div>
              <div><strong>{selectedTrip.changed}</strong><span>perubahan transparan</span></div>
            </div>
            <div className="promise-preview">
              <div className="promise-preview-title"><LockKeyhole /><span><strong>Promise Snapshot · v1.0</strong><small>Dicatat sebelum peserta membayar</small></span></div>
              {selectedTrip.promises.map((promise) => <div className="promise-line" key={promise}><CheckCircle2 />{promise}</div>)}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTrip(null)}>Tutup</Button>
              <Button className="dialog-cta">Buka Integrity Report <ArrowRight /></Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}

function SearchField({ label, value, icon: Icon, wide = false }: { label: string; value: string; icon: typeof Search; wide?: boolean }) {
  return (
    <label className={wide ? "search-field wide" : "search-field"}>
      <Icon aria-hidden="true" />
      <span><small>{label}</small><input defaultValue={value} aria-label={label} /></span>
      <ChevronDown aria-hidden="true" className="field-chevron" />
    </label>
  );
}
