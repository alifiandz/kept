"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { ArrowRight, BadgeCheck, Bell, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronRight, CircleUserRound, ClipboardCheck, FileCheck2, Heart, History, LayoutDashboard, LogOut, MapPin, Plus, Send, Settings, ShieldCheck, TicketCheck, Upload, UserCheck, Users } from "lucide-react";
import { AccountControls } from "@/components/account-controls";
import { KeptLogo } from "@/components/kept-logo";
import { Button } from "@/components/ui/button";
import { demoUser, readKeptUser, saveKeptUser, type KeptUser } from "@/lib/kept-account";
import { destinations as destinationCatalog, formatPrice, getToursForDestination } from "@/lib/kept-data";

const travellerTabs = [
  { value: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { value: "saved", label: "Destinasi Tersimpan", icon: Heart },
  { value: "trips", label: "Trip Saya", icon: TicketCheck },
  { value: "eligibility", label: "Status Organizer", icon: ShieldCheck },
  { value: "profile", label: "Profil & Pengaturan", icon: Settings },
];

const organizerTabs = [
  { value: "organizer", label: "Dashboard Organizer", icon: LayoutDashboard },
  { value: "open-tours", label: "Open Trip Saya", icon: BriefcaseBusiness },
  { value: "create-tour", label: "Buat Open Trip", icon: Plus },
  { value: "promises", label: "Promise Card", icon: FileCheck2 },
  { value: "changes", label: "Change Log", icon: History },
  { value: "participants", label: "Peserta & Trip Pass", icon: UserCheck },
  { value: "reality", label: "Reality Check", icon: ClipboardCheck },
  { value: "profile", label: "Profil & Pengaturan", icon: Settings },
];

type DemoChangeRecord = { title: string; tour: string; reason: string; replacement: string; recordedAt: string; evidence: string };
type DemoTourRecord = { name: string; date: string; departure: string; capacity: string; status: "Draft" };

export default function AccountPage() {
  const [user, setUser] = useState<KeptUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState("overview");
  const [notice, setNotice] = useState("");
  const [requestPlace, setRequestPlace] = useState(false);
  const [changeRecords, setChangeRecords] = useState<DemoChangeRecord[]>([]);
  const [issuedPasses, setIssuedPasses] = useState<string[]>([]);
  const [createdTours, setCreatedTours] = useState<DemoTourRecord[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  const [demoStateLoaded, setDemoStateLoaded] = useState(false);
  const [savedDestinationIds, setSavedDestinationIds] = useState<number[]>([]);

  useEffect(() => {
    const initialUser = readKeptUser();
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    const allowedTabs = initialUser?.mode === "organizer" && initialUser.organizerStatus === "verified" ? organizerTabs : travellerTabs;
    const requestedIsAllowed = requestedTab && allowedTabs.some((item) => item.value === requestedTab);

    setUser(initialUser);
    setHydrated(true);
    setTab(requestedIsAllowed ? requestedTab : initialUser?.mode === "organizer" && initialUser.organizerStatus === "verified" ? "organizer" : "overview");
    try {
      setChangeRecords(JSON.parse(window.localStorage.getItem("kept-demo-changes") || "[]"));
      setIssuedPasses(JSON.parse(window.localStorage.getItem("kept-demo-passes") || "[]"));
      setCreatedTours(JSON.parse(window.localStorage.getItem("kept-demo-tours") || "[]"));
      setSavedDestinationIds(JSON.parse(window.localStorage.getItem("kept-saved-destinations") || "[]"));
    } catch {
      setChangeRecords([]);
      setIssuedPasses([]);
      setCreatedTours([]);
      setSavedDestinationIds([]);
    }
    setDemoStateLoaded(true);

    const sync = () => {
      const next = readKeptUser();
      setUser(next);
      setTab((current) => {
        const nextTabs = next?.mode === "organizer" && next.organizerStatus === "verified" ? organizerTabs : travellerTabs;
        return nextTabs.some((item) => item.value === current) ? current : next?.mode === "organizer" && next.organizerStatus === "verified" ? "organizer" : "overview";
      });
    };

    window.addEventListener("kept-user-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kept-user-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => { if (demoStateLoaded) window.localStorage.setItem("kept-demo-changes", JSON.stringify(changeRecords)); }, [changeRecords, demoStateLoaded]);
  useEffect(() => { if (demoStateLoaded) window.localStorage.setItem("kept-demo-passes", JSON.stringify(issuedPasses)); }, [issuedPasses, demoStateLoaded]);
  useEffect(() => { if (demoStateLoaded) window.localStorage.setItem("kept-demo-tours", JSON.stringify(createdTours)); }, [createdTours, demoStateLoaded]);

  const submitEligibility = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const next = { ...user, organizerStatus: "pending" as const, mode: "traveller" as const };
    saveKeptUser(next);
    setUser(next);
    setNotice("Pengajuan berhasil dikirim. Tim Kept sedang memeriksa kelayakan organizer kamu.");
  };

  const submitTour = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (editingDraft) {
      setNotice("Draft Bromo Family Escape dan Promise Card berhasil diperbarui.");
      setEditingDraft(false);
    } else {
      setCreatedTours((current) => [...current, { name: String(data.get("tour-name")), date: String(data.get("tour-date")), departure: String(data.get("tour-departure")), capacity: String(data.get("tour-capacity")), status: "Draft" }]);
      setNotice("Draft open trip dan Promise Card berhasil dibuat dan disimpan pada perangkat demo ini.");
    }
    setTab("open-tours");
  };

  const submitChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const evidence = data.get("change-evidence");
    const record: DemoChangeRecord = { title: String(data.get("change-title") || "Perubahan baru"), tour: String(data.get("change-tour")), reason: String(data.get("change-reason")), replacement: String(data.get("change-replacement")), recordedAt: String(data.get("change-time")), evidence: evidence instanceof File ? evidence.name : "" };
    setChangeRecords((current) => [...current, record]);
    setNotice("Perubahan, alasan, pengganti, waktu, dan nama bukti tersimpan pada perangkat demo ini.");
    event.currentTarget.reset();
  };

  const issueTripPass = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("participant-email") || "");
    setIssuedPasses((current) => [...current, email]);
    setNotice(`Trip Pass demo diterbitkan untuk ${email}.`);
    event.currentTarget.reset();
  };

  const continueOrganizerDemo = () => {
    if (!user) return;
    const next = { ...user, organizerStatus: "verified" as const, mode: "organizer" as const };
    saveKeptUser(next);
    setUser(next);
    setNotice("Simulasi Organizer aktif. Status ini khusus prototype dan bukan hasil verifikasi produksi.");
    setTab("organizer");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || user.name);
    const next = { ...user, name, email: String(data.get("email") || user.email), initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() };
    saveKeptUser(next);
    setUser(next);
    setNotice("Perubahan profil berhasil disimpan.");
  };

  if (!hydrated) return <main className="account-page"><header className="site-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a></header><section className="account-empty"><span><CircleUserRound /></span><h1>Memuat Account Center…</h1><p>Menyiapkan perjalanan dan profilmu.</p></section></main>;

  if (!user) return <main className="account-page"><header className="site-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><AccountControls /></header><section className="account-empty"><span><CircleUserRound /></span><h1>Masuk untuk membuka Account Center</h1><p>Kelola perjalanan, Trip Pass, dan profil organizermu dari satu tempat.</p><Button onClick={() => { saveKeptUser(demoUser); setUser(demoUser); }}>Gunakan akun demo <ArrowRight /></Button><a href="/">Kembali menjelajah</a></section></main>;

  const tabs = user.mode === "organizer" && user.organizerStatus === "verified" ? organizerTabs : travellerTabs;
  const savedSelections = destinationCatalog.filter((destination) => savedDestinationIds.includes(destination.id)).map((destination) => {
    const trip = [...getToursForDestination(destination.slug)].sort((a, b) => a.price - b.price)[0];
    return { destination, trip };
  });

  return <main className="account-page">
    <header className="site-header account-header"><a className="brand" href="/"><span className="brand-mark"><KeptLogo /></span><span>Kept</span></a><a className="account-back" href="/">Jelajahi Destinasi</a><AccountControls /></header>
    <section className="account-shell">
      <aside className="account-sidebar">
        <div className="account-profile-card"><span>{user.initials}</span><div><strong>{user.name}</strong><small>{user.email}</small></div>{user.organizerStatus === "verified" && <BadgeCheck />}</div>
        <div className={`account-role-banner ${user.organizerStatus}`}><ShieldCheck /><div><small>Status akun</small><strong>{user.organizerStatus === "verified" ? "Organizer Terverifikasi" : user.organizerStatus === "pending" ? "Sedang Ditinjau" : "Traveller"}</strong></div></div>
        {user.organizerStatus === "verified" && <div className="mobile-role-switch" aria-label="Pilih mode akun"><button className={user.mode === "traveller" ? "active" : ""} onClick={() => { const next = { ...user, mode: "traveller" as const }; saveKeptUser(next); setUser(next); setTab("overview"); }}>Traveller</button><button className={user.mode === "organizer" ? "active" : ""} onClick={() => { const next = { ...user, mode: "organizer" as const }; saveKeptUser(next); setUser(next); setTab("organizer"); }}>Organizer</button></div>}
        <nav className="account-tab-list" aria-label="Menu Account Center">{tabs.map(({ value, label, icon: Icon }) => <button type="button" className={tab === value ? "account-nav-button active" : "account-nav-button"} onClick={() => { setNotice(""); setTab(value); }} key={value} aria-current={tab === value ? "page" : undefined}><Icon />{label}<ChevronRight /></button>)}</nav>
        <button className="logout-button" onClick={() => { saveKeptUser(null); setUser(null); }}><LogOut /> Keluar dari akun</button>
      </aside>

      <div className="account-content">
        {notice && <div className="account-notice"><CheckCircle2 />{notice}<button onClick={() => setNotice("")}>×</button></div>}

        {tab === "overview" && <section><PageTitle eyebrow="TRAVELLER CENTER" title={`Halo, ${user.name.split(" ")[0]}.`} description="Semua rencana dan bukti perjalananmu ada di sini." /><div className="account-stat-grid"><Stat icon={Heart} label="Destinasi tersimpan" value={String(savedDestinationIds.length)} /><Stat icon={TicketCheck} label="Trip mendatang" value="1" /><Stat icon={CheckCircle2} label="Reality Check" value="1 menunggu" /></div><div className="account-two-column"><article className="account-panel"><PanelTitle title="Trip berikutnya" action="Lihat Trip Pass" href="/account?tab=trips" /><div className="next-trip"><img src="/destinations/gunung-bromo/07.webp" alt="Bromo Photography Trip" /><div><span><CalendarDays />17–18 Oktober 2026</span><h3>Bromo Photography Trip</h3><p>Langkah Pagi · Berangkat dari Surabaya</p><b>Trip Pass aktif</b></div></div></article><article className="account-panel"><PanelTitle title="Aktivitas terbaru" /><Activity icon={Heart} title={savedDestinationIds.length ? `${savedDestinationIds.length} destinasi disimpan` : "Belum ada destinasi tersimpan"} time="Perangkat ini" /><Activity icon={CheckCircle2} title="Reality Check Bromo menunggu" time="Perjalanan 19–20 Sep" /><Activity icon={TicketCheck} title="Trip Pass BRM-2409-017 aktif" time="Bromo Sunrise Weekend" /></article></div></section>}

        {tab === "saved" && <section><PageTitle eyebrow="KOLEKSI" title="Destinasi tersimpan" description="Pilihan ini sama dengan ikon hati pada halaman utama dan tersimpan di perangkat ini." />{savedSelections.length ? <div className="saved-tour-list">{savedSelections.map(({ destination, trip }) => <SavedTour key={destination.slug} image={destination.heroImage} title={destination.name} operator={`${trip.operator.name} · trip mulai`} score={`${destination.score}%`} price={formatPrice(trip.price)} href={`/destination?slug=${destination.slug}`} />)}</div> : <div className="empty-state"><Heart /><h2>Belum ada destinasi tersimpan</h2><p>Simpan destinasi dari halaman utama untuk melihatnya di sini.</p><Button asChild><a href="/#destinations">Jelajahi destinasi</a></Button></div>}</section>}

        {tab === "trips" && <section><PageTitle eyebrow="PERJALANANMU" title="Trip dan Trip Pass" description="Akses komitmen trip sebelum berangkat dan konfirmasi kenyataan setelah pulang." /><div className="timeline-card"><div className="timeline-step done"><Check /></div><div><small>PERJALANAN SELESAI</small><h3>Bromo Sunrise Weekend</h3><p>Promise Card v1.0 siap dicocokkan dengan kenyataan.</p></div><span>19–20 Sep</span></div><div className="timeline-card"><div className="timeline-step"><TicketCheck /></div><div><small>PERLU TINDAKAN</small><h3>Isi Reality Check terverifikasi</h3><p>Kode Trip Pass: BRM-2409-017</p></div><Button onClick={() => window.location.href = "/tour?slug=bromo-sunrise-weekend&pass=BRM-2409-017"}>Buka Reality Check</Button></div></section>}

        {tab === "eligibility" && <section><PageTitle eyebrow="ORGANIZER ELIGIBILITY" title="Bangun profil organizer yang layak dipercaya." description="Akses Organizer Mode produksi hanya diberikan setelah identitas dan rekam jejak diperiksa." />{user.organizerStatus === "pending" ? <div className="eligibility-status"><span><History /></span><h2>Pengajuan demo tersimpan</h2><p>Dalam penggunaan nyata, tim Kept akan memeriksa identitas, kontak bisnis, dan rekam jejak operator sebelum memberikan akses.</p><div className="future-verification-note"><small>ALUR PRODUKSI</small><strong>Pengajuan → Pemeriksaan Kept → Organizer Terverifikasi</strong></div><div className="demo-fast-track"><small>SIMULASI PROTOTYPE</small><p>Aktifkan simulasi untuk mencoba dashboard. Tindakan ini tidak sama dengan verifikasi produksi.</p><Button onClick={continueOrganizerDemo}><BadgeCheck /> Aktifkan Simulasi Organizer</Button></div></div> : user.organizerStatus === "verified" ? <div className="eligibility-status verified"><span><BadgeCheck /></span><h2>Organizer demo terverifikasi</h2><p>Status ini dipakai untuk demonstrasi alur. Kamu dapat membuka Organizer Mode.</p><Button onClick={() => { const next = { ...user, mode: "organizer" as const }; saveKeptUser(next); setUser(next); setTab("organizer"); }}>Buka Organizer Mode</Button></div> : <form className="account-form eligibility-form" onSubmit={submitEligibility}><FormSection number="01" title="Identitas organizer"><label>Nama bisnis<input required placeholder="Contoh: Jelajah Aruna" /></label><label>Nama pemilik<input required defaultValue={user.name} /></label><label>Email bisnis<input required type="email" defaultValue={user.email} /></label><label>Nomor WhatsApp<input required placeholder="+62 812..." /></label></FormSection><FormSection number="02" title="Rekam jejak dan kanal"><label>Instagram / Website<input required placeholder="instagram.com/operator" /></label><label>Lokasi bisnis<input required placeholder="Kota, Provinsi" /></label><label className="full-field">Bukti perjalanan sebelumnya<textarea required placeholder="Tautan dokumentasi, itinerary, atau testimoni peserta" /></label></FormSection><label className="agreement"><input type="checkbox" required />Saya menyatakan informasi yang dikirimkan benar dan dapat diperiksa oleh Kept.</label><Button type="submit"><ShieldCheck /> Kirim untuk Verifikasi</Button></form>}</section>}

        {tab === "organizer" && <section><PageTitle eyebrow="ORGANIZER DASHBOARD" title="Kelola kepercayaan, bukan sekadar promosi." description="Pantau trip aktif, janji yang dicatat, dan konfirmasi peserta." action={<Button onClick={() => setTab("create-tour")}><Plus /> Buat Open Trip</Button>} /><div className="account-stat-grid four"><Stat icon={BriefcaseBusiness} label="Open trip terbit" value="2" /><Stat icon={Users} label="Peserta terverifikasi" value="14" /><Stat icon={ShieldCheck} label="Truth Score" value="94%" /><Stat icon={FileCheck2} label="Promise Card" value="3" /></div><div className="account-panel"><PanelTitle title="Perjalanan terbaru" action="Kelola semua" href="/account?tab=open-tours" /><OrganizerTour name="Bromo Sunrise Weekend" date="19–20 Sep" people="14/15" score="Selesai · Bukti tersedia" href="/tour?slug=bromo-sunrise-weekend#reality" /><OrganizerTour name="Bromo Photography Trip" date="17–18 Okt" people="0/10" score="Tersedia" href="/tour?slug=bromo-photography-trip" /><OrganizerTour name="Bromo Family Escape" date="24–25 Okt" people="Belum terbit" score="Draft" href="/account?tab=create-tour" /></div></section>}

        {tab === "open-tours" && <section><PageTitle eyebrow="OPEN TRIP" title="Perjalanan yang kamu kelola" description="Setiap trip terhubung dengan Promise Card dan daftar peserta." action={<Button onClick={() => { setEditingDraft(false); setTab("create-tour"); }}><Plus /> Tambah Trip</Button>} /><div className="operator-tour-grid"><OperatorCard status="Selesai" name="Bromo Sunrise Weekend" date="19–20 Sep 2026" people="14 peserta terverifikasi" promises="Hasil integritas tersedia" href="/tour?slug=bromo-sunrise-weekend#reality" /><OperatorCard status="Tersedia" name="Bromo Photography Trip" date="17–18 Okt 2026" people="Belum ada Trip Pass" promises="5 janji terkunci" href="/tour?slug=bromo-photography-trip" /><OperatorCard status="Draft" name="Bromo Family Escape" date="24–25 Okt 2026" people="Belum dipublikasikan" promises="Promise Card belum dikunci" href="/account?tab=create-tour" />{createdTours.map((tour, index) => <OperatorCard key={`${tour.name}-${index}`} status={tour.status} name={tour.name} date={tour.date || "Tanggal belum dipilih"} people={`${tour.capacity || "—"} kapasitas · dari ${tour.departure || "—"}`} promises="Promise Card draft tersimpan" href="/account?tab=create-tour" />)}</div></section>}

        {tab === "create-tour" && <section><PageTitle eyebrow={editingDraft ? "EDIT DRAFT" : "NEW OPEN TRIP"} title={editingDraft ? "Lanjutkan Bromo Family Escape." : "Buat trip dan janji yang dapat diperiksa."} description="Isi informasi perjalanan, lalu ubah detail tersebut menjadi Promise Card." /><form className="account-form create-tour-form" onSubmit={submitTour}><FormSection number="01" title="Informasi perjalanan"><label>Nama open trip<input name="tour-name" required placeholder="Contoh: Bromo Sunrise Weekend" defaultValue={editingDraft ? "Bromo Family Escape" : ""} /></label><label>Destinasi<select name="tour-destination" required defaultValue="Gunung Bromo"><option>Gunung Bromo</option><option>Labuan Bajo</option><option>Dieng Plateau</option><option>Nusa Penida</option></select></label><label>Tanggal perjalanan<input name="tour-date" required type="date" defaultValue={editingDraft ? "2026-10-24" : ""} /></label><label>Kota keberangkatan<input name="tour-departure" required placeholder="Malang" defaultValue={editingDraft ? "Malang" : ""} /></label></FormSection><button type="button" className="request-place-toggle" onClick={() => setRequestPlace(!requestPlace)}><MapPin /> Destinasi belum tersedia? Ajukan destinasi baru <ChevronRight /></button>{requestPlace && <div className="new-place-request"><label>Nama destinasi<input required placeholder="Nama tempat" /></label><label>Lokasi<input required placeholder="Kabupaten, Provinsi" /></label><p>Destinasi baru akan diperiksa sebelum tampil di direktori publik.</p></div>}<FormSection number="02" title="Promise Card"><label>Harga per peserta<input name="tour-price" required placeholder="Rp650.000" defaultValue={editingDraft ? "Rp725.000" : ""} /></label><label>Maksimal peserta<input name="tour-capacity" required type="number" placeholder="15" defaultValue={editingDraft ? "14" : ""} /></label><label>Transportasi<input name="tour-transport" required placeholder="Jeep + minibus AC" defaultValue={editingDraft ? "Minibus AC dan jeep privat per keluarga" : ""} /></label><label>Akomodasi<input name="tour-stay" required placeholder="Homestay, 2–3 orang/kamar" defaultValue={editingDraft ? "Family room sesuai komposisi peserta" : ""} /></label><label className="full-field">Itinerary utama<textarea name="tour-itinerary" required placeholder="Tuliskan checkpoint perjalanan yang dijanjikan" defaultValue={editingDraft ? "Sunrise, Lautan Pasir, kawah, dan Bukit Teletubbies dengan tempo ramah anak." : ""} /></label><label className="full-field">Biaya termasuk dan tidak termasuk<textarea name="tour-inclusions" required placeholder="Transportasi, tiket, makan, biaya tambahan..." defaultValue={editingDraft ? "Transportasi, penginapan, dua kali makan, dan tiket kawasan. Tidak termasuk kebutuhan pribadi." : ""} /></label></FormSection><Button type="submit"><FileCheck2 /> {editingDraft ? "Perbarui Draft & Promise Card" : "Simpan Draft & Buat Promise Card"}</Button></form></section>}

        {tab === "promises" && <section><PageTitle eyebrow="PROMISE CARD" title="Janji yang sudah dicatat" description="Promise Card terkunci tidak dapat diubah diam-diam setelah dipublikasikan." /><div className="promise-manager"><div><span className="snapshot-status"><ShieldCheck /> TERKUNCI</span><h3>Bromo Sunrise Weekend</h3><p>Versi 1.0 · Dikunci 5 September 2026, 14.32</p></div><div className="promise-mini-list"><span><Check /> Maksimal 15 peserta</span><span><Check /> Minibus AC + jeep</span><span><Check /> Homestay maksimal 3 orang/kamar</span><span><Check /> Tanpa biaya wajib tambahan</span></div><Button variant="outline" asChild><a href="/tour?slug=bromo-sunrise-weekend#promise">Lihat Promise Card</a></Button></div><div className="promise-manager"><div><span className="snapshot-status"><ShieldCheck /> TERKUNCI</span><h3>Bromo Photography Trip</h3><p>Versi 1.0 · Dikunci 28 September 2026, 10.15</p></div><div className="promise-mini-list"><span><Check /> Maksimal 10 peserta</span><span><Check /> Mentor fotografi</span><span><Check /> Homestay maksimal 2 orang/kamar</span><span><Check /> Tanpa biaya wajib tambahan</span></div><Button variant="outline" asChild><a href="/tour?slug=bromo-photography-trip#promise">Lihat Promise Card</a></Button></div><div className="promise-manager draft"><div><span className="snapshot-status">DRAFT</span><h3>Bromo Family Escape</h3><p>3 dari 5 janji sudah dilengkapi</p></div><Button onClick={() => { setEditingDraft(true); setTab("create-tour"); }}>Lanjutkan Draft</Button></div></section>}

        {tab === "changes" && <section><PageTitle eyebrow="CHANGE LOG" title="Catat perubahan secara terbuka" description="Janji awal tetap tersimpan. Tambahkan alasan, pengganti, waktu pemberitahuan, dan bukti." /><form className="account-form operational-form" onSubmit={submitChange}><FormSection number="01" title="Perubahan perjalanan"><label>Open trip<select name="change-tour" required><option value="bromo-sunrise-weekend">Bromo Sunrise Weekend</option><option value="bromo-photography-trip">Bromo Photography Trip</option></select></label><label>Janji yang berubah<select name="change-promise" required><option>Titik sunrise</option><option>Transportasi</option><option>Akomodasi</option><option>Itinerary</option></select></label><label className="full-field">Judul perubahan<input name="change-title" required placeholder="Contoh: Titik sunrise dialihkan" /></label><label className="full-field">Alasan<textarea name="change-reason" required placeholder="Jelaskan kondisi yang membuat rencana harus berubah" /></label><label className="full-field">Pengganti yang diberikan<textarea name="change-replacement" required placeholder="Jelaskan solusi atau pengganti untuk peserta" /></label><label>Waktu pemberitahuan<input name="change-time" required type="datetime-local" /></label><label className="file-field">Bukti pendukung<input name="change-evidence" required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" /><span><Upload /> JPG, PNG, WebP, atau PDF · maks. 5 MB pada prototype</span></label></FormSection><Button type="submit"><History /> Catat Perubahan</Button></form>{changeRecords.length > 0 && <div className="session-records"><h2>Perubahan tersimpan di perangkat demo</h2>{changeRecords.map((record, index) => <div key={`${record.title}-${index}`}><CheckCircle2 /><span><strong>{record.title}</strong><small>{record.reason} · Pengganti: {record.replacement}</small></span><b>{record.evidence || "Tanpa nama bukti"}</b></div>)}</div>}</section>}

        {tab === "participants" && <section><PageTitle eyebrow="PESERTA & TRIP PASS" title="Hubungkan peserta dengan perjalanan" description="Trip Pass membatasi Reality Check hanya untuk peserta pada manifest yang cocok." /><div className="account-two-column"><form className="account-form compact-form" onSubmit={issueTripPass}><FormSection number="01" title="Terbitkan Trip Pass"><label>Open trip<select required><option>Bromo Photography Trip</option><option>Bromo Sunrise Weekend</option></select></label><label>Email peserta<input name="participant-email" type="email" required placeholder="peserta@email.com" /></label><label>Nama peserta<input required placeholder="Nama sesuai manifest" /></label><label>Nomor manifest<input required placeholder="Contoh: 008" /></label></FormSection><Button type="submit"><Send /> Terbitkan Trip Pass Demo</Button></form><article className="account-panel"><PanelTitle title="Status manifest" /><div className="participant-summary"><strong>14</strong><span>peserta terverifikasi</span><small>Bromo Sunrise Weekend</small></div><div className="participant-summary"><strong>{issuedPasses.length}</strong><span>Trip Pass tersimpan di perangkat</span><small>Bromo Photography Trip</small></div></article></div>{issuedPasses.length > 0 && <div className="session-records"><h2>Trip Pass demo</h2>{issuedPasses.map((email, index) => <div key={`${email}-${index}`}><TicketCheck /><span>{email}</span><b>Diterbitkan</b></div>)}</div>}</section>}

        {tab === "reality" && <section><PageTitle eyebrow="REALITY CHECK MANAGEMENT" title="Tinjau konfirmasi peserta" description="Status tidak dapat diubah menjadi “dipenuhi” tanpa Trip Pass dan jawaban peserta yang valid." /><div className="reality-review-list"><article><div><span className="snapshot-status"><CheckCircle2 /> SIAP DITINJAU</span><h3>Bromo Sunrise Weekend</h3><p>8 dari 14 peserta mengirim Reality Check · 0 laporan biaya tambahan</p></div><Button asChild><a href="/tour?slug=bromo-sunrise-weekend#reality">Tinjau hasil</a></Button></article><article><div><span className="snapshot-status waiting"><History /> MENUNGGU PERJALANAN</span><h3>Bromo Photography Trip</h3><p>Reality Check dibuka setelah status perjalanan selesai.</p></div><Button variant="outline" asChild><a href="/tour?slug=bromo-photography-trip#reality">Lihat status</a></Button></article></div></section>}

        {tab === "profile" && <section><PageTitle eyebrow="ACCOUNT SETTINGS" title="Profil dan pengaturan" description="Kelola informasi yang digunakan di seluruh pengalaman Kept." /><form className="account-form profile-form" onSubmit={saveProfile}><FormSection number="01" title="Informasi pribadi"><label>Nama lengkap<input name="name" defaultValue={user.name} required /></label><label>Email<input name="email" type="email" defaultValue={user.email} required /></label><label>Nomor telepon<input defaultValue="+62 812-3456-7890" /></label><label>Kota<input defaultValue="Yogyakarta" /></label></FormSection><div className="notification-row"><Bell /><div><strong>Notifikasi perjalanan</strong><p>Perubahan itinerary, Trip Pass, dan Reality Check.</p></div><input type="checkbox" defaultChecked /></div><Button type="submit">Simpan Perubahan</Button></form></section>}
      </div>
    </section>
  </main>;
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) { return <div className="account-page-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
function Stat({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: string }) { return <article className="account-stat"><span><Icon /></span><small>{label}</small><strong>{value}</strong></article>; }
function PanelTitle({ title, action, href }: { title: string; action?: string; href?: string }) { return <div className="account-panel-title"><h2>{title}</h2>{action && href && <a href={href}>{action} <ArrowRight /></a>}</div>; }
function Activity({ icon: Icon, title, time }: { icon: typeof Heart; title: string; time: string }) { return <div className="account-activity"><span><Icon /></span><div><strong>{title}</strong><small>{time}</small></div></div>; }
function SavedTour({ image, title, operator, score, price, href }: { image: string; title: string; operator: string; score: string; price: string; href: string }) { return <article className="saved-tour"><img src={image} alt={title} loading="lazy" /><div><span><BadgeCheck />{operator}</span><h3>{title}</h3><p><ShieldCheck /> {score === "Belum ada" ? "Truth Score menunggu hasil" : `${score} skor trip selesai`}</p></div><div><small>Mulai</small><strong>{price}</strong><Button variant="outline" asChild><a href={href}>Lihat Pilihan</a></Button></div></article>; }
function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) { return <fieldset><legend><span>{number}</span>{title}</legend><div className="form-section-grid">{children}</div></fieldset>; }
function OrganizerTour({ name, date, people, score, href }: { name: string; date: string; people: string; score: string; href: string }) { return <a className="organizer-tour-row" href={href}><div><strong>{name}</strong><small>{date}</small></div><span><Users />{people}</span><b>{score}</b><ChevronRight /></a>; }
function OperatorCard({ status, name, date, people, promises, href }: { status: string; name: string; date: string; people: string; promises: string; href: string }) { return <article><span className={`operator-status ${status.toLowerCase()}`}>{status}</span><h3>{name}</h3><p><CalendarDays />{date}</p><p><Users />{people}</p><p><FileCheck2 />{promises}</p><Button variant="outline" asChild><a href={href}>Kelola Tour</a></Button></article>; }
