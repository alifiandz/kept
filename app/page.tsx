"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
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
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Mountain,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Send,
  Sparkles,
  TicketCheck,
  TreePalm,
  TrendingUp,
  Users,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";
import { readKeptUser } from "@/lib/kept-account";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SearchMode = "trips" | "operator" | "compare" | "pass";
type OpenTour = { name: string; operator: string; price: string; rating: number; date: string };
type Destination = {
  id: number;
  name: string;
  place: string;
  price: string;
  category: string;
  rating: number;
  openTours: number;
  description: string;
  image: string;
  tours: OpenTour[];
};

const searchModes: { id: SearchMode; label: string; helper: string; icon: typeof Search }[] = [
  { id: "trips", label: "Cari Open Trip", helper: "Jelajahi trip dengan bukti", icon: Compass },
  { id: "operator", label: "Cek Operator", helper: "Lihat rekam jejak operator", icon: ShieldCheck },
  { id: "compare", label: "Bandingkan", helper: "Bandingkan bukti destinasi", icon: GitCompareArrows },
  { id: "pass", label: "Trip Pass Saya", helper: "Akses trip yang kamu ikuti", icon: TicketCheck },
];

const destinations: Destination[] = [
  {
    id: 1,
    name: "Gunung Bromo",
    place: "Jawa Timur",
    price: "Rp475.000",
    category: "Gunung",
    rating: 92,
    openTours: 12,
    description: "Sunrise vulkanik, Lautan Pasir, dan jalur jeep dalam satu perjalanan singkat.",
    image: "/bromo.webp",
    tours: [
      { name: "Bromo Sunrise Weekend", operator: "Jelajah Aruna", price: "Rp649.000", rating: 94, date: "12–13 Sep 2026" },
      { name: "Bromo Midnight Escape", operator: "Langkah Pagi", price: "Rp475.000", rating: 90, date: "19 Sep 2026" },
      { name: "Bromo + Tumpak Sewu", operator: "Ruang Jelajah", price: "Rp1.250.000", rating: 91, date: "25–27 Sep 2026" },
    ],
  },
  {
    id: 2,
    name: "Labuan Bajo",
    place: "Nusa Tenggara Timur",
    price: "Rp2.350.000",
    category: "Laut & Pulau",
    rating: 96,
    openTours: 9,
    description: "Berlayar ke Pulau Padar, Pink Beach, dan Manta Point dengan kapal liveaboard.",
    image: "/labuan-bajo.webp",
    tours: [
      { name: "Sailing Komodo 3D2N", operator: "Nusa Sail", price: "Rp2.850.000", rating: 97, date: "18–20 Sep 2026" },
      { name: "Komodo Weekend Cruise", operator: "Flores Journey", price: "Rp2.350.000", rating: 94, date: "26–28 Sep 2026" },
    ],
  },
  {
    id: 3,
    name: "Dieng Plateau",
    place: "Jawa Tengah",
    price: "Rp395.000",
    category: "Alam",
    rating: 88,
    openTours: 8,
    description: "Dataran tinggi sejuk dengan sunrise Sikunir, telaga vulkanik, dan candi kuno.",
    image: "/dieng.webp",
    tours: [
      { name: "Dieng Golden Sunrise", operator: "Langkah Pagi", price: "Rp475.000", rating: 88, date: "26–27 Sep 2026" },
      { name: "Dieng Culture Escape", operator: "Jelajah Tengah", price: "Rp395.000", rating: 91, date: "3–4 Okt 2026" },
    ],
  },
  {
    id: 4,
    name: "Nusa Penida",
    place: "Bali",
    price: "Rp650.000",
    category: "Laut & Pulau",
    rating: 91,
    openTours: 14,
    description: "Tebing dramatis, pantai tersembunyi, dan laut biru dalam perjalanan pulau sehari.",
    image: "https://cdn.bookaway.com/media/files/5d82152021264e34310ccdfe.jpeg?quality=50&width=2000",
    tours: [
      { name: "West Penida Day Trip", operator: "Bali Beyond", price: "Rp650.000", rating: 93, date: "Setiap Sabtu" },
      { name: "Penida East + West", operator: "Island Steps", price: "Rp925.000", rating: 90, date: "20–21 Sep 2026" },
    ],
  },
  {
    id: 5,
    name: "Raja Ampat",
    place: "Papua Barat Daya",
    price: "Rp5.750.000",
    category: "Petualangan",
    rating: 95,
    openTours: 5,
    description: "Gugusan karst, laguna jernih, dan kehidupan laut untuk petualangan jarak jauh.",
    image: "https://images.unsplash.com/photo-1703769605314-18648cfc3428?auto=format&fit=crop&w=1600&q=85",
    tours: [
      { name: "Wayag Explorer 5D4N", operator: "Papua Blue", price: "Rp7.250.000", rating: 97, date: "1–5 Okt 2026" },
      { name: "Piaynemo Essential", operator: "Raja Journey", price: "Rp5.750.000", rating: 93, date: "8–11 Okt 2026" },
    ],
  },
  {
    id: 6,
    name: "Gunung Rinjani",
    place: "Nusa Tenggara Barat",
    price: "Rp1.850.000",
    category: "Gunung",
    rating: 93,
    openTours: 7,
    description: "Pendakian menantang menuju punggungan gunung dan panorama Danau Segara Anak.",
    image: "https://images.ctfassets.net/rc3dlxapnu6k/7nXzcuNvuwVoGMXbOFwuHM/0d842621bafca9baa5fde978e931d43c/Indonesien__Lombok__Senaru.jpg?fm=webp&q=50&w=2048",
    tours: [
      { name: "Rinjani Summit 3D2N", operator: "Rinjani Trek", price: "Rp2.350.000", rating: 94, date: "22–24 Sep 2026" },
      { name: "Senaru Crater Rim", operator: "Lombok Steps", price: "Rp1.850.000", rating: 92, date: "29–30 Sep 2026" },
    ],
  },
  {
    id: 7,
    name: "Belitung",
    place: "Kepulauan Bangka Belitung",
    price: "Rp1.250.000",
    category: "Laut & Pulau",
    rating: 90,
    openTours: 6,
    description: "Pantai putih, batu granit raksasa, dan island hopping di perairan yang tenang.",
    image: "https://belitongekspres.disway.id/upload/e45f844460cad1327cd6c447afd9f650.jpg",
    tours: [
      { name: "Belitung Island Hopping", operator: "Laskar Trip", price: "Rp1.250.000", rating: 91, date: "17–19 Sep 2026" },
      { name: "Belitung Slow Escape", operator: "Pesisir Kita", price: "Rp1.450.000", rating: 89, date: "1–3 Okt 2026" },
    ],
  },
  {
    id: 8,
    name: "Borobudur",
    place: "Magelang, Jawa Tengah",
    price: "Rp325.000",
    category: "Budaya",
    rating: 89,
    openTours: 10,
    description: "Warisan budaya, desa sekitar candi, dan lanskap perbukitan dalam satu rute.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Wisatawan_Domestic_di_Borobudur.jpg",
    tours: [
      { name: "Borobudur Village Trail", operator: "Jelajah Tengah", price: "Rp325.000", rating: 91, date: "Setiap Minggu" },
      { name: "Temple & Village Weekend", operator: "Ruang Budaya", price: "Rp575.000", rating: 87, date: "24–25 Sep 2026" },
    ],
  },
];

