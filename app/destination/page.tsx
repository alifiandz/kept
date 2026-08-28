"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tour = {
  slug: string;
  name: string;
  operator: string;
  departure: string;
  date: string;
  duration: string;
  price: number;
  rating: number;
  participants: number;
  summary: string;
  image: string;
};

type Destination = {
  slug: string;
  name: string;
  place: string;
  category: string;
  rating: number;
  startingPrice: string;
  description: string;
  longDescription: string;
  images: string[];
};

const bromoImages = [
  "/bromo.webp",
  "https://anekatempatwisata.com/wp-content/uploads/2015/07/Gunung-Bromo-Jawa-Timur.jpg",
  "https://newint.org/sites/default/files/2025-10/pg46a-1_0.jpg",
];

const destinationData: Record<string, Destination> = {
  "gunung-bromo": { slug: "gunung-bromo", name: "Gunung Bromo", place: "Jawa Timur", category: "Gunung", rating: 92, startingPrice: "Rp475.000", description: "Sunrise vulkanik, Lautan Pasir, dan jalur jeep dalam satu perjalanan singkat.", longDescription: "Gunung Bromo adalah salah satu destinasi open trip paling populer di Jawa Timur. Wisatawan dapat menikmati matahari terbit dari kawasan Penanjakan, melintasi Lautan Pasir dengan jeep, lalu mengunjungi kawah dan Bukit Teletubbies. KEPT membantu kamu membandingkan operator berdasarkan janji yang benar-benar mereka penuhi.", images: bromoImages },
  "labuan-bajo": { slug: "labuan-bajo", name: "Labuan Bajo", place: "Nusa Tenggara Timur", category: "Laut & Pulau", rating: 96, startingPrice: "Rp2.350.000", description: "Berlayar ke Pulau Padar, Pink Beach, dan Manta Point dengan kapal liveaboard.", longDescription: "Labuan Bajo menjadi pintu masuk menuju gugusan pulau Komodo. Pilihan open trip biasanya berupa perjalanan liveaboard dengan kombinasi trekking, snorkeling, dan island hopping.", images: ["/labuan-bajo.webp", "/labuan-bajo.webp", "/labuan-bajo.webp"] },
  "dieng-plateau": { slug: "dieng-plateau", name: "Dieng Plateau", place: "Jawa Tengah", category: "Alam", rating: 88, startingPrice: "Rp395.000", description: "Dataran tinggi sejuk dengan sunrise Sikunir, telaga vulkanik, dan candi kuno.", longDescription: "Dieng menawarkan kombinasi wisata alam dan budaya di dataran tinggi. Open trip biasanya mencakup sunrise Sikunir, Telaga Warna, Kawah Sikidang, serta kompleks Candi Arjuna.", images: ["/dieng.webp", "/dieng.webp", "/dieng.webp"] },
  "nusa-penida": { slug: "nusa-penida", name: "Nusa Penida", place: "Bali", category: "Laut & Pulau", rating: 91, startingPrice: "Rp650.000", description: "Tebing dramatis, pantai tersembunyi, dan laut biru dalam perjalanan pulau sehari.", longDescription: "Nusa Penida dikenal melalui Kelingking Beach, Broken Beach, dan Crystal Bay. Operator menawarkan perjalanan satu hingga dua hari dengan berbagai pilihan rute dan fasilitas.", images: ["https://cdn.bookaway.com/media/files/5d82152021264e34310ccdfe.jpeg?quality=50&width=2000", "https://www.pronititravel.com/wp-content/uploads/2025/04/Bali-2.png", "https://cdn.bookaway.com/media/files/5d82152021264e34310ccdfe.jpeg?quality=50&width=2000"] },
  "raja-ampat": { slug: "raja-ampat", name: "Raja Ampat", place: "Papua Barat Daya", category: "Petualangan", rating: 95, startingPrice: "Rp5.750.000", description: "Gugusan karst, laguna jernih, dan kehidupan laut untuk petualangan jarak jauh.", longDescription: "Raja Ampat menawarkan perjalanan laut, snorkeling, dan panorama gugusan karst. Karena biayanya besar, detail kapal, penginapan, konsumsi, dan biaya tambahan perlu dibandingkan secara jelas.", images: ["https://get.wallhere.com/photo/landscape-sea-bay-lake-water-nature-reflection-coast-lagoon-Terrain-ocean-archipelago-islet-tropics-habitat-natural-environment-computer-wallpaper-landform-geographical-feature-ecosystem-body-of-water-93000.jpg", "https://get.wallhere.com/photo/landscape-sea-bay-lake-water-nature-reflection-coast-lagoon-Terrain-ocean-archipelago-islet-tropics-habitat-natural-environment-computer-wallpaper-landform-geographical-feature-ecosystem-body-of-water-93000.jpg", "https://get.wallhere.com/photo/landscape-sea-bay-lake-water-nature-reflection-coast-lagoon-Terrain-ocean-archipelago-islet-tropics-habitat-natural-environment-computer-wallpaper-landform-geographical-feature-ecosystem-body-of-water-93000.jpg"] },
  "gunung-rinjani": { slug: "gunung-rinjani", name: "Gunung Rinjani", place: "Nusa Tenggara Barat", category: "Gunung", rating: 93, startingPrice: "Rp1.850.000", description: "Pendakian menantang menuju punggungan gunung dan panorama Danau Segara Anak.", longDescription: "Rinjani membutuhkan persiapan, peralatan, porter, dan pengelolaan keselamatan yang jelas. KEPT memperlihatkan apakah fasilitas dan batas peserta yang dijanjikan operator benar-benar terpenuhi.", images: ["https://images.ctfassets.net/rc3dlxapnu6k/7nXzcuNvuwVoGMXbOFwuHM/0d842621bafca9baa5fde978e931d43c/Indonesien__Lombok__Senaru.jpg?fm=webp&q=50&w=2048", "https://images.ctfassets.net/rc3dlxapnu6k/7nXzcuNvuwVoGMXbOFwuHM/0d842621bafca9baa5fde978e931d43c/Indonesien__Lombok__Senaru.jpg?fm=webp&q=50&w=2048", "https://images.ctfassets.net/rc3dlxapnu6k/7nXzcuNvuwVoGMXbOFwuHM/0d842621bafca9baa5fde978e931d43c/Indonesien__Lombok__Senaru.jpg?fm=webp&q=50&w=2048"] },
  "belitung": { slug: "belitung", name: "Belitung", place: "Kepulauan Bangka Belitung", category: "Laut & Pulau", rating: 90, startingPrice: "Rp1.250.000", description: "Pantai putih, batu granit raksasa, dan island hopping di perairan yang tenang.", longDescription: "Belitung cocok untuk perjalanan santai dengan kombinasi pantai, pulau kecil, kuliner, dan lokasi budaya. Pilihan operator dapat dibandingkan berdasarkan transportasi, akomodasi, dan biaya yang termasuk.", images: ["https://belitongekspres.disway.id/upload/e45f844460cad1327cd6c447afd9f650.jpg", "https://belitongekspres.disway.id/upload/e45f844460cad1327cd6c447afd9f650.jpg", "https://belitongekspres.disway.id/upload/e45f844460cad1327cd6c447afd9f650.jpg"] },
  "borobudur": { slug: "borobudur", name: "Borobudur", place: "Magelang, Jawa Tengah", category: "Budaya", rating: 89, startingPrice: "Rp325.000", description: "Warisan budaya, desa sekitar candi, dan lanskap perbukitan dalam satu rute.", longDescription: "Perjalanan Borobudur dapat dikombinasikan dengan wisata desa, kuliner, dan situs budaya lain. KEPT membantu wisatawan membedakan harga dasar, tiket, kendaraan, dan fasilitas pendamping.", images: ["https://upload.wikimedia.org/wikipedia/commons/f/f2/Wisatawan_Domestic_di_Borobudur.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f2/Wisatawan_Domestic_di_Borobudur.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f2/Wisatawan_Domestic_di_Borobudur.jpg"] },
};

