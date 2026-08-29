"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { AlertCircle, ArrowRight, BadgeCheck, Bell, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronRight, CircleUserRound, Clock3, FileCheck2, Heart, History, LayoutDashboard, LogOut, MapPin, MessageSquareText, Plus, Send, Settings, ShieldCheck, TicketCheck, TrendingUp, Users } from "lucide-react";
import { AccountControls } from "@/components/account-controls";
import { Button } from "@/components/ui/button";
import { demoUser, readKeptUser, saveKeptUser, type KeptUser } from "@/lib/kept-account";

const travellerTabs = [
  { value: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { value: "saved", label: "Tour Tersimpan", icon: Heart },
  { value: "trips", label: "Trip Saya", icon: TicketCheck },
  { value: "eligibility", label: "Daftar Organizer", icon: ShieldCheck },
  { value: "profile", label: "Profil & Pengaturan", icon: Settings },
];

const organizerTabs = [
  { value: "organizer", label: "Dashboard Organizer", icon: LayoutDashboard },
  { value: "open-tours", label: "Open Tour Saya", icon: BriefcaseBusiness },
  { value: "create-tour", label: "Buat Open Tour", icon: Plus },
  { value: "promises", label: "Promise Snapshot", icon: FileCheck2 },
  { value: "profile", label: "Profil & Pengaturan", icon: Settings },
];

export default function AccountPage() {
  const [user, setUser] = useState<KeptUser | null>(null);
  const [tab, setTab] = useState("overview");
  const [notice, setNotice] = useState("");
  const [requestPlace, setRequestPlace] = useState(false);

  useEffect(() => {
    const initialUser = readKeptUser();
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    const allowedTabs = initialUser?.mode === "organizer" && initialUser.organizerStatus === "verified" ? organizerTabs : travellerTabs;
    const requestedIsAllowed = requestedTab && allowedTabs.some((item) => item.value === requestedTab);

    setUser(initialUser);
    setTab(requestedIsAllowed ? requestedTab : initialUser?.mode === "organizer" && initialUser.organizerStatus === "verified" ? "organizer" : "overview");

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

  const submitEligibility = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const next = { ...user, organizerStatus: "pending" as const, mode: "traveller" as const };
    saveKeptUser(next);
    setUser(next);
    setNotice("Pengajuan berhasil dikirim. Tim KEPT sedang memeriksa kelayakan organizer kamu.");
  };

  const submitTour = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Draft open tour dan Promise Snapshot berhasil dibuat.");
    setTab("open-tours");
  };

  const continueOrganizerDemo = () => {
    if (!user) return;
    const next = { ...user, organizerStatus: "verified" as const, mode: "organizer" as const };
    saveKeptUser(next);
    setUser(next);
    setNotice("Mode Organizer demo berhasil diaktifkan.");
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

  if (!user) return <main className="account-page"><header className="site-header"><a className="brand" href="/"><span className="brand-mark"><Check /></span><span>KEPT</span></a><AccountControls /></header><section className="account-empty"><span><CircleUserRound /></span><h1>Masuk untuk membuka Account Center</h1><p>Kelola perjalanan, Trip Pass, dan profil organizermu dari satu tempat.</p><Button onClick={() => { saveKeptUser(demoUser); setUser(demoUser); }}>Gunakan akun demo <ArrowRight /></Button><a href="/">Kembali menjelajah</a></section></main>;

  const tabs = user.mode === "organizer" && user.organizerStatus === "verified" ? organizerTabs : travellerTabs;

  return <main className="account-page">
    <header className="site-header account-header"><a className="brand" href="/"><span className="brand-mark"><Check /></span><span>KEPT</span></a><a className="account-back" href="/">Jelajahi Destinasi</a><AccountControls /></header>
    <section className="account-shell">
      <aside className="account-sidebar">
        <div className="account-profile-card"><span>{user.initials}</span><div><strong>{user.name}</strong><small>{user.email}</small></div>{user.organizerStatus === "verified" && <BadgeCheck />}</div>
        <div className={`account-role-banner ${user.organizerStatus}`}><ShieldCheck /><div><small>Status akun</small><strong>{user.organizerStatus === "verified" ? "Organizer Terverifikasi" : user.organizerStatus === "pending" ? "Sedang Ditinjau" : "Traveller"}</strong></div></div>
        <nav className="account-tab-list" aria-label="Menu Account Center">{tabs.map(({ value, label, icon: Icon }) => <button type="button" className={tab === value ? "account-nav-button active" : "account-nav-button"} onClick={() => { setNotice(""); setTab(value); }} key={value} aria-current={tab === value ? "page" : undefined}><Icon />{label}<ChevronRight /></button>)}</nav>
        <button className="logout-button" onClick={() => { saveKeptUser(null); setUser(null); }}><LogOut /> Keluar dari akun</button>
      </aside>

      <div className="account-content">
        {notice && <div className="account-notice"><CheckCircle2 />{notice}<button onClick={() => setNotice("")}>×</button></div>}

        {tab === "overview" && <section><PageTitle eyebrow="TRAVELLER CENTER" title={`Halo, ${user.name.split(" ")[0]}.`} description="Semua rencana dan bukti perjalananmu ada di sini." /><div className="account-stat-grid"><Stat icon={Heart} label="Tour tersimpan" value="4" /><Stat icon={TicketCheck} label="Trip mendatang" value="1" /><Stat icon={CheckCircle2} label="Reality Check" value="2 selesai" /></div><div className="account-two-column"><article className="account-panel"><PanelTitle title="Trip berikutnya" action="Lihat Trip Pass" /><div className="next-trip"><img src="/bromo.webp" alt="Gunung Bromo" /><div><span><CalendarDays />12–13 September 2026</span><h3>Bromo Sunrise Weekend</h3><p>Jelajah Aruna · Berangkat dari Malang</p><b>Trip Pass aktif</b></div></div></article><article className="account-panel"><PanelTitle title="Aktivitas terbaru" /><Activity icon={Heart} title="Bromo Photography Trip disimpan" time="Hari ini" /><Activity icon={CheckCircle2} title="Reality Check Dieng selesai" time="2 minggu lalu" /><Activity icon={TicketCheck} title="Trip Pass diterbitkan" time="1 bulan lalu" /></article></div></section>}

        {tab === "saved" && <section><PageTitle eyebrow="KOLEKSI" title="Tour tersimpan" description="Simpan pilihanmu dan bandingkan sebelum memutuskan." /><div className="saved-tour-list"><SavedTour image="/bromo.webp" title="Bromo Photography Trip" operator="Lensa Nusantara" score="96%" price="Rp825.000" /><SavedTour image="/labuan-bajo.webp" title="Sailing Komodo 3D2N" operator="Nusa Sail" score="97%" price="Rp2.850.000" /><SavedTour image="/dieng.webp" title="Dieng Golden Sunrise" operator="Langkah Pagi" score="88%" price="Rp475.000" /></div></section>}

        {tab === "trips" && <section><PageTitle eyebrow="PERJALANANMU" title="Trip dan Trip Pass" description="Akses komitmen trip sebelum berangkat dan konfirmasi kenyataan setelah pulang." /><div className="timeline-card"><div className="timeline-step done"><Check /></div><div><small>BERHASIL BERGABUNG</small><h3>Bromo Sunrise Weekend</h3><p>Promise Snapshot v1.0 telah dikunci.</p></div><span>12 Sep</span></div><div className="timeline-card"><div className="timeline-step"><TicketCheck /></div><div><small>SELANJUTNYA</small><h3>Gunakan Trip Pass saat keberangkatan</h3><p>Kode: BRM-2409-017</p></div><Button onClick={() => window.location.href = "/tour?slug=bromo-sunrise-weekend&pass=1"}>Buka Pass</Button></div></section>}

        {tab === "eligibility" && <section><PageTitle eyebrow="ORGANIZER ELIGIBILITY" title="Bangun profil organizer yang layak dipercaya." description="Akses Organizer Mode hanya diberikan setelah identitas dan rekam jejak diperiksa." />{user.organizerStatus === "pending" ? <div className="eligibility-status"><span><History /></span><h2>Pengajuan berhasil dikirim</h2><p>Dalam penggunaan nyata, KEPT sebagai organisasi pengelola akan memeriksa identitas, kontak bisnis, dan rekam jejak operator sebelum memberikan akses.</p><div className="future-verification-note"><small>ALUR IMPLEMENTASI NANTI</small><strong>Pengajuan → Pemeriksaan KEPT → Organizer Terverifikasi</strong></div><div className="demo-fast-track"><small>KHUSUS PROTOTYPE</small><p>Tidak perlu menunggu. Aktifkan status demo untuk langsung mencoba dashboard dan pembuatan open tour.</p><Button onClick={continueOrganizerDemo}><BadgeCheck /> Lanjutkan Demo sebagai Organizer <ArrowRight /></Button></div></div> : user.organizerStatus === "verified" ? <div className="eligibility-status verified"><span><BadgeCheck /></span><h2>Organizer terverifikasi</h2><p>Kamu dapat beralih ke Organizer Mode melalui tombol di bagian atas.</p><Button onClick={() => { const next = { ...user, mode: "organizer" as const }; saveKeptUser(next); setUser(next); setTab("organizer"); }}>Buka Organizer Mode</Button></div> : <form className="account-form eligibility-form" onSubmit={submitEligibility}><FormSection number="01" title="Identitas organizer"><label>Nama bisnis<input required placeholder="Contoh: Jelajah Aruna" /></label><label>Nama pemilik<input required defaultValue={user.name} /></label><label>Email bisnis<input required type="email" defaultValue={user.email} /></label><label>Nomor WhatsApp<input required placeholder="+62 812..." /></label></FormSection><FormSection number="02" title="Rekam jejak dan kanal"><label>Instagram / Website<input required placeholder="instagram.com/operator" /></label><label>Lokasi bisnis<input required placeholder="Kota, Provinsi" /></label><label className="full-field">Bukti perjalanan sebelumnya<textarea required placeholder="Tautan dokumentasi, itinerary, atau testimoni peserta" /></label></FormSection><label className="agreement"><input type="checkbox" required />Saya menyatakan informasi yang dikirimkan benar dan dapat diperiksa oleh KEPT.</label><Button type="submit"><ShieldCheck /> Kirim untuk Verifikasi</Button></form>}</section>}

        {tab === "organizer" && <section className="organizer-dashboard">
          <div className="organizer-welcome">
            <div><span>ORGANIZER CONTROL CENTER</span><h1>Selamat datang kembali, {user.name.split(" ")[0]}.</h1><p>Ada <strong>2 trip aktif</strong> dan <strong>1 Reality Check</strong> yang perlu ditangani.</p></div>
            <div><Button variant="outline" onClick={() => setTab("open-tours")}>Lihat Trip Aktif</Button><Button onClick={() => setTab("create-tour")}><Plus /> Buat Open Tour</Button></div>
          </div>

          <div className="organizer-metric-grid">
            <DashboardMetric icon={BriefcaseBusiness} label="Trip aktif" value="4" note="2 segera berangkat" tone="blue" />
            <DashboardMetric icon={ShieldCheck} label="Janji dipenuhi" value="92%" note="+4% dari bulan lalu" tone="green" />
            <DashboardMetric icon={Users} label="Peserta terverifikasi" value="128" note="Dari 11 perjalanan" tone="navy" />
            <DashboardMetric icon={MessageSquareText} label="Respons Reality Check" value="84%" note="107 konfirmasi masuk" tone="amber" />
          </div>

          <div className="organizer-dashboard-grid">
            <article className="integrity-card">
              <div className="dashboard-card-heading"><div><small>INTEGRITY OVERVIEW</small><h2>Skor Integritas Operator</h2></div><span><TrendingUp /> +4%</span></div>
              <div className="integrity-main"><div className="integrity-ring"><strong>92%</strong><span>terpercaya</span></div><div className="integrity-legend"><div><i className="kept" /><span>Janji dipenuhi</span><strong>92%</strong></div><div><i className="changed" /><span>Berubah transparan</span><strong>6%</strong></div><div><i className="issue" /><span>Belum terselesaikan</span><strong>2%</strong></div></div></div>
              <div className="integrity-trend" aria-label="Tren integritas enam trip terakhir"><span style={{height:"48%"}} /><span style={{height:"61%"}} /><span style={{height:"58%"}} /><span style={{height:"76%"}} /><span style={{height:"84%"}} /><span className="active" style={{height:"92%"}} /></div>
              <div className="trend-labels"><span>Trip 1</span><span>Trip 2</span><span>Trip 3</span><span>Trip 4</span><span>Trip 5</span><span>Terbaru</span></div>
            </article>

            <article className="attention-card">
              <div className="dashboard-card-heading"><div><small>PERLU TINDAKAN</small><h2>Selesaikan berikutnya</h2></div><b>2</b></div>
              <DashboardTask icon={AlertCircle} title="Bromo Sunrise Weekend" detail="Promise Snapshot belum lengkap" meta="Berangkat 12 September" action="Lengkapi" onClick={() => setTab("promises")} urgent />
              <DashboardTask icon={MessageSquareText} title="Dieng Golden Sunrise" detail="16 dari 20 Reality Check masuk" meta="4 respons belum masuk" action="Kirim ulang" onClick={() => setNotice("Pengingat Reality Check berhasil dikirim ke 4 peserta.")} />
              <button className="dashboard-text-button" onClick={() => setTab("open-tours")}>Lihat semua perjalanan <ArrowRight /></button>
            </article>
          </div>

          <article className="promise-performance-card">
            <div className="dashboard-card-heading"><div><small>PERFORMA JANJI</small><h2>Apa yang sudah kuat—dan perlu diperbaiki</h2></div><button onClick={() => setTab("promises")}>Lihat semua snapshot <ArrowRight /></button></div>
            <div className="promise-performance-grid">
              <PromisePerformance label="Transportasi sesuai" value={98} status="Sangat konsisten" />
              <PromisePerformance label="Tanpa biaya tambahan" value={96} status="Sangat konsisten" />
              <PromisePerformance label="Itinerary dipenuhi" value={91} status="Konsisten" />
              <PromisePerformance label="Kapasitas kamar sesuai" value={78} status="Perlu perhatian" warning />
              <PromisePerformance label="Keberangkatan tepat waktu" value={74} status="Prioritas perbaikan" warning />
            </div>
          </article>

          <div className="organizer-bottom-grid">
            <article className="dashboard-activity-card"><div className="dashboard-card-heading"><div><small>AKTIVITAS TERBARU</small><h2>Update dari perjalananmu</h2></div></div><DashboardActivity icon={MessageSquareText} title="8 Reality Check baru diterima" detail="Bromo Sunrise Weekend · 12 menit lalu" /><DashboardActivity icon={FileCheck2} title="Perubahan itinerary berhasil dicatat" detail="Dieng Golden Sunrise · Kemarin" /><DashboardActivity icon={ShieldCheck} title="Promise Snapshot dipublikasikan" detail="Labuan Bajo 3D2N · 2 hari lalu" /></article>
            <article className="quick-actions-card"><div className="dashboard-card-heading"><div><small>AKSI CEPAT</small><h2>Mulai dari sini</h2></div></div><div className="quick-action-grid"><QuickAction icon={Plus} label="Buat Open Tour" onClick={() => setTab("create-tour")} /><QuickAction icon={FileCheck2} label="Buat Snapshot" onClick={() => setTab("promises")} /><QuickAction icon={Send} label="Kirim Trip Pass" onClick={() => setNotice("Pilih perjalanan dari Open Tour Saya untuk mengirim Trip Pass.")} /><QuickAction icon={Clock3} label="Catat Perubahan" onClick={() => setTab("promises")} /></div></article>
          </div>
        </section>}

        {tab === "open-tours" && <section><PageTitle eyebrow="OPEN TOUR" title="Perjalanan yang kamu kelola" description="Setiap tour terhubung dengan Promise Snapshot dan daftar peserta." action={<Button onClick={() => setTab("create-tour")}><Plus /> Tambah Tour</Button>} /><div className="operator-tour-grid"><OperatorCard status="Aktif" name="Bromo Sunrise Weekend" date="12–13 Sep 2026" people="15 peserta" promises="8 janji terkunci" /><OperatorCard status="Terbuka" name="Dieng Golden Sunrise" date="26–27 Sep 2026" people="9 dari 14 peserta" promises="7 janji terkunci" /><OperatorCard status="Draft" name="Bromo Photography Trip" date="2–3 Okt 2026" people="Belum dipublikasikan" promises="Snapshot belum dikunci" /></div></section>}

        {tab === "create-tour" && <section><PageTitle eyebrow="NEW OPEN TOUR" title="Buat tour dan janji yang dapat diperiksa." description="Isi informasi perjalanan, lalu ubah detail tersebut menjadi Promise Snapshot." /><form className="account-form create-tour-form" onSubmit={submitTour}><FormSection number="01" title="Informasi perjalanan"><label>Nama open tour<input required placeholder="Contoh: Bromo Sunrise Weekend" /></label><label>Destinasi<select required><option>Gunung Bromo</option><option>Labuan Bajo</option><option>Dieng Plateau</option><option>Nusa Penida</option></select></label><label>Tanggal perjalanan<input required type="date" /></label><label>Kota keberangkatan<input required placeholder="Malang" /></label></FormSection><button type="button" className="request-place-toggle" onClick={() => setRequestPlace(!requestPlace)}><MapPin /> Destinasi belum tersedia? Ajukan destinasi baru <ChevronRight /></button>{requestPlace && <div className="new-place-request"><label>Nama destinasi<input required placeholder="Nama tempat" /></label><label>Lokasi<input required placeholder="Kabupaten, Provinsi" /></label><p>Destinasi baru akan diperiksa sebelum tampil di direktori publik.</p></div>}<FormSection number="02" title="Promise Snapshot"><label>Harga per peserta<input required placeholder="Rp650.000" /></label><label>Maksimal peserta<input required type="number" placeholder="15" /></label><label>Transportasi<input required placeholder="Jeep + minibus AC" /></label><label>Akomodasi<input required placeholder="Homestay, 2–3 orang/kamar" /></label><label className="full-field">Itinerary utama<textarea required placeholder="Tuliskan checkpoint perjalanan yang dijanjikan" /></label><label className="full-field">Biaya termasuk dan tidak termasuk<textarea required placeholder="Transportasi, tiket, makan, biaya tambahan..." /></label></FormSection><Button type="submit"><FileCheck2 /> Simpan Draft & Buat Snapshot</Button></form></section>}

        {tab === "promises" && <section><PageTitle eyebrow="PROMISE SNAPSHOT" title="Janji yang sudah dicatat" description="Snapshot terkunci tidak dapat diubah diam-diam setelah dipublikasikan." /><div className="promise-manager"><div><span className="snapshot-status"><ShieldCheck /> TERKUNCI</span><h3>Bromo Sunrise Weekend</h3><p>Versi 1.0 · Dipublikasikan 28 Agustus 2026, 18.30</p></div><div className="promise-mini-list"><span><Check /> Maksimal 15 peserta</span><span><Check /> Minibus AC + jeep</span><span><Check /> Homestay 2–3 orang/kamar</span><span><Check /> Tanpa biaya tambahan tersembunyi</span></div><Button variant="outline">Lihat Snapshot</Button></div><div className="promise-manager draft"><div><span className="snapshot-status">DRAFT</span><h3>Bromo Photography Trip</h3><p>6 dari 8 janji sudah dilengkapi</p></div><Button onClick={() => setTab("create-tour")}>Lanjutkan Draft</Button></div></section>}

        {tab === "profile" && <section><PageTitle eyebrow="ACCOUNT SETTINGS" title="Profil dan pengaturan" description="Kelola informasi yang digunakan di seluruh pengalaman KEPT." /><form className="account-form profile-form" onSubmit={saveProfile}><FormSection number="01" title="Informasi pribadi"><label>Nama lengkap<input name="name" defaultValue={user.name} required /></label><label>Email<input name="email" type="email" defaultValue={user.email} required /></label><label>Nomor telepon<input defaultValue="+62 812-3456-7890" /></label><label>Kota<input defaultValue="Yogyakarta" /></label></FormSection><div className="notification-row"><Bell /><div><strong>Notifikasi perjalanan</strong><p>Perubahan itinerary, Trip Pass, dan Reality Check.</p></div><input type="checkbox" defaultChecked /></div><Button type="submit">Simpan Perubahan</Button></form></section>}
      </div>
    </section>
  </main>;
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) { return <div className="account-page-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
function Stat({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: string }) { return <article className="account-stat"><span><Icon /></span><small>{label}</small><strong>{value}</strong></article>; }
function PanelTitle({ title, action }: { title: string; action?: string }) { return <div className="account-panel-title"><h2>{title}</h2>{action && <button>{action} <ArrowRight /></button>}</div>; }
function Activity({ icon: Icon, title, time }: { icon: typeof Heart; title: string; time: string }) { return <div className="account-activity"><span><Icon /></span><div><strong>{title}</strong><small>{time}</small></div></div>; }
function SavedTour({ image, title, operator, score, price }: { image: string; title: string; operator: string; score: string; price: string }) { return <article className="saved-tour"><img src={image} alt={title} /><div><span><BadgeCheck />{operator}</span><h3>{title}</h3><p><ShieldCheck /> {score} janji dipenuhi</p></div><div><small>Mulai</small><strong>{price}</strong><Button variant="outline">Lihat Tour</Button></div></article>; }
function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) { return <fieldset><legend><span>{number}</span>{title}</legend><div className="form-section-grid">{children}</div></fieldset>; }
function OrganizerTour({ name, date, people, score }: { name: string; date: string; people: string; score: string }) { return <div className="organizer-tour-row"><div><strong>{name}</strong><small>{date}</small></div><span><Users />{people}</span><b>{score}</b><button><ChevronRight /></button></div>; }
function OperatorCard({ status, name, date, people, promises }: { status: string; name: string; date: string; people: string; promises: string }) { return <article><span className={`operator-status ${status.toLowerCase()}`}>{status}</span><h3>{name}</h3><p><CalendarDays />{date}</p><p><Users />{people}</p><p><FileCheck2 />{promises}</p><Button variant="outline">Kelola Tour</Button></article>; }
function DashboardMetric({ icon: Icon, label, value, note, tone }: { icon: typeof Heart; label: string; value: string; note: string; tone: string }) { return <article className={`dashboard-metric ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></article>; }
function DashboardTask({ icon: Icon, title, detail, meta, action, urgent, onClick }: { icon: typeof Heart; title: string; detail: string; meta: string; action: string; urgent?: boolean; onClick: () => void }) { return <div className={`dashboard-task ${urgent ? "urgent" : ""}`}><span><Icon /></span><div><strong>{title}</strong><p>{detail}</p><small>{meta}</small></div><button onClick={onClick}>{action}</button></div>; }
function PromisePerformance({ label, value, status, warning }: { label: string; value: number; status: string; warning?: boolean }) { return <div className={`promise-performance ${warning ? "warning" : ""}`}><div><strong>{label}</strong><span>{status}</span></div><b>{value}%</b><div className="performance-track"><i style={{width:`${value}%`}} /></div></div>; }
function DashboardActivity({ icon: Icon, title, detail }: { icon: typeof Heart; title: string; detail: string }) { return <div className="dashboard-activity"><span><Icon /></span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight /></div>; }
function QuickAction({ icon: Icon, label, onClick }: { icon: typeof Heart; label: string; onClick: () => void }) { return <button className="quick-action" onClick={onClick}><span><Icon /></span><strong>{label}</strong><ChevronRight /></button>; }