const categories = [
  { label: "Semua", icon: Sparkles },
  { label: "Gunung", icon: Mountain },
  { label: "Laut & Pulau", icon: Waves },
  { label: "Alam", icon: TreePalm },
  { label: "Petualangan", icon: Compass },
  { label: "Budaya", icon: BadgeCheck },
];

export default function Home() {
  const [mode, setMode] = useState<SearchMode>("trips");
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("Yogyakarta");
  const [date, setDate] = useState("Oktober 2026");
  const [travellers, setTravellers] = useState("2 orang");
  const [operatorQuery, setOperatorQuery] = useState("");
  const [compareOne, setCompareOne] = useState("Gunung Bromo");
  const [compareTwo, setCompareTwo] = useState("Dieng Plateau");
  const [passCode, setPassCode] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [comparison, setComparison] = useState<Destination[] | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<number[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [organizerName, setOrganizerName] = useState<string | null>(null);

  useEffect(() => {
    const syncMode = () => {
      const user = readKeptUser();
      setOrganizerName(user?.mode === "organizer" && user.organizerStatus === "verified" ? user.name : null);
    };
    syncMode();
    window.addEventListener("kept-user-change", syncMode);
    window.addEventListener("storage", syncMode);
    return () => { window.removeEventListener("kept-user-change", syncMode); window.removeEventListener("storage", syncMode); };
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kept-saved-destinations");
      setSavedDestinations(stored ? JSON.parse(stored) : []);
    } catch {
      setSavedDestinations([]);
    }
    setSavedLoaded(true);
  }, []);

  useEffect(() => {
    if (savedLoaded) window.localStorage.setItem("kept-saved-destinations", JSON.stringify(savedDestinations));
  }, [savedDestinations, savedLoaded]);

  const filteredDestinations = useMemo(() => {
    const normalized = submittedQuery.trim().toLowerCase();
    return destinations.filter((destination) => {
      const categoryMatch = category === "Semua" || destination.category === category;
      const searchMatch = !normalized || `${destination.name} ${destination.place} ${destination.category}`.toLowerCase().includes(normalized);
      const savedMatch = !showSaved || savedDestinations.includes(destination.id);
      return categoryMatch && searchMatch && savedMatch;
    });
  }, [category, submittedQuery, savedDestinations, showSaved]);

  const scrollToResults = () => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSaved(false);

    if (mode === "trips") {
      setSubmittedQuery(query);
      setCategory("Semua");
      const count = destinations.filter((destination) => !query.trim() || `${destination.name} ${destination.place} ${destination.category}`.toLowerCase().includes(query.toLowerCase())).length;
      setResultMessage(`${count} destinasi ditemukan dari ${from} untuk ${travellers} pada ${date}.`);
      scrollToResults();
      return;
    }

    if (mode === "operator") {
      const matchedTours = destinations.flatMap((destination) => destination.tours.map((tour) => ({ destination, tour }))).filter(({ tour }) => tour.operator.toLowerCase().includes(operatorQuery.toLowerCase()));
      if (matchedTours.length) {
        setSubmittedQuery(matchedTours[0].destination.name);
        setResultMessage(`${matchedTours[0].tour.operator} ditemukan dengan ${matchedTours[0].tour.rating}% janji dipenuhi pada ${matchedTours[0].tour.name}.`);
      } else {
        setSubmittedQuery("");
        setResultMessage("Operator belum ditemukan. Coba “Jelajah Aruna”, “Nusa Sail”, atau “Langkah Pagi”.");
      }
      scrollToResults();
      return;
    }

    if (mode === "compare") {
      const first = destinations.find((destination) => destination.name.toLowerCase().includes(compareOne.toLowerCase()));
      const second = destinations.find((destination) => destination.name.toLowerCase().includes(compareTwo.toLowerCase()));
      if (first && second) {
        setComparison([first, second]);
        setResultMessage("");
      } else {
        setResultMessage("Salah satu destinasi tidak ditemukan. Gunakan nama destinasi yang tampil di halaman.");
        scrollToResults();
      }
      return;
    }

    if (passCode.trim().toUpperCase() === "BRM-2409-017") {
      if (!readKeptUser()) {
        window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "login", redirect: "/tour?slug=bromo-sunrise-weekend&pass=1" } }));
        return;
      }
      window.location.href = "/tour?slug=bromo-sunrise-weekend&pass=1";
    } else {
      setResultMessage("Trip Pass tidak ditemukan. Coba kode demo BRM-2409-017.");
      scrollToResults();
    }
  };

  const toggleSaved = (destinationId: number) => {
    if (!readKeptUser()) {
      window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "register" } }));
      return;
    }
    setSavedDestinations((current) => current.includes(destinationId) ? current.filter((id) => id !== destinationId) : [...current, destinationId]);
  };

  const openSaved = () => {
    if (!readKeptUser()) {
      window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "register" } }));
      return;
    }
    setShowSaved(true);
    setSubmittedQuery("");
    setCategory("Semua");
    setResultMessage(savedDestinations.length ? `${savedDestinations.length} destinasi tersimpan.` : "Belum ada destinasi tersimpan. Tekan ikon hati pada kartu destinasi.");
    scrollToResults();
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kept home"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a>
        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="Navigasi utama">
          {organizerName ? <>
            <a href="#operator-home" onClick={() => setMobileOpen(false)}>Dashboard</a>
            <a href="/account?tab=open-tours">Open Tour Saya</a>
            <a href="/account?tab=promises">Promise Snapshot</a>
            <a href="/account?tab=create-tour">Buat Open Tour</a>
          </> : <>
            <a href="#destinations" onClick={() => setMobileOpen(false)}>Destinasi</a>
            <a href="#why-kept" onClick={() => setMobileOpen(false)}>Kenapa Kept</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>Cara Kerja</a>
            <a href="#for-operators" onClick={() => setMobileOpen(false)}>Untuk Operator</a>
          </>}
        </nav>
        <div className="header-actions">
          {!organizerName && <button className="saved-button" onClick={openSaved} aria-label="Lihat destinasi tersimpan"><Heart /><span>Tersimpan</span>{savedDestinations.length > 0 && <b>{savedDestinations.length}</b>}</button>}
          <AccountControls showWelcome />
          <button className="menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label="Buka menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      {organizerName ? <OrganizerHome name={organizerName} /> : <>

      <section className="hero" id="top">
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow"><ShieldCheck /> BUKTI SEBELUM KAMU PERCAYA</span>
          <h1>Temukan trip yang<br />layak dipercaya.</h1>
          <p>Jelajahi open trip berdasarkan janji yang tercatat dan bukti dari peserta terverifikasi.</p>
        </div>

        <div className="search-shell">
          <div className="mode-tabs" role="tablist" aria-label="Pilihan layanan Kept">
            {searchModes.map(({ id, label, helper, icon: Icon }) => (
              <button key={id} className={mode === id ? "mode-tab active" : "mode-tab"} onClick={() => { setMode(id); setResultMessage(""); }} role="tab" aria-selected={mode === id}>
                <span className="mode-icon"><Icon /></span><span><strong>{label}</strong><small>{helper}</small></span>
              </button>
            ))}
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            {mode === "trips" && <>
              <SearchField label="Mau ke mana?" value={query} placeholder="Bromo, Bali, gunung..." onChange={setQuery} icon={MapPin} />
              <SearchField label="Berangkat dari" value={from} onChange={setFrom} icon={Compass} />
              <SearchField label="Bulan trip" value={date} onChange={setDate} icon={CalendarDays} />
              <SearchField label="Peserta" value={travellers} onChange={setTravellers} icon={Users} />
              <Button className="search-button" type="submit"><Search /> Cari Trip</Button>
            </>}
            {mode === "operator" && <>
              <SearchField label="Nama operator" value={operatorQuery} placeholder="Contoh: Jelajah Aruna" onChange={setOperatorQuery} icon={ShieldCheck} wide />
              <div className="pass-note"><CircleUserRound /><span>Cek skor pemenuhan janji operator dari perjalanan yang sudah selesai.</span></div>
              <Button className="search-button" type="submit"><Search /> Cek Operator</Button>
            </>}
            {mode === "compare" && <>
              <SearchField label="Destinasi pertama" value={compareOne} onChange={setCompareOne} icon={Mountain} wide />
              <SearchField label="Destinasi kedua" value={compareTwo} onChange={setCompareTwo} icon={Mountain} wide />
              <Button className="search-button" type="submit"><GitCompareArrows /> Bandingkan</Button>
            </>}
            {mode === "pass" && <>
              <SearchField label="Kode Trip Pass" value={passCode} placeholder="Coba BRM-2409-017" onChange={setPassCode} icon={KeyRound} wide />
              <div className="pass-note"><LockKeyhole /><span>Trip Pass hanya dapat digunakan oleh peserta yang terdaftar.</span></div>
              <Button className="search-button" type="submit"><TicketCheck /> Buka Trip Pass</Button>
            </>}
          </form>
        </div>
      </section>

      <section className="category-section" aria-label="Kategori destinasi">
        <div className="category-row">
          {categories.map(({ label, icon: Icon }) => <button key={label} className={category === label ? "category-chip active" : "category-chip"} onClick={() => { setCategory(label); setSubmittedQuery(""); setShowSaved(false); }}><Icon />{label}</button>)}
        </div>
        <div className="trust-prompt"><BadgeCheck /><span><strong>Rating Kept bukan rating kepuasan.</strong> Persentase menunjukkan janji yang dipenuhi.</span></div>
      </section>

      <section className="recommended section-wrap" id="destinations">
        <div className="section-heading">
          <div><span className="section-kicker">JELAJAHI INDONESIA</span><h2>Destinasi open trip pilihan</h2><p>Pilih tempatnya dahulu, lalu bandingkan operator dan bukti perjalanan yang tersedia.</p></div>
          {(submittedQuery || showSaved) && <button className="view-all" onClick={() => { setSubmittedQuery(""); setShowSaved(false); setResultMessage(""); }}>Tampilkan semua <X /></button>}
        </div>

        {resultMessage && <div className="result-message"><CheckCircle2 />{resultMessage}</div>}

        <div className="destination-grid">
          {filteredDestinations.length ? filteredDestinations.map((destination) => (
            <article className="destination-card" key={destination.id}>
              <a className="destination-image" href={`/destination?slug=${toSlug(destination.name)}`} aria-label={`Buka halaman ${destination.name}`}>
                <img src={destination.image} alt={`Pemandangan ${destination.name}`} />
                <span className="category-label">{destination.category}</span>
              </a>
              <button className={savedDestinations.includes(destination.id) ? "heart-button saved" : "heart-button"} onClick={() => toggleSaved(destination.id)} aria-label={savedDestinations.includes(destination.id) ? "Hapus dari tersimpan" : "Simpan destinasi"}><Heart /></button>
              <div className="destination-body">
                <div className="destination-place"><MapPin />{destination.place}</div>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <div className="destination-facts">
                  <div><small>Estimasi mulai</small><strong>{destination.price}</strong></div>
                  <div><small>Rating Kept</small><strong className="rating-value"><ShieldCheck />{destination.rating}%</strong></div>
                </div>
                <a className="tour-count" href={`/destination?slug=${toSlug(destination.name)}`}><span><strong>{destination.openTours}</strong> open tour tersedia</span><ArrowRight /></a>
              </div>
            </article>
          )) : <div className="empty-state">Tidak ada destinasi yang cocok. Coba kata kunci atau kategori lain.</div>}
        </div>
      </section>

      <section className="why-kept" id="why-kept">
        <div className="section-wrap">
          <div className="section-heading centered"><div><span className="section-kicker light">KENAPA MEMILIH Kept?</span><h2>Kepercayaan yang bisa diperiksa.</h2><p>Kept membantu kamu melihat lebih dari foto promosi dan testimoni.</p></div></div>
          <div className="benefit-grid">
            <article><FileCheck2 /><h3>Janji Tercatat</h3><p>Detail trip dapat diperiksa sebelum peserta membayar.</p></article>
            <article><TicketCheck /><h3>Peserta Terverifikasi</h3><p>Hanya peserta asli yang dapat mengonfirmasi kenyataan.</p></article>
            <article><History /><h3>Perubahan Transparan</h3><p>Setiap perubahan tampil bersama alasan dan penggantinya.</p></article>
            <article><ShieldCheck /><h3>Rating Berbasis Bukti</h3><p>Persentase dihitung dari janji yang benar-benar dipenuhi.</p></article>
          </div>
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works">
        <div className="section-heading centered"><div><span className="section-kicker">CARA Kept BEKERJA</span><h2>Dari janji menjadi bukti.</h2><p>Tiga catatan sederhana membuat promosi open trip bisa diperiksa.</p></div></div>
        <div className="how-grid">
          <article><span>01</span><FileCheck2 /><h3>Promise Snapshot</h3><p>Harga, itinerary, fasilitas, dan batas peserta dicatat sebelum trip.</p></article>
          <article><span>02</span><History /><h3>Change Log</h3><p>Setiap perubahan terlihat bersama alasan dan solusi penggantinya.</p></article>
          <article><span>03</span><TicketCheck /><h3>Reality Check</h3><p>Peserta terverifikasi mencocokkan janji dengan kenyataan.</p></article>
        </div>
      </section>

      <section className="operator-cta section-wrap" id="for-operators">
        <div><span className="section-kicker light">UNTUK OPERATOR OPEN TRIP</span><h2>Biarkan bukti yang membangun kepercayaan.</h2><p>Buat Promise Snapshot dan tunjukkan rekam jejakmu kepada calon peserta.</p></div>
        <Button className="light-button" onClick={() => {
          if (readKeptUser()) window.location.href = "/account?tab=eligibility";
          else window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "register", redirect: "/account?tab=eligibility" } }));
        }}>Buat Profil Operator <ArrowRight /></Button>
      </section>

      <footer className="site-footer expanded-footer">
        <div className="footer-brand"><span className="brand-mark"><KeptLogo /></span><span><strong>Kept</strong><small>Did they keep their promise?</small></span></div>
        <div className="footer-column"><strong>Jelajahi</strong><a href="#destinations">Destinasi</a><a href="#why-kept">Kenapa Kept</a><a href="#how-it-works">Cara Kerja</a></div>
        <div className="footer-column"><strong>Untuk Operator</strong><a href="#for-operators">Buat Profil</a><a href="/account?tab=eligibility">Masuk Operator</a><a href="mailto:hello@kept.id?subject=Pusat%20Bantuan%20Kept">Pusat Bantuan</a></div>
        <div className="footer-column contact-column"><strong>Hubungi Kami</strong><a href="mailto:hello@kept.id"><Mail />hello@kept.id</a><a href="tel:+6281234567890"><Phone />+62 812-3456-7890</a><span><AtSign />kept.id</span><span><MapPin />Yogyakarta, Indonesia</span></div>
      </footer>

      <Dialog open={Boolean(comparison)} onOpenChange={(open) => !open && setComparison(null)}>
        {comparison && <DialogContent className="compare-dialog">
          <DialogHeader><span className="dialog-kicker"><GitCompareArrows /> PERBANDINGAN DESTINASI</span><DialogTitle>Bandingkan sebelum memilih.</DialogTitle><DialogDescription>Gunakan rating berbasis janji dan pilihan tour yang tersedia.</DialogDescription></DialogHeader>
          <div className="comparison-grid">{comparison.map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.name} /><h3>{destination.name}</h3><span>{destination.place}</span><dl><div><dt>Estimasi</dt><dd>{destination.price}</dd></div><div><dt>Rating Kept</dt><dd>{destination.rating}%</dd></div><div><dt>Open tour</dt><dd>{destination.openTours}</dd></div></dl><Button onClick={() => { window.location.href = `/destination?slug=${toSlug(destination.name)}`; }}>Lihat Tour</Button></article>)}</div>
          <DialogFooter><Button variant="outline" onClick={() => setComparison(null)}>Tutup</Button></DialogFooter>
        </DialogContent>}
      </Dialog>
      </>}
    </main>
  );
}

