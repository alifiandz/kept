export type TourStatus = "Selesai" | "Berlangsung" | "Tersedia";

export type Operator = {
  name: string;
  initials: string;
  email: string;
  phone: string;
  verified: boolean;
};

export type PromiseItem = {
  title: string;
  detail: string;
};

export type ChangeItem = {
  recordedAt: string;
  title: string;
  explanation: string;
  evidence: string[];
};

export type RealityItem = {
  promise: string;
  reality: string;
  status: "Dipenuhi" | "Berubah transparan" | "Tidak dipenuhi";
  kind: "kept" | "changed" | "missed";
};

export type Tour = {
  slug: string;
  destinationSlug: string;
  name: string;
  operator: Operator;
  departure: string;
  date: string;
  duration: string;
  price: number;
  score: number | null;
  capacity: number;
  verifiedParticipants: number;
  summary: string;
  image: string;
  status: TourStatus;
  meetingPoint: string;
  departureTime: string;
  promiseVersion: string;
  promiseLockedAt: string;
  promises: PromiseItem[];
  changes: ChangeItem[];
  reality: RealityItem[];
};

export type Destination = {
  id: number;
  slug: string;
  name: string;
  place: string;
  category: "Gunung" | "Laut & Pulau" | "Alam" | "Petualangan" | "Budaya";
  score: number;
  description: string;
  longDescription: string;
  heroImage: string;
  gallery: { src: string; label: string; alt: string }[];
  facts: { label: string; value: string }[];
};

const image = (slug: string, index: number) => `/destinations/${slug}/${String(index).padStart(2, "0")}.webp`;

const operators: Record<string, Operator> = {
  aruna: { name: "Jelajah Aruna", initials: "JA", email: "halo@jelajaharuna.id", phone: "+6281234101201", verified: true },
  pagi: { name: "Langkah Pagi", initials: "LP", email: "trip@langkahpagi.id", phone: "+6281234101202", verified: true },
  nusa: { name: "Nusa Sail", initials: "NS", email: "hello@nusasail.id", phone: "+6281234101203", verified: true },
  flores: { name: "Flores Journey", initials: "FJ", email: "booking@floresjourney.id", phone: "+6281234101204", verified: true },
  tengah: { name: "Jelajah Tengah", initials: "JT", email: "halo@jelajahtengah.id", phone: "+6281234101205", verified: true },
  island: { name: "Island Steps", initials: "IS", email: "trip@islandsteps.id", phone: "+6281234101206", verified: true },
  papua: { name: "Papua Blue", initials: "PB", email: "hello@papuablue.id", phone: "+6281234101207", verified: true },
  rinjani: { name: "Rinjani Trek", initials: "RT", email: "summit@rinjanitrek.id", phone: "+6281234101208", verified: true },
  laskar: { name: "Laskar Trip", initials: "LT", email: "halo@laskartrip.id", phone: "+6281234101209", verified: true },
  budaya: { name: "Ruang Budaya", initials: "RB", email: "trip@ruangbudaya.id", phone: "+6281234101210", verified: true },
};