const bromoTours: Tour[] = [
  { slug: "bromo-sunrise-weekend", name: "Bromo Sunrise Weekend", operator: "Jelajah Aruna", departure: "Malang", date: "12–13 Sep 2026", duration: "2H1M", price: 649000, rating: 94, participants: 15, summary: "Penanjakan, Lautan Pasir, kawah, dan Bukit Teletubbies.", image: bromoImages[0] },
  { slug: "bromo-midnight-escape", name: "Bromo Midnight Escape", operator: "Langkah Pagi", departure: "Surabaya", date: "19 Sep 2026", duration: "1 hari", price: 475000, rating: 90, participants: 12, summary: "Perjalanan tengah malam dengan jeep dan sarapan setelah sunrise.", image: bromoImages[1] },
  { slug: "bromo-tumpak-sewu", name: "Bromo + Tumpak Sewu", operator: "Ruang Jelajah", departure: "Malang", date: "25–27 Sep 2026", duration: "3H2M", price: 1250000, rating: 91, participants: 18, summary: "Dua ikon Jawa Timur dalam satu perjalanan akhir pekan.", image: bromoImages[2] },
  { slug: "bromo-photography-trip", name: "Bromo Photography Trip", operator: "Lensa Nusantara", departure: "Malang", date: "2–3 Okt 2026", duration: "2H1M", price: 825000, rating: 96, participants: 10, summary: "Rute sunrise khusus dengan mentor fotografi dan grup kecil.", image: bromoImages[0] },
  { slug: "bromo-family-trip", name: "Bromo Family Trip", operator: "Keluarga Jalan", departure: "Surabaya", date: "9–10 Okt 2026", duration: "2H1M", price: 725000, rating: 89, participants: 16, summary: "Tempo santai, penginapan keluarga, dan itinerary ramah anak.", image: bromoImages[1] },
  { slug: "bromo-budget-trip", name: "Bromo Budget Trip", operator: "Trip Hemat", departure: "Yogyakarta", date: "15–16 Okt 2026", duration: "2H1M", price: 525000, rating: 86, participants: 20, summary: "Pilihan ekonomis dengan transportasi bus dan homestay bersama.", image: bromoImages[2] },
  { slug: "bromo-premium-escape", name: "Bromo Premium Escape", operator: "Arunika Travel", departure: "Surabaya", date: "22–23 Okt 2026", duration: "2H1M", price: 1450000, rating: 97, participants: 8, summary: "Hotel nyaman, jeep privat, dan itinerary fleksibel untuk grup kecil.", image: bromoImages[0] },
  { slug: "bromo-camping-night", name: "Bromo Camping Night", operator: "Basecamp Kita", departure: "Malang", date: "29–30 Okt 2026", duration: "2H1M", price: 785000, rating: 92, participants: 14, summary: "Camping, api unggun, dan sunrise dengan perlengkapan termasuk.", image: bromoImages[1] },
];