function SearchField({ label, value, placeholder, onChange, icon: Icon, wide = false }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void; icon: typeof Search; wide?: boolean }) {
  return <label className={wide ? "search-field wide" : "search-field"}><Icon /><span><small>{label}</small><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} aria-label={label} /></span><ChevronDown className="field-chevron" /></label>;
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/&/g, "dan").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function OrganizerHome({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  return <section className="operator-home" id="operator-home">
    <div className="operator-home-wrap">
      <div className="operator-home-top">
        <div><span>ORGANIZER CONTROL CENTER</span><h1>Selamat datang kembali, {firstName}.</h1><p>Ada <strong>2 trip aktif</strong> dan <strong>1 Reality Check</strong> yang perlu ditinjau.</p></div>
        <div className="operator-home-actions"><Button variant="outline" onClick={() => { window.location.href = "/account?tab=open-tours"; }}>Lihat Trip Aktif</Button><Button onClick={() => { window.location.href = "/account?tab=create-tour"; }}><Plus /> Buat Open Tour</Button></div>
      </div>

      <div className="operator-home-metrics">
        <HomeMetric icon={BriefcaseBusiness} label="Trip aktif" value="2" note="2 segera berangkat" tone="blue" />
        <HomeMetric icon={ShieldCheck} label="Janji dipenuhi" value="92%" note="+4% dari bulan lalu" tone="green" />
        <HomeMetric icon={Users} label="Peserta terverifikasi" value="128" note="Dari 11 perjalanan" tone="navy" />
        <HomeMetric icon={MessageSquareText} label="Reality Check Masuk" value="84%" note="107 konfirmasi masuk" tone="amber" />
      </div>

      <div className="operator-home-grid">
        <article className="operator-integrity-card">
          <div className="operator-card-heading"><div><small>INTEGRITY OVERVIEW</small><h2>Skor Integritas Operator</h2></div><span><TrendingUp /> +4%</span></div>
          <div className="operator-integrity-main"><div className="operator-integrity-ring"><strong>92%</strong><span>terpercaya</span></div><div className="operator-integrity-legend"><div><i /><span>Janji dipenuhi</span><b>92%</b></div><div><i className="transparent" /><span>Berubah transparan</span><b>6%</b></div><div><i className="unresolved" /><span>Belum terselesaikan</span><b>2%</b></div></div></div>
          <div className="operator-bars"><i style={{height:"48%"}} /><i style={{height:"61%"}} /><i style={{height:"58%"}} /><i style={{height:"76%"}} /><i style={{height:"84%"}} /><i className="latest" style={{height:"92%"}} /></div><div className="operator-bar-labels"><span>Trip 1</span><span>Trip 2</span><span>Trip 3</span><span>Trip 4</span><span>Trip 5</span><span>Terbaru</span></div>
        </article>
        <article className="operator-attention-card">
          <div className="operator-card-heading"><div><small>PERLU TINDAKAN</small><h2>Selesaikan berikutnya</h2></div><b className="attention-count">2</b></div>
          <HomeTask icon={AlertCircle} title="Bromo Sunrise — Selesai" stats={[["Promise Snapshot","Terkunci"],["Peserta terverifikasi","14/14"],["Reality Check masuk","8/14"]]} status="Perlu ditinjau" action="Tinjau Hasil" href="/tour?slug=bromo-sunrise-weekend#reality" urgent />
          <HomeTask icon={MessageSquareText} title="Dieng Weekend — Selesai" stats={[["Reality Check masuk","16/20"],["Janji dipenuhi","88%"],["Masalah dilaporkan","1"]]} status="Perlu ditinjau" action="Lihat Hasil" href="/account?tab=open-tours" />
          <a className="operator-link" href="/account?tab=open-tours">Lihat semua perjalanan <ArrowRight /></a>
        </article>
      </div>

      <article className="operator-performance-card"><div className="operator-card-heading"><div><small>PERFORMA JANJI</small><h2>Apa yang sudah kuat—dan perlu diperbaiki</h2></div><a className="operator-link" href="/account?tab=promises">Lihat snapshot <ArrowRight /></a></div><div className="operator-performance-grid"><HomePerformance label="Transportasi sesuai" value={98} status="Sangat konsisten" /><HomePerformance label="Tanpa biaya tambahan" value={96} status="Sangat konsisten" /><HomePerformance label="Itinerary dipenuhi" value={91} status="Konsisten" /><HomePerformance label="Kapasitas kamar sesuai" value={78} status="Perlu perhatian" warning /><HomePerformance label="Keberangkatan tepat waktu" value={74} status="Prioritas perbaikan" warning /></div></article>

      <div className="operator-bottom-grid"><article className="operator-activity-card"><div className="operator-card-heading"><div><small>AKTIVITAS TERBARU</small><h2>Update dari perjalananmu</h2></div></div><HomeActivity icon={MessageSquareText} title="8 peserta mengisi Reality Check" detail="Bromo Sunrise · 12 menit lalu" href="/tour?slug=bromo-sunrise-weekend#reality" /><HomeActivity icon={FileCheck2} title="Perubahan itinerary berhasil dicatat" detail="Dieng Weekend · Kemarin" href="/account?tab=promises" /><HomeActivity icon={ShieldCheck} title="Promise Snapshot dipublikasikan" detail="Labuan Bajo 3D2N · 2 hari lalu" href="/account?tab=promises" /><HomeActivity icon={AlertCircle} title="Satu peserta melaporkan biaya tambahan" detail="Bromo Sunrise · 3 hari lalu" href="/tour?slug=bromo-sunrise-weekend#reality" /></article><article className="operator-quick-card"><div className="operator-card-heading"><div><small>AKSI CEPAT</small><h2>Mulai dari sini</h2></div></div><div className="operator-quick-grid"><HomeQuickAction icon={Plus} label="Buat Open Tour" href="/account?tab=create-tour" /><HomeQuickAction icon={FileCheck2} label="Buat Promise Snapshot" href="/account?tab=promises" /><HomeQuickAction icon={Send} label="Kirim Trip Pass" href="/account?tab=open-tours" /><HomeQuickAction icon={Clock3} label="Catat Perubahan" href="/account?tab=promises" /></div></article></div>
    </div>
  </section>;
}

function HomeMetric({ icon: Icon, label, value, note, tone }: { icon: typeof Heart; label: string; value: string; note: string; tone: string }) { return <article className={`operator-metric ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></article>; }
function HomeTask({ icon: Icon, title, stats, status, action, href, urgent }: { icon: typeof Heart; title: string; stats: [string,string][]; status: string; action: string; href: string; urgent?: boolean }) { return <div className={`operator-task ${urgent ? "urgent" : ""}`}><span><Icon /></span><div><strong>{title}</strong><dl>{stats.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><small>{status}</small></div><a href={href}>{action}</a></div>; }
function HomePerformance({ label, value, status, warning }: { label: string; value: number; status: string; warning?: boolean }) { return <div className={`operator-performance ${warning ? "warning" : ""}`}><div><strong>{label}</strong><span>{status}</span></div><b>{value}%</b><i><em style={{width:`${value}%`}} /></i></div>; }
function HomeActivity({ icon: Icon, title, detail, href }: { icon: typeof Heart; title: string; detail: string; href: string }) { return <a className="operator-activity" href={href}><span><Icon /></span><div><strong>{title}</strong><small>{detail}</small></div><ArrowRight /></a>; }
function HomeQuickAction({ icon: Icon, label, href }: { icon: typeof Heart; label: string; href: string }) { return <a className="operator-quick-action" href={href}><span><Icon /></span><strong>{label}</strong><ArrowRight /></a>; }