export const destinations: Destination[] = [
  {
    id: 1, slug: "gunung-bromo", name: "Gunung Bromo", place: "Jawa Timur", category: "Gunung", score: 92,
    description: "Sunrise vulkanik, Lautan Pasir, dan jalur jeep dalam satu perjalanan singkat.",
    longDescription: "Gunung Bromo adalah salah satu tujuan open trip paling populer di Jawa Timur. Bandingkan rute, kapasitas jeep, penginapan, dan biaya berdasarkan janji yang tercatat sebelum keberangkatan.",
    heroImage: image("gunung-bromo", 1),
    gallery: [
      { src: image("gunung-bromo", 2), label: "Kaldera Tengger", alt: "Kaldera Tengger di kawasan Gunung Bromo" },
      { src: image("gunung-bromo", 3), label: "Kawah Bromo", alt: "Kawah Gunung Bromo" },
      { src: image("gunung-bromo", 4), label: "Lautan Pasir", alt: "Lautan Pasir di kaki Gunung Bromo" },
      { src: image("gunung-bromo", 5), label: "Lanskap Bromo", alt: "Lanskap pegunungan Bromo" },
    ],
    facts: [
      { label: "Daya tarik", value: "Sunrise, Lautan Pasir, kawah, dan savana." },
      { label: "Cocok untuk", value: "Perjalanan akhir pekan dan fotografi lanskap." },
      { label: "Waktu terbaik", value: "April–Oktober saat peluang cuaca cerah lebih besar." },
    ],
  },
  {
    id: 2, slug: "labuan-bajo", name: "Labuan Bajo", place: "Nusa Tenggara Timur", category: "Laut & Pulau", score: 96,
    description: "Berlayar ke Pulau Padar, Pink Beach, dan perairan Komodo dengan kapal liveaboard.",
    longDescription: "Labuan Bajo adalah gerbang menuju Taman Nasional Komodo. Kept membantu wisatawan memeriksa tipe kapal, kabin, rute, konsumsi, serta biaya konservasi sebelum menghubungi operator.",
    heroImage: image("labuan-bajo", 2),
    gallery: [
      { src: image("labuan-bajo", 1), label: "Pelabuhan Labuan Bajo", alt: "Kapal wisata di pelabuhan Labuan Bajo" },
      { src: image("labuan-bajo", 3), label: "Pink Beach", alt: "Pantai berpasir merah muda di kawasan Komodo" },
      { src: image("labuan-bajo", 4), label: "Komodo", alt: "Komodo di kawasan Taman Nasional Komodo" },
      { src: image("labuan-bajo", 5), label: "Manta Point", alt: "Ikan pari manta di perairan Komodo" },
    ],
    facts: [
      { label: "Daya tarik", value: "Pulau Padar, Pink Beach, snorkeling, dan liveaboard." },
      { label: "Cocok untuk", value: "Island hopping dan perjalanan grup beberapa hari." },
      { label: "Perlu diperiksa", value: "Tipe kabin, biaya konservasi, dan perlengkapan keselamatan." },
    ],
  },
  {
    id: 3, slug: "dieng-plateau", name: "Dieng Plateau", place: "Jawa Tengah", category: "Alam", score: 88,
    description: "Dataran tinggi sejuk dengan sunrise Sikunir, telaga vulkanik, dan candi kuno.",
    longDescription: "Dieng memadukan wisata alam dan budaya dalam perjalanan singkat. Periksa titik jemput, kendaraan, tiket lokasi, dan alternatif rute ketika cuaca berubah.",
    heroImage: image("dieng-plateau", 1),
    gallery: [
      { src: image("dieng-plateau", 2), label: "Sunrise Sikunir", alt: "Matahari terbit dari Bukit Sikunir" },
      { src: image("dieng-plateau", 3), label: "Telaga Warna", alt: "Telaga Warna di Dataran Tinggi Dieng" },
      { src: image("dieng-plateau", 4), label: "Candi Arjuna", alt: "Kompleks Candi Arjuna Dieng" },
      { src: image("dieng-plateau", 5), label: "Lanskap Dieng", alt: "Lanskap dataran tinggi Dieng" },
    ],
    facts: [
      { label: "Daya tarik", value: "Sikunir, Telaga Warna, kawah, dan Candi Arjuna." },
      { label: "Cocok untuk", value: "Wisata alam, budaya, dan perjalanan singkat." },
      { label: "Persiapan", value: "Pakaian hangat dan rencana cadangan saat berkabut." },
    ],
  },
  {
    id: 4, slug: "nusa-penida", name: "Nusa Penida", place: "Bali", category: "Laut & Pulau", score: 91,
    description: "Tebing dramatis, pantai tersembunyi, dan laut biru dalam perjalanan pulau sehari.",
    longDescription: "Nusa Penida memiliki jarak antarlokasi dan kondisi jalan yang perlu diperhitungkan. Bandingkan rute, kendaraan, tiket fast boat, dan durasi nyata di setiap titik.",
    heroImage: image("nusa-penida", 7),
    gallery: [
      { src: image("nusa-penida", 2), label: "Kelingking Beach", alt: "Tebing Kelingking Beach Nusa Penida" },
      { src: image("nusa-penida", 3), label: "Broken Beach", alt: "Lengkungan alami Broken Beach" },
      { src: image("nusa-penida", 4), label: "Crystal Bay", alt: "Pantai dan perairan Crystal Bay" },
      { src: image("nusa-penida", 5), label: "Diamond Beach", alt: "Tebing dan pantai Diamond Beach" },
    ],
    facts: [
      { label: "Daya tarik", value: "Kelingking, Broken Beach, Crystal Bay, dan Diamond Beach." },
      { label: "Cocok untuk", value: "Day trip, fotografi, dan snorkeling." },
      { label: "Perlu diperiksa", value: "Rute timur/barat, fast boat, dan waktu tunggu." },
    ],
  },
  {
    id: 5, slug: "raja-ampat", name: "Raja Ampat", place: "Papua Barat Daya", category: "Petualangan", score: 95,
    description: "Gugusan karst, laguna jernih, dan kehidupan laut untuk petualangan jarak jauh.",
    longDescription: "Perjalanan Raja Ampat memiliki biaya dan logistik kompleks. Kept memisahkan harga paket dari tiket pesawat, izin konservasi, transfer kapal, dan biaya tambahan lainnya.",
    heroImage: image("raja-ampat", 7),
    gallery: [
      { src: image("raja-ampat", 2), label: "Piaynemo", alt: "Gugusan pulau karst Piaynemo" },
      { src: image("raja-ampat", 3), label: "Wayag", alt: "Pemandangan gugusan Wayag Raja Ampat" },
      { src: image("raja-ampat", 4), label: "Laguna", alt: "Laguna biru Raja Ampat" },
      { src: image("raja-ampat", 5), label: "Bawah laut", alt: "Kehidupan bawah laut Raja Ampat" },
    ],
    facts: [
      { label: "Daya tarik", value: "Piaynemo, Wayag, snorkeling, dan desa pulau." },
      { label: "Cocok untuk", value: "Ekspedisi laut dan perjalanan beberapa hari." },
      { label: "Perlu diperiksa", value: "Izin konservasi, transfer kapal, dan cuaca laut." },
    ],
  },
  {
    id: 6, slug: "gunung-rinjani", name: "Gunung Rinjani", place: "Nusa Tenggara Barat", category: "Gunung", score: 93,
    description: "Pendakian menantang menuju punggungan gunung dan panorama Danau Segara Anak.",
    longDescription: "Pendakian Rinjani membutuhkan peralatan, porter, logistik, dan prosedur keselamatan yang jelas. Promise Card memperlihatkan semua komponen tersebut sebelum peserta memilih operator.",
    heroImage: image("gunung-rinjani", 1),
    gallery: [
      { src: image("gunung-rinjani", 2), label: "Segara Anak", alt: "Danau Segara Anak di Gunung Rinjani" },
      { src: image("gunung-rinjani", 3), label: "Crater Rim", alt: "Pemandangan dari punggungan kawah Rinjani" },
      { src: image("gunung-rinjani", 4), label: "Jalur pendakian", alt: "Jalur pendakian Gunung Rinjani" },
      { src: image("gunung-rinjani", 5), label: "Perkemahan", alt: "Area perkemahan pendaki Rinjani" },
    ],
    facts: [
      { label: "Daya tarik", value: "Puncak, crater rim, dan Danau Segara Anak." },
      { label: "Cocok untuk", value: "Pendaki dengan kondisi fisik dan persiapan memadai." },
      { label: "Perlu diperiksa", value: "Rasio porter, peralatan, izin, dan evakuasi." },
    ],
  },
  {
    id: 7, slug: "belitung", name: "Belitung", place: "Kepulauan Bangka Belitung", category: "Laut & Pulau", score: 90,
    description: "Pantai putih, batu granit raksasa, dan island hopping di perairan yang tenang.",
    longDescription: "Belitung cocok untuk perjalanan santai yang menggabungkan pantai, pulau kecil, dan kuliner. Periksa jenis kendaraan, kelas hotel, kapal, dan kondisi pembatalan karena cuaca.",
    heroImage: image("belitung", 1),
    gallery: [
      { src: image("belitung", 2), label: "Tanjung Tinggi", alt: "Batu granit di Pantai Tanjung Tinggi Belitung" },
      { src: image("belitung", 3), label: "Pulau Lengkuas", alt: "Pulau Lengkuas di Belitung" },
      { src: image("belitung", 4), label: "Pantai granit", alt: "Pantai dengan batu granit khas Belitung" },
      { src: image("belitung", 5), label: "Island hopping", alt: "Perairan untuk island hopping di Belitung" },
    ],
    facts: [
      { label: "Daya tarik", value: "Tanjung Tinggi, Pulau Lengkuas, dan pantai granit." },
      { label: "Cocok untuk", value: "Liburan santai, keluarga, dan island hopping." },
      { label: "Perlu diperiksa", value: "Kelas hotel, kapal, kendaraan, dan kebijakan cuaca." },
    ],
  },
  {
    id: 8, slug: "borobudur", name: "Borobudur", place: "Magelang, Jawa Tengah", category: "Budaya", score: 89,
    description: "Warisan budaya, desa sekitar candi, dan lanskap perbukitan dalam satu rute.",
    longDescription: "Perjalanan Borobudur dapat menggabungkan candi, desa, dan kuliner lokal. Kept menjelaskan tiket yang termasuk, akses naik candi, transportasi, dan pendamping perjalanan.",
    heroImage: image("borobudur", 1),
    gallery: [
      { src: image("borobudur", 2), label: "Relief candi", alt: "Relief batu di Candi Borobudur" },
      { src: image("borobudur", 3), label: "Stupa", alt: "Stupa di teras Candi Borobudur" },
      { src: image("borobudur", 4), label: "Lanskap Menoreh", alt: "Borobudur dan lanskap perbukitan Menoreh" },
      { src: image("borobudur", 5), label: "Desa sekitar", alt: "Suasana desa di sekitar Borobudur" },
    ],
    facts: [
      { label: "Daya tarik", value: "Candi Borobudur, desa wisata, dan lanskap Menoreh." },
      { label: "Cocok untuk", value: "Wisata budaya, keluarga, dan perjalanan edukatif." },
      { label: "Perlu diperiksa", value: "Jenis tiket, akses naik candi, dan pemandu." },
    ],
  },
];

