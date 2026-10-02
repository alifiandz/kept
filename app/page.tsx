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
  MapPin,
  Menu,
  MessageSquareText,
  Mountain,
  Plus,
  Search,
  ShieldCheck,
  Send,
  Sparkles,
  TicketCheck,
  TreePalm,
  Users,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";
import { readKeptUser } from "@/lib/kept-account";
import { getDestination as getSharedDestination, tours as sharedTours } from "@/lib/kept-data";
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
    price: "Rp649.000",
    category: "Gunung",
    rating: 94,
    openTours: 3,
    description: "Sunrise vulkanik, Lautan Pasir, dan jalur jeep dalam satu perjalanan singkat.",
    image: "/covers/gunung-bromo.webp",
    tours: [
      { name: "Bromo Sunrise Weekend", operator: "Jelajah Aruna", price: "Rp649.000", rating: 94, date: "19–20 Sep 2026" },
      { name: "Bromo Photography Trip", operator: "Langkah Pagi", price: "Rp825.000", rating: 0, date: "17–18 Okt 2026" },
      { name: "Bromo Family Escape", operator: "Jelajah Aruna", price: "Rp725.000", rating: 0, date: "24–25 Okt 2026" },
    ],
  },
  {
    id: 2,
    name: "Labuan Bajo",
    place: "Nusa Tenggara Timur",
    price: "Rp2.350.000",
    category: "Laut & Pulau",
    rating: 96,
    openTours: 3,
    description: "Berlayar ke Pulau Padar, Pink Beach, dan Manta Point dengan kapal liveaboard.",
    image: "/covers/labuan-bajo.webp",
    tours: [
      { name: "Komodo Weekend Cruise", operator: "Nusa Sail", price: "Rp2.850.000", rating: 96, date: "18–20 Sep 2026" },
      { name: "Padar & Pink Beach Sailing", operator: "Flores Journey", price: "Rp3.150.000", rating: 0, date: "16–18 Okt 2026" },
    ],
  },
  {
    id: 3,
    name: "Dieng Plateau",
    place: "Jawa Tengah",
    price: "Rp395.000",
    category: "Alam",
    rating: 88,
    openTours: 3,
    description: "Dataran tinggi sejuk dengan sunrise Sikunir, telaga vulkanik, dan candi kuno.",
    image: "/covers/dieng-plateau.webp",
    tours: [
      { name: "Dieng Golden Sunrise", operator: "Langkah Pagi", price: "Rp475.000", rating: 88, date: "19–20 Sep 2026" },
      { name: "Dieng Culture Escape", operator: "Jelajah Tengah", price: "Rp595.000", rating: 0, date: "17–18 Okt 2026" },
    ],
  },
  {
    id: 4,
    name: "Nusa Penida",
    place: "Bali",
    price: "Rp650.000",
    category: "Laut & Pulau",
    rating: 93,
    openTours: 3,
    description: "Tebing dramatis, pantai tersembunyi, dan laut biru dalam perjalanan pulau sehari.",
    image: "/covers/nusa-penida.webp",
    tours: [
      { name: "West Penida Day Trip", operator: "Island Steps", price: "Rp650.000", rating: 93, date: "20 Sep 2026" },
      { name: "Penida East + West", operator: "Island Steps", price: "Rp925.000", rating: 0, date: "17–18 Okt 2026" },
    ],
  },
  {
    id: 5,
    name: "Raja Ampat",
    place: "Papua Barat Daya",
    price: "Rp5.750.000",
    category: "Petualangan",
    rating: 95,
    openTours: 3,
    description: "Gugusan karst, laguna jernih, dan kehidupan laut untuk petualangan jarak jauh.",
    image: "/covers/raja-ampat.webp",
    tours: [
      { name: "Piaynemo Essential", operator: "Papua Blue", price: "Rp5.750.000", rating: 95, date: "17–21 Sep 2026" },
      { name: "Wayag Explorer", operator: "Papua Blue", price: "Rp7.250.000", rating: 0, date: "16–21 Okt 2026" },
    ],
  },
  {
    id: 6,
    name: "Gunung Rinjani",
    place: "Nusa Tenggara Barat",
    price: "Rp1.850.000",
    category: "Gunung",
    rating: 93,
    openTours: 3,
    description: "Pendakian menantang menuju punggungan gunung dan panorama Danau Segara Anak.",
    image: "/covers/gunung-rinjani.webp",
    tours: [
      { name: "Rinjani Crater Rim", operator: "Rinjani Trek", price: "Rp1.850.000", rating: 93, date: "18–20 Sep 2026" },
      { name: "Rinjani Summit 3D2N", operator: "Rinjani Trek", price: "Rp2.350.000", rating: 0, date: "16–18 Okt 2026" },
    ],
  },
  {
    id: 7,
    name: "Belitung",
    place: "Kepulauan Bangka Belitung",
    price: "Rp1.250.000",
    category: "Laut & Pulau",
    rating: 91,
    openTours: 3,
    description: "Pantai putih, batu granit raksasa, dan island hopping di perairan yang tenang.",
    image: "/covers/belitung.webp",
    tours: [
      { name: "Belitung Island Hopping", operator: "Laskar Trip", price: "Rp1.250.000", rating: 91, date: "18–20 Sep 2026" },
      { name: "Belitung Slow Escape", operator: "Laskar Trip", price: "Rp1.450.000", rating: 0, date: "16–18 Okt 2026" },
    ],
  },
  {
    id: 8,
    name: "Borobudur",
    place: "Magelang, Jawa Tengah",
    price: "Rp325.000",
    category: "Budaya",
    rating: 91,
    openTours: 3,
    description: "Warisan budaya, desa sekitar candi, dan lanskap perbukitan dalam satu rute.",
    image: "/covers/borobudur.webp",
    tours: [
      { name: "Borobudur Village Trail", operator: "Jelajah Tengah", price: "Rp325.000", rating: 91, date: "20 Sep 2026" },
      { name: "Temple & Village Weekend", operator: "Ruang Budaya", price: "Rp575.000", rating: 0, date: "17–18 Okt 2026" },
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
  const [from, setFrom] = useState("Semua kota");
  const [date, setDate] = useState("Semua bulan");
  const [travellers, setTravellers] = useState("2 orang");
  const [operatorQuery, setOperatorQuery] = useState("");
  const [compareOne, setCompareOne] = useState("Gunung Bromo");
  const [compareTwo, setCompareTwo] = useState("Dieng Plateau");
  const [passCode, setPassCode] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedTripFilters, setSubmittedTripFilters] = useState<{ from: string; date: string; travellers: string } | null>(null);
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
      const pendingSave = Number(window.localStorage.getItem("kept-pending-save"));
      if (user && pendingSave) {
        setSavedDestinations((current) => current.includes(pendingSave) ? current : [...current, pendingSave]);
        window.localStorage.removeItem("kept-pending-save");
        setResultMessage("Destinasi berhasil disimpan setelah kamu masuk.");
      }
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
      const destinationTours = sharedTours.filter((tour) => tour.destinationSlug === toSlug(destination.name));
      const searchMatch = !normalized || `${destination.name} ${destination.place} ${destination.category} ${destinationTours.map((tour) => `${tour.name} ${tour.operator.name}`).join(" ")}`.toLowerCase().includes(normalized);
      const tripMatch = !submittedTripFilters || destinationTours.some((tour) => {
        const requestedFrom = submittedTripFilters.from.trim().toLowerCase();
        const requestedMonthRaw = submittedTripFilters.date.trim().toLowerCase();
        const requestedMonth = requestedMonthRaw.startsWith("semua") ? "" : requestedMonthRaw.replace("oktober", "okt").replace("september", "sep");
        const requestedTravellers = Number(submittedTripFilters.travellers.match(/\d+/)?.[0] ?? 1);
        const originMatches = !requestedFrom || requestedFrom.startsWith("semua") || tour.departure.toLowerCase().includes(requestedFrom);
        const dateMatches = !requestedMonth || tour.date.toLowerCase().includes(requestedMonth);
        return originMatches && dateMatches && tour.capacity >= requestedTravellers;
      });
      const savedMatch = !showSaved || savedDestinations.includes(destination.id);
      return categoryMatch && searchMatch && tripMatch && savedMatch;
    });
  }, [category, submittedQuery, submittedTripFilters, savedDestinations, showSaved]);

  const scrollToResults = () => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSaved(false);

    if (mode === "trips") {
      setSubmittedQuery(query);
      setSubmittedTripFilters({ from, date, travellers });
      setCategory("Semua");
      const requestedFrom = from.trim().toLowerCase();
      const requestedMonthRaw = date.trim().toLowerCase();
      const requestedMonth = requestedMonthRaw.startsWith("semua") ? "" : requestedMonthRaw.replace("oktober", "okt").replace("september", "sep");
      const requestedTravellers = Number(travellers.match(/\d+/)?.[0] ?? 1);
      const matchedDestinationSlugs = new Set(sharedTours.filter((tour) => {
        const destination = getSharedDestination(tour.destinationSlug);
        const text = `${destination?.name ?? ""} ${destination?.place ?? ""} ${destination?.category ?? ""} ${tour.name} ${tour.operator.name}`.toLowerCase();
        return (!query.trim() || text.includes(query.trim().toLowerCase())) && (!requestedFrom || requestedFrom.startsWith("semua") || tour.departure.toLowerCase().includes(requestedFrom)) && (!requestedMonth || tour.date.toLowerCase().includes(requestedMonth)) && tour.capacity >= requestedTravellers;
      }).map((tour) => tour.destinationSlug));
      setResultMessage(matchedDestinationSlugs.size ? `${matchedDestinationSlugs.size} destinasi memiliki trip yang cocok untuk ${travellers}.` : "Belum ada trip yang cocok dengan filter tersebut. Ubah salah satu kriteria.");
      scrollToResults();
      return;
    }

    if (mode === "operator") {
      const matchedTours = sharedTours.filter((tour) => tour.operator.name.toLowerCase().includes(operatorQuery.toLowerCase()));
      if (matchedTours.length) {
        const matchedTour = matchedTours.find((tour) => tour.score !== null) ?? matchedTours[0];
        const matchedDestination = getSharedDestination(matchedTour.destinationSlug);
        setSubmittedQuery(matchedDestination?.name ?? "");
        setSubmittedTripFilters(null);
        const completedCount = matchedTours.filter((tour) => tour.score !== null).length;
        setResultMessage(matchedTour.score !== null ? `${matchedTour.operator.name} terverifikasi · ${completedCount} perjalanan selesai · Truth Score ${matchedTour.score}% pada ${matchedTour.name}.` : `${matchedTour.operator.name} terverifikasi, tetapi belum memiliki perjalanan selesai untuk dihitung.`);
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
        window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "login", redirect: "/tour?slug=bromo-sunrise-weekend&pass=BRM-2409-017" } }));
        return;
      }
      window.location.href = "/tour?slug=bromo-sunrise-weekend&pass=BRM-2409-017";
    } else {
      setResultMessage("Trip Pass tidak ditemukan. Coba kode demo BRM-2409-017.");
      scrollToResults();
    }
  };

  const toggleSaved = (destinationId: number) => {
    if (!readKeptUser()) {
      window.localStorage.setItem("kept-pending-save", String(destinationId));
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
    setSubmittedTripFilters(null);
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
            <a href="/account?tab=open-tours">Open Trip Saya</a>
            <a href="/account?tab=promises">Promise Card</a>
            <a href="/account?tab=create-tour">Buat Open Trip</a>
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
          {categories.map(({ label, icon: Icon }) => <button key={label} className={category === label ? "category-chip active" : "category-chip"} onClick={() => { setCategory(label); setSubmittedQuery(""); setSubmittedTripFilters(null); setShowSaved(false); }}><Icon />{label}</button>)}
        </div>
        <div className="trust-prompt"><BadgeCheck /><span><strong>Truth Score bukan rating kepuasan.</strong> Persentase menunjukkan janji yang dipenuhi.</span></div>
      </section>

      <section className="recommended section-wrap" id="destinations">
        <div className="section-heading">
          <div><span className="section-kicker">JELAJAHI INDONESIA</span><h2>Destinasi open trip pilihan</h2><p>Pilih tempatnya dahulu, lalu bandingkan operator dan bukti perjalanan yang tersedia.</p></div>
          {(submittedQuery || submittedTripFilters || showSaved) && <button className="view-all" onClick={() => { setQuery(""); setFrom("Semua kota"); setDate("Semua bulan"); setTravellers("2 orang"); setCategory("Semua"); setSubmittedQuery(""); setSubmittedTripFilters(null); setShowSaved(false); setResultMessage(""); }}>Tampilkan semua <X /></button>}
        </div>

        {resultMessage && <div className="result-message"><CheckCircle2 />{resultMessage}</div>}

        <div className="destination-grid">
          {filteredDestinations.length ? filteredDestinations.map((destination) => (
            <article className="destination-card" key={destination.id}>
              <a className="destination-image" href={`/destination?slug=${toSlug(destination.name)}`} aria-label={`Buka halaman ${destination.name}`}>
                <img src={destination.image} alt={`Pemandangan ${destination.name}`} loading="lazy" />
                <span className="category-label">{destination.category}</span>
              </a>
              <button className={savedDestinations.includes(destination.id) ? "heart-button saved" : "heart-button"} onClick={() => toggleSaved(destination.id)} aria-label={savedDestinations.includes(destination.id) ? "Hapus dari tersimpan" : "Simpan destinasi"}><Heart /></button>
              <div className="destination-body">
                <div className="destination-place"><MapPin />{destination.place}</div>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <div className="destination-facts">
                  <div><small>Estimasi mulai</small><strong>{destination.price}</strong></div>
                  <div><small>Skor trip selesai</small><strong className="rating-value"><ShieldCheck />{destination.rating}%</strong></div>
                </div>
                <a className="tour-count" href={`/destination?slug=${toSlug(destination.name)}`}><span><strong>{destination.openTours}</strong> open trip terkurasi</span><ArrowRight /></a>
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
            <article><ShieldCheck /><h3>Truth Score Berbasis Bukti</h3><p>Persentase dihitung dari janji yang benar-benar dipenuhi.</p></article>
          </div>
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works">
        <div className="section-heading centered"><div><span className="section-kicker">CARA Kept BEKERJA</span><h2>Dari janji menjadi bukti.</h2><p>Tiga catatan sederhana membuat promosi open trip bisa diperiksa.</p></div></div>
        <div className="how-grid">
          <article><span>01</span><FileCheck2 /><h3>Promise Card</h3><p>Harga, itinerary, fasilitas, dan batas peserta dicatat sebelum trip.</p></article>
          <article><span>02</span><History /><h3>Change Log</h3><p>Setiap perubahan terlihat bersama alasan dan solusi penggantinya.</p></article>
          <article><span>03</span><TicketCheck /><h3>Reality Check</h3><p>Peserta terverifikasi mencocokkan janji dengan kenyataan.</p></article>
        </div>
      </section>

      <section className="operator-cta section-wrap" id="for-operators">
        <div><span className="section-kicker light">UNTUK OPERATOR OPEN TRIP</span><h2>Biarkan bukti yang membangun kepercayaan.</h2><p>Buat Promise Card dan tunjukkan rekam jejakmu kepada calon peserta.</p></div>
        <Button className="light-button" onClick={() => {
          if (readKeptUser()) window.location.href = "/account?tab=eligibility";
          else window.dispatchEvent(new CustomEvent("kept-auth-required", { detail: { tab: "register", redirect: "/account?tab=eligibility" } }));
        }}>Buat Profil Operator <ArrowRight /></Button>
      </section>

      <footer className="site-footer expanded-footer">
        <div className="footer-brand"><span className="brand-mark"><KeptLogo /></span><span><strong>Kept</strong><small>Did they keep their promise?</small></span></div>
        <div className="footer-column"><strong>Jelajahi</strong><a href="#destinations">Destinasi</a><a href="#why-kept">Kenapa Kept</a><a href="#how-it-works">Cara Kerja</a></div>
        <div className="footer-column"><strong>Untuk Operator</strong><a href="#for-operators">Buat Profil</a><a href="/account?tab=eligibility">Masuk Operator</a><a href="mailto:hello@kept.id?subject=Pusat%20Bantuan%20Kept">Pusat Bantuan</a></div>
        <div className="footer-column contact-column"><strong>Prototype JHIC 2.0</strong><span><AtSign />kept.my.id</span><span><MapPin />Team Knot — SMA LHI</span><a href="/credits">Kredit foto & lisensi</a></div>
      </footer>

      <Dialog open={Boolean(comparison)} onOpenChange={(open) => !open && setComparison(null)}>
        {comparison && <DialogContent className="compare-dialog">
          <DialogHeader><span className="dialog-kicker"><GitCompareArrows /> PERBANDINGAN DESTINASI</span><DialogTitle>Bandingkan sebelum memilih.</DialogTitle><DialogDescription>Gunakan Truth Score berbasis bukti dan pilihan trip yang tersedia.</DialogDescription></DialogHeader>
          <div className="comparison-grid">{comparison.map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.name} /><h3>{destination.name}</h3><span>{destination.place}</span><dl><div><dt>Estimasi</dt><dd>{destination.price}</dd></div><div><dt>Truth Score</dt><dd>{destination.rating}%</dd></div><div><dt>Open trip</dt><dd>{destination.openTours}</dd></div></dl><Button onClick={() => { window.location.href = `/destination?slug=${toSlug(destination.name)}`; }}>Lihat Trip</Button></article>)}</div>
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
        <div><span>ORGANIZER CONTROL CENTER · DATA DEMO</span><h1>Selamat datang kembali, {firstName}.</h1><p>Ada <strong>1 trip mendatang</strong> dan <strong>1 Reality Check</strong> yang perlu ditinjau.</p></div>
        <div className="operator-home-actions"><Button variant="outline" onClick={() => { window.location.href = "/account?tab=open-tours"; }}>Lihat Open Trip</Button><Button onClick={() => { window.location.href = "/account?tab=create-tour"; }}><Plus /> Buat Open Trip</Button></div>
      </div>

      <div className="operator-home-metrics">
        <HomeMetric icon={BriefcaseBusiness} label="Trip terbit" value="2" note="1 selesai · 1 mendatang" tone="blue" />
        <HomeMetric icon={ShieldCheck} label="Truth Score" value="94%" note="Dari 1 trip selesai" tone="green" />
        <HomeMetric icon={Users} label="Peserta terverifikasi" value="14" note="Bromo Sunrise Weekend" tone="navy" />
        <HomeMetric icon={MessageSquareText} label="Reality Check masuk" value="8/14" note="6 peserta belum mengisi" tone="amber" />
      </div>

      <div className="operator-home-grid">
        <article className="operator-integrity-card">
          <div className="operator-card-heading"><div><small>TRUTH GUARD OVERVIEW</small><h2>Skor Bukti Operator</h2></div><span><ShieldCheck /> Bukti tinggi</span></div>
          <div className="operator-integrity-main"><div className="operator-integrity-ring"><strong>94%</strong><span>truth score</span></div><div className="operator-integrity-legend"><div><i /><span>Janji dipenuhi</span><b>75%</b></div><div><i className="transparent" /><span>Berubah transparan</span><b>25%</b></div><div><i className="unresolved" /><span>Tidak dipenuhi</span><b>0%</b></div></div></div>
          <p className="operator-score-note">Truth Score demo dihitung dari status janji, kelengkapan bukti, dan konfirmasi Trip Pass—bukan rating kepuasan.</p>
        </article>
        <article className="operator-attention-card">
          <div className="operator-card-heading"><div><small>PERLU TINDAKAN</small><h2>Selesaikan berikutnya</h2></div><b className="attention-count">1</b></div>
          <HomeTask icon={AlertCircle} title="Bromo Sunrise — Selesai" stats={[["Promise Card","Terkunci"],["Peserta terverifikasi","14/14"],["Reality Check masuk","8/14"]]} status="Perlu ditinjau" action="Tinjau Hasil" href="/tour?slug=bromo-sunrise-weekend#reality" urgent />
          <a className="operator-link" href="/account?tab=open-tours">Lihat semua perjalanan <ArrowRight /></a>
        </article>
      </div>

      <article className="operator-performance-card"><div className="operator-card-heading"><div><small>PERFORMA JANJI</small><h2>Hasil dari perjalanan yang sudah selesai</h2></div><a className="operator-link" href="/account?tab=promises">Lihat Promise Card <ArrowRight /></a></div><div className="operator-performance-grid"><HomePerformance label="Transportasi sesuai" value={100} status="Dipenuhi" /><HomePerformance label="Tanpa biaya tambahan" value={100} status="Dipenuhi" /><HomePerformance label="Batas peserta" value={100} status="Dipenuhi" /><HomePerformance label="Titik sunrise" value={75} status="Berubah transparan" warning /></div></article>

      <div className="operator-bottom-grid"><article className="operator-activity-card"><div className="operator-card-heading"><div><small>AKTIVITAS DEMO</small><h2>Update dari perjalananmu</h2></div></div><HomeActivity icon={MessageSquareText} title="8 peserta mengisi Reality Check" detail="Bromo Sunrise · data demonstrasi" href="/tour?slug=bromo-sunrise-weekend#reality" /><HomeActivity icon={FileCheck2} title="Perubahan itinerary tercatat" detail="Bromo Sunrise · data demonstrasi" href="/tour?slug=bromo-sunrise-weekend#changes" /><HomeActivity icon={ShieldCheck} title="Promise Card dikunci" detail="Bromo Photography · data demonstrasi" href="/tour?slug=bromo-photography-trip#promise" /></article><article className="operator-quick-card"><div className="operator-card-heading"><div><small>AKSI CEPAT</small><h2>Mulai dari sini</h2></div></div><div className="operator-quick-grid"><HomeQuickAction icon={Plus} label="Buat Open Trip" href="/account?tab=create-tour" /><HomeQuickAction icon={FileCheck2} label="Kelola Promise Card" href="/account?tab=promises" /><HomeQuickAction icon={Send} label="Kirim Trip Pass" href="/account?tab=participants" /><HomeQuickAction icon={Clock3} label="Catat Perubahan" href="/account?tab=changes" /></div></article></div>
    </div>
  </section>;
}

function HomeMetric({ icon: Icon, label, value, note, tone }: { icon: typeof Heart; label: string; value: string; note: string; tone: string }) { return <article className={`operator-metric ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></article>; }
function HomeTask({ icon: Icon, title, stats, status, action, href, urgent }: { icon: typeof Heart; title: string; stats: [string,string][]; status: string; action: string; href: string; urgent?: boolean }) { return <div className={`operator-task ${urgent ? "urgent" : ""}`}><span><Icon /></span><div><strong>{title}</strong><dl>{stats.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><small>{status}</small></div><a href={href}>{action}</a></div>; }
function HomePerformance({ label, value, status, warning }: { label: string; value: number; status: string; warning?: boolean }) { return <div className={`operator-performance ${warning ? "warning" : ""}`}><div><strong>{label}</strong><span>{status}</span></div><b>{value}%</b><i><em style={{width:`${value}%`}} /></i></div>; }
function HomeActivity({ icon: Icon, title, detail, href }: { icon: typeof Heart; title: string; detail: string; href: string }) { return <a className="operator-activity" href={href}><span><Icon /></span><div><strong>{title}</strong><small>{detail}</small></div><ArrowRight /></a>; }
function HomeQuickAction({ icon: Icon, label, href }: { icon: typeof Heart; label: string; href: string }) { return <a className="operator-quick-action" href={href}><span><Icon /></span><strong>{label}</strong><ArrowRight /></a>; }