function toursFor(destination: Destination): Tour[] {
  if (destination.slug === "gunung-bromo") return bromoTours;
  return Array.from({ length: 8 }, (_, index) => ({
    slug: `${destination.slug}-trip-${index + 1}`,
    name: `${destination.name} ${index % 2 === 0 ? "Essential" : "Weekend"} ${index + 1}`,
    operator: ["Jelajah Aruna", "Langkah Pagi", "Nusa Trip", "Ruang Jelajah"][index % 4],
    departure: ["Yogyakarta", "Jakarta", "Surabaya", "Denpasar"][index % 4],
    date: `${12 + index}–${13 + index} Okt 2026`,
    duration: index % 2 === 0 ? "2H1M" : "3H2M",
    price: 550000 + index * 175000,
    rating: Math.max(82, destination.rating - 4 + (index % 7)),
    participants: 10 + index,
    summary: destination.description,
    image: destination.images[index % destination.images.length],
  }));
}

export default function DestinationPage() {
  const [slug, setSlug] = useState("gunung-bromo");
  const [departure, setDeparture] = useState("Semua");
  const [maxPrice, setMaxPrice] = useState("3000000");
  const [minRating, setMinRating] = useState("0");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("slug");
    if (requested && destinationData[requested]) setSlug(requested);
  }, []);

  const destination = destinationData[slug] ?? destinationData["gunung-bromo"];
  const tours = useMemo(() => toursFor(destination), [destination]);
  const filteredTours = useMemo(() => tours.filter((tour) => {
    const departureMatch = departure === "Semua" || tour.departure === departure;
    const priceMatch = tour.price <= Number(maxPrice);
    const ratingMatch = tour.rating >= Number(minRating);
    const searchMatch = !search || `${tour.name} ${tour.operator}`.toLowerCase().includes(search.toLowerCase());
    return departureMatch && priceMatch && ratingMatch && searchMatch;
  }), [tours, departure, maxPrice, minRating, search]);

  return <main className="detail-page">
    <header className="site-header detail-header"><a className="brand" href="/"><span className="brand-mark"><Check /></span><span>KEPT</span></a><nav className="main-nav"><a href="/">Beranda</a><a href="#available">Open Tour</a><a href="#about-place">Tentang Destinasi</a></nav><Button variant="outline" onClick={() => history.back()}><ArrowLeft /> Kembali</Button></header>

    <section className="destination-hero section-wrap" id="about-place">
      <div className="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/#destinations">Destinasi</a><span>/</span><strong>{destination.name}</strong></div>
      <div className="destination-title-row"><div><span className="detail-kicker">{destination.category} · {destination.place}</span><h1>{destination.name}</h1><p>{destination.longDescription}</p></div><div className="destination-summary-card"><div><small>Estimasi mulai</small><strong>{destination.startingPrice}</strong></div><div><small>Rating KEPT</small><strong><ShieldCheck />{destination.rating}%</strong></div><div><small>Open tour</small><strong>{tours.length}</strong></div></div></div>
      <div className="destination-gallery"><img src={destination.images[0]} alt={`${destination.name} utama`} /><img src={destination.images[1]} alt={`${destination.name} pemandangan`} /><img src={destination.images[2]} alt={`${destination.name} perjalanan`} /><button><BadgeCheck /> Semua Foto</button></div>
    </section>

    <section className="tour-market section-wrap" id="available">
      <div className="section-heading"><div><span className="section-kicker">OPEN TOUR TERSEDIA</span><h2>Pilih perjalanan ke {destination.name}</h2><p>Bandingkan harga, jadwal, operator, dan persentase janji yang dipenuhi.</p></div><span className="result-count">{filteredTours.length} tour ditemukan</span></div>
      <div className="tour-filter-bar">
        <label><Search /><span><small>Cari tour atau operator</small><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama tour..." /></span></label>
        <label><MapPin /><span><small>Berangkat dari</small><select value={departure} onChange={(event) => setDeparture(event.target.value)}><option>Semua</option><option>Malang</option><option>Surabaya</option><option>Yogyakarta</option><option>Jakarta</option><option>Denpasar</option></select></span><ChevronDown /></label>
        <label><SlidersHorizontal /><span><small>Harga maksimal</small><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="3000000">Rp3.000.000</option><option value="1500000">Rp1.500.000</option><option value="1000000">Rp1.000.000</option><option value="750000">Rp750.000</option></select></span><ChevronDown /></label>
        <label><ShieldCheck /><span><small>Rating minimal</small><select value={minRating} onChange={(event) => setMinRating(event.target.value)}><option value="0">Semua rating</option><option value="85">85%+</option><option value="90">90%+</option><option value="95">95%+</option></select></span><ChevronDown /></label>
      </div>

      <div className="tour-card-grid">
        {filteredTours.length ? filteredTours.map((tour) => <article className="tour-market-card" key={tour.slug}>
          <a className="tour-market-image" href={`/tour?slug=${tour.slug}`}><img src={tour.image} alt={tour.name} /><span>{tour.duration}</span></a>
          <div className="tour-market-body"><div className="operator-chip"><BadgeCheck />{tour.operator}</div><h3>{tour.name}</h3><p>{tour.summary}</p><div className="tour-mini-meta"><span><CalendarDays />{tour.date}</span><span><MapPin />Dari {tour.departure}</span><span><Users />Maks. {tour.participants}</span></div><div className="tour-market-footer"><div><small>Mulai dari</small><strong>{formatPrice(tour.price)}</strong></div><div><small>Janji dipenuhi</small><strong className="kept-score"><ShieldCheck />{tour.rating}%</strong></div></div><a className="full-tour-link" href={`/tour?slug=${tour.slug}`}>Lihat detail & bukti <ArrowRight /></a></div>
        </article>) : <div className="empty-state">Tidak ada tour yang sesuai dengan filter ini.</div>}
      </div>
    </section>

    <footer className="site-footer expanded-footer detail-footer"><div className="footer-brand"><span className="brand-mark"><Check /></span><span><strong>KEPT</strong><small>Did they keep their promise?</small></span></div><div className="footer-column"><strong>Jelajahi</strong><a href="/">Beranda</a><a href="/#destinations">Destinasi</a><a href="/#how-it-works">Cara Kerja</a></div><div className="footer-column"><strong>Hubungi Kami</strong><a href="mailto:hello@kept.id"><Mail />hello@kept.id</a><a href="tel:+6281234567890"><Phone />+62 812-3456-7890</a><a href="/"><AtSign />@kept.id</a></div></footer>
  </main>;
}

function formatPrice(value: number) { return `Rp${value.toLocaleString("id-ID")}`; }