const basePromises = (transport: string, stay: string, capacity: number, inclusions: string): PromiseItem[] => [
  { title: "Transportasi", detail: transport },
  { title: "Akomodasi", detail: stay },
  { title: "Batas peserta", detail: `Maksimal ${capacity} peserta dalam satu grup.` },
  { title: "Sudah termasuk", detail: inclusions },
  { title: "Biaya tambahan", detail: "Tidak ada biaya wajib di luar yang tertulis pada Promise Card." },
];

const completedReality = (capacity: number, special: string): RealityItem[] => [
  { promise: `Maksimal ${capacity} peserta`, reality: `${capacity - 1} peserta terverifikasi mengikuti perjalanan`, status: "Dipenuhi", kind: "kept" },
  { promise: "Transportasi sesuai Promise Card", reality: "Jenis dan kapasitas kendaraan sesuai bukti operator dan peserta", status: "Dipenuhi", kind: "kept" },
  { promise: "Tanpa biaya wajib tambahan", reality: "Tidak ada peserta terverifikasi yang melaporkan pungutan wajib", status: "Dipenuhi", kind: "kept" },
  { promise: special, reality: "Penyesuaian diberitahukan sebelum kegiatan dan pengganti disetujui peserta", status: "Berubah transparan", kind: "changed" },
];

const tour = (
  slug: string, destinationSlug: string, name: string, operator: Operator, departure: string,
  date: string, duration: string, price: number, score: number | null, capacity: number,
  summary: string, imageIndex: number, status: TourStatus, meetingPoint: string,
  transport: string, stay: string, inclusions: string, special: string,
): Tour => {
  const completed = status === "Selesai";
  return {
    slug, destinationSlug, name, operator, departure, date, duration, price,
    // Three fulfilled promises (100) plus one transparent change (75): 93.75, rounded to 94.
    score: completed ? 94 : score, capacity,
    verifiedParticipants: completed ? capacity - 1 : 0, summary, image: image(destinationSlug, imageIndex), status,
    meetingPoint, departureTime: status === "Tersedia" ? "Konfirmasi H-2" : "23.30 WIB",
    promiseVersion: "v1.0", promiseLockedAt: completed ? "20 September 2026, 14.32 WIB" : "28 September 2026, 10.15 WIB",
    promises: basePromises(transport, stay, capacity, inclusions),
    changes: completed ? [{
      recordedAt: "Saat perjalanan",
      title: `${special} disesuaikan karena kondisi lapangan`,
      explanation: "Operator mencatat alasan, waktu pemberitahuan, dan pengganti sebelum kegiatan dilanjutkan. Peserta dengan Trip Pass dapat memeriksa bukti dan mengonfirmasi hasilnya.",
      evidence: ["Pemberitahuan peserta", "Foto kondisi lapangan", "Rencana pengganti"],
    }] : [],
    reality: completed ? completedReality(capacity, special) : [],
  };
};

export const tours: Tour[] = [
  tour("bromo-sunrise-weekend", "gunung-bromo", "Bromo Sunrise Weekend", operators.aruna, "Malang", "19–20 Sep 2026", "2H1M", 649000, 94, 15, "Penanjakan, Lautan Pasir, kawah, dan Bukit Teletubbies.", 6, "Selesai", "Stasiun Malang", "Jeep 4WD maksimal 5 peserta dan minibus dari Malang.", "Homestay, 1 kamar maksimal 3 peserta.", "Jeep, homestay, sarapan, tiket kawasan, dan dokumentasi.", "Titik sunrise Penanjakan"),
  tour("bromo-photography-trip", "gunung-bromo", "Bromo Photography Trip", operators.pagi, "Surabaya", "17–18 Okt 2026", "2H1M", 825000, null, 10, "Rute sunrise dengan mentor fotografi dan grup kecil.", 7, "Tersedia", "Stasiun Surabaya Gubeng", "Minibus dan jeep 4WD maksimal 5 peserta.", "Homestay, 1 kamar maksimal 2 peserta.", "Transportasi, mentor, homestay, sarapan, dan tiket kawasan.", "Lokasi sesi fotografi"),
  tour("bromo-family-escape", "gunung-bromo", "Bromo Family Escape", operators.aruna, "Malang", "24–25 Okt 2026", "2H1M", 725000, null, 14, "Tempo santai, penginapan keluarga, dan itinerary ramah anak.", 8, "Tersedia", "Kota Malang", "Minibus ber-AC dan jeep privat per keluarga.", "Family room sesuai komposisi peserta.", "Transportasi, penginapan, dua kali makan, dan tiket kawasan.", "Urutan kunjungan kawah"),

  tour("komodo-weekend-cruise", "labuan-bajo", "Komodo Weekend Cruise", operators.nusa, "Labuan Bajo", "18–20 Sep 2026", "3H2M", 2850000, 96, 12, "Liveaboard menuju Padar, Pink Beach, dan perairan Komodo.", 6, "Selesai", "Pelabuhan Labuan Bajo", "Kapal phinisi berizin dengan jaket pelampung dan sekoci.", "Kabin ber-AC untuk 2 peserta.", "Kapal, kabin, konsumsi, alat snorkeling, dan pemandu.", "Aktivitas snorkeling Manta Point"),
  tour("padar-pink-beach-sailing", "labuan-bajo", "Padar & Pink Beach Sailing", operators.flores, "Labuan Bajo", "16–18 Okt 2026", "3H2M", 3150000, null, 10, "Pelayaran grup kecil dengan kabin privat dan rute utama Komodo.", 7, "Tersedia", "Bandara Komodo", "Kapal phinisi dan antar-jemput bandara.", "Kabin privat ber-AC untuk 2 peserta.", "Kapal, kabin, konsumsi, snorkeling, dan dokumentasi.", "Urutan pulau karena arus laut"),
  tour("komodo-deck-adventure", "labuan-bajo", "Komodo Deck Adventure", operators.nusa, "Labuan Bajo", "23–25 Okt 2026", "3H2M", 2350000, null, 16, "Pilihan dek ekonomis dengan fasilitas dan biaya yang dijelaskan terbuka.", 8, "Tersedia", "Pelabuhan Labuan Bajo", "Kapal wisata berizin dengan perlengkapan keselamatan.", "Shared deck dengan kasur dan tirai privasi.", "Kapal, tempat tidur dek, konsumsi, dan alat snorkeling.", "Titik snorkeling"),

  tour("dieng-golden-sunrise", "dieng-plateau", "Dieng Golden Sunrise", operators.pagi, "Yogyakarta", "19–20 Sep 2026", "2H1M", 475000, 88, 18, "Sunrise Sikunir dan rute ikon Dieng dengan minibus.", 6, "Selesai", "Stasiun Tugu Yogyakarta", "Minibus ber-AC dari Yogyakarta.", "Homestay, 1 kamar maksimal 4 peserta.", "Transportasi, homestay, sarapan, dan tiket lokasi.", "Pendakian Bukit Sikunir"),
  tour("dieng-culture-escape", "dieng-plateau", "Dieng Culture Escape", operators.tengah, "Semarang", "17–18 Okt 2026", "2H1M", 595000, null, 14, "Candi Arjuna, Telaga Warna, dan cerita budaya Dieng.", 7, "Tersedia", "Stasiun Semarang Tawang", "Minibus ber-AC dari Semarang.", "Homestay, 1 kamar maksimal 3 peserta.", "Transportasi, homestay, tiket, pemandu, dan dua kali makan.", "Kunjungan Telaga Warna"),
  tour("dieng-weekday-retreat", "dieng-plateau", "Dieng Weekday Retreat", operators.pagi, "Purwokerto", "21–22 Okt 2026", "2H1M", 395000, null, 12, "Perjalanan hari kerja dengan grup kecil dan tempo santai.", 8, "Tersedia", "Stasiun Purwokerto", "Minibus ber-AC dari Purwokerto.", "Homestay, 1 kamar maksimal 4 peserta.", "Transportasi, homestay, sarapan, dan tiket kawasan.", "Lokasi sunrise"),

  tour("west-penida-day-trip", "nusa-penida", "West Penida Day Trip", operators.island, "Sanur", "20 Sep 2026", "1 hari", 650000, 93, 12, "Kelingking, Broken Beach, Angel's Billabong, dan Crystal Bay.", 6, "Selesai", "Pelabuhan Sanur", "Fast boat pulang-pergi dan mobil maksimal 6 peserta.", "Tanpa menginap.", "Fast boat, mobil, tiket lokasi, makan siang, dan dokumentasi.", "Waktu kunjungan Crystal Bay"),
  tour("penida-east-west", "nusa-penida", "Penida East + West", operators.island, "Sanur", "17–18 Okt 2026", "2H1M", 925000, null, 10, "Rute timur dan barat dengan satu malam di Nusa Penida.", 8, "Tersedia", "Pelabuhan Sanur", "Fast boat dan mobil maksimal 5 peserta.", "Hotel, 1 kamar maksimal 2 peserta.", "Fast boat, mobil, hotel, sarapan, dan tiket lokasi.", "Urutan rute timur"),
  tour("penida-snorkel-escape", "nusa-penida", "Penida Snorkel Escape", operators.island, "Sanur", "25 Okt 2026", "1 hari", 775000, null, 8, "Snorkeling grup kecil dan kunjungan pantai setelah makan siang.", 1, "Tersedia", "Pelabuhan Sanur", "Fast boat dan kapal snorkeling berizin.", "Tanpa menginap.", "Fast boat, kapal, alat snorkeling, pemandu, dan makan siang.", "Titik snorkeling karena arus"),

  tour("piaynemo-essential", "raja-ampat", "Piaynemo Essential", operators.papua, "Sorong", "17–21 Sep 2026", "5H4M", 5750000, 95, 12, "Piaynemo, Arborek, dan snorkeling dari homestay pulau.", 6, "Selesai", "Pelabuhan Sorong", "Speedboat sesuai manifest dan jaket pelampung.", "Homestay pulau, 1 kamar maksimal 2 peserta.", "Transfer kapal, homestay, konsumsi, pemandu, dan alat snorkeling.", "Rute Piaynemo"),
  tour("wayag-explorer", "raja-ampat", "Wayag Explorer", operators.papua, "Sorong", "16–21 Okt 2026", "6H5M", 7250000, null, 10, "Ekspedisi Wayag dengan rincian kapal dan izin yang transparan.", 1, "Tersedia", "Bandara Domine Eduard Osok", "Transfer darat dan speedboat sesuai manifest.", "Homestay pulau, 1 kamar maksimal 2 peserta.", "Transfer, homestay, konsumsi, izin lokal, pemandu, dan snorkeling.", "Rute Wayag karena gelombang"),
  tour("raja-ampat-slow-islands", "raja-ampat", "Raja Ampat Slow Islands", operators.papua, "Sorong", "23–27 Okt 2026", "5H4M", 6250000, null, 8, "Tempo santai, dua pulau basis, dan lebih banyak waktu snorkeling.", 8, "Tersedia", "Pelabuhan Sorong", "Speedboat maksimal 8 peserta.", "Homestay pulau, 1 kamar maksimal 2 peserta.", "Kapal, homestay, konsumsi, pemandu, dan snorkeling.", "Lokasi pulau basis kedua"),

  tour("rinjani-crater-rim", "gunung-rinjani", "Rinjani Crater Rim", operators.rinjani, "Senaru", "18–20 Sep 2026", "3H2M", 1850000, 93, 10, "Pendakian ke crater rim dengan porter dan perlengkapan tercatat.", 6, "Selesai", "Desa Senaru", "Antar-jemput lokal menuju gerbang pendakian.", "Tenda untuk 2 peserta dengan matras dan sleeping bag.", "Izin, pemandu, porter, tenda, makan, air, dan perlengkapan keselamatan.", "Lokasi perkemahan crater rim"),
  tour("rinjani-summit-3d2n", "gunung-rinjani", "Rinjani Summit 3D2N", operators.rinjani, "Sembalun", "16–18 Okt 2026", "3H2M", 2350000, null, 8, "Pendakian puncak dengan rasio porter dan rencana evakuasi jelas.", 7, "Tersedia", "Desa Sembalun", "Antar-jemput lokal menuju gerbang pendakian.", "Tenda untuk 2 peserta dengan perlengkapan tidur.", "Izin, pemandu, porter, tenda, makan, air, dan kotak P3K.", "Percobaan summit karena cuaca"),
  tour("segaranak-four-days", "gunung-rinjani", "Segara Anak Four Days", operators.rinjani, "Senaru", "22–25 Okt 2026", "4H3M", 2850000, null, 8, "Rute lebih lambat menuju Segara Anak dan crater rim.", 8, "Tersedia", "Desa Senaru", "Antar-jemput lokal menuju gerbang pendakian.", "Tenda untuk 2 peserta dengan perlengkapan tidur.", "Izin, pemandu, porter, tenda, makan, air, dan kotak P3K.", "Rute turun"),

  tour("belitung-island-hopping", "belitung", "Belitung Island Hopping", operators.laskar, "Tanjung Pandan", "18–20 Sep 2026", "3H2M", 1250000, 91, 14, "Tanjung Tinggi, Pulau Lengkuas, dan kuliner Belitung.", 6, "Selesai", "Bandara H.A.S. Hanandjoeddin", "Mobil ber-AC dan kapal kayu berjaket pelampung.", "Hotel bintang 3, 1 kamar maksimal 2 peserta.", "Transportasi, hotel, kapal, makan, tiket, dan dokumentasi.", "Pendaratan Pulau Lengkuas"),
  tour("belitung-slow-escape", "belitung", "Belitung Slow Escape", operators.laskar, "Tanjung Pandan", "16–18 Okt 2026", "3H2M", 1450000, null, 10, "Grup kecil, hotel tepi pantai, dan itinerary lebih longgar.", 7, "Tersedia", "Bandara H.A.S. Hanandjoeddin", "Mobil ber-AC dan kapal island hopping.", "Hotel tepi pantai, 1 kamar maksimal 2 peserta.", "Transportasi, hotel, kapal, makan, tiket, dan dokumentasi.", "Jadwal island hopping"),
  tour("belitung-family-weekend", "belitung", "Belitung Family Weekend", operators.laskar, "Tanjung Pandan", "23–25 Okt 2026", "3H2M", 1350000, null, 16, "Itinerary ramah keluarga dengan kamar dan kendaraan yang jelas.", 8, "Tersedia", "Bandara H.A.S. Hanandjoeddin", "Mobil ber-AC dan kapal berjaket pelampung anak.", "Family room sesuai komposisi peserta.", "Transportasi, hotel, kapal, makan, tiket, dan dokumentasi.", "Rute kapal karena cuaca"),

  tour("borobudur-village-trail", "borobudur", "Borobudur Village Trail", operators.tengah, "Yogyakarta", "20 Sep 2026", "1 hari", 325000, 91, 16, "Candi, desa, dan kuliner lokal dengan pemandu budaya.", 6, "Selesai", "Stasiun Tugu Yogyakarta", "Minibus ber-AC maksimal 16 peserta.", "Tanpa menginap.", "Transportasi, tiket pelataran, pemandu, makan siang, dan tur desa.", "Urutan kunjungan candi"),
  tour("temple-village-weekend", "borobudur", "Temple & Village Weekend", operators.budaya, "Yogyakarta", "17–18 Okt 2026", "2H1M", 575000, null, 12, "Borobudur, desa sekitar, dan lokakarya kerajinan.", 7, "Tersedia", "Stasiun Tugu Yogyakarta", "Minibus ber-AC maksimal 12 peserta.", "Guesthouse desa, 1 kamar maksimal 2 peserta.", "Transportasi, guesthouse, tiket, pemandu, lokakarya, dan tiga kali makan.", "Lokasi lokakarya"),
  tour("borobudur-menoreh-cycle", "borobudur", "Borobudur Menoreh Cycle", operators.budaya, "Magelang", "24–25 Okt 2026", "2H1M", 675000, null, 10, "Tur sepeda, desa, dan candi dengan rute alternatif untuk pemula.", 8, "Tersedia", "Terminal Tidar Magelang", "Minibus dan sepeda dengan helm.", "Guesthouse desa, 1 kamar maksimal 2 peserta.", "Transportasi, sepeda, helm, guesthouse, tiket, pemandu, dan makan.", "Rute sepeda karena hujan"),
];

export const getDestination = (slug: string | null | undefined) => destinations.find((destination) => destination.slug === slug);
export const getTour = (slug: string | null | undefined) => tours.find((item) => item.slug === slug);
export const getToursForDestination = (slug: string) => tours.filter((item) => item.destinationSlug === slug);
export const formatPrice = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
