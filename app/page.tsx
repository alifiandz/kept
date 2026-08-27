"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BusFront, CalendarDays, Check, CheckCircle2,
  ChevronRight, Clock3, FileCheck2, History, Hotel, Info, LockKeyhole,
  MapPin, Minus, ReceiptText, ShieldCheck, Sparkles, TriangleAlert,
  Users, WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Step = "overview" | "promise" | "changes" | "reality" | "report";
type RealityStatus = "kept" | "changed" | "missed";

const steps: { value: Step; label: string; eyebrow: string }[] = [
  { value: "overview", label: "Trip", eyebrow: "Explore" },
  { value: "promise", label: "Promise", eyebrow: "Before" },
  { value: "changes", label: "Changes", eyebrow: "During" },
  { value: "reality", label: "Reality", eyebrow: "After" },
  { value: "report", label: "Report", eyebrow: "Proof" },
];

const promises = [
  { icon: Users, title: "Maksimal 15 peserta", detail: "Kapasitas grup tidak akan melebihi 15 orang." },
  { icon: BusFront, title: "Minibus ber-AC", detail: "Transportasi PP dari meeting point Malang." },
  { icon: Hotel, title: "2–3 orang per kamar", detail: "Homestay Cemara Indah, kamar mandi dalam." },
  { icon: WalletCards, title: "Harga final Rp649.000", detail: "Tidak ada biaya wajib tambahan saat perjalanan." },
  { icon: MapPin, title: "Sunrise Point Penanjakan", detail: "Termasuk jeep, tiket kawasan, dan pemandu lokal." },
  { icon: Clock3, title: "Berangkat pukul 23.30", detail: "Meeting point Stasiun Malang Kota Baru." },
];

const realityItems = [
  { id: "capacity", label: "Jumlah peserta maksimal 15 orang", note: "Trip berjalan dengan 14 peserta." },
  { id: "transport", label: "Minibus ber-AC", note: "Kendaraan sesuai dengan Promise Snapshot." },
  { id: "room", label: "Homestay 2–3 orang per kamar", note: "Satu kamar diisi 5 peserta." },
  { id: "fee", label: "Tidak ada biaya wajib tambahan", note: "Tidak ada pungutan tambahan." },
  { id: "sunrise", label: "Sunrise Point Penanjakan", note: "Dialihkan ke Bukit Cinta karena akses ditutup." },
  { id: "departure", label: "Berangkat pukul 23.30", note: "Berangkat pukul 23.42." },
];

const initialStatuses: Record<string, RealityStatus> = {
  capacity: "kept", transport: "kept", room: "missed",
  fee: "kept", sunrise: "changed", departure: "kept",
};

function StatusPill({ status }: { status: RealityStatus }) {
  const map = {
    kept: { label: "Dipenuhi", className: "status-kept", Icon: CheckCircle2 },
    changed: { label: "Berubah transparan", className: "status-changed", Icon: History },
    missed: { label: "Tidak dipenuhi", className: "status-missed", Icon: TriangleAlert },
  };
  const current = map[status];
  return <span className={`status-pill ${current.className}`}><current.Icon aria-hidden="true" />{current.label}</span>;
}

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>("overview");
  const [statuses, setStatuses] = useState(initialStatuses);
  const [submitted, setSubmitted] = useState(false);
  const currentIndex = steps.findIndex((step) => step.value === activeStep);
  const result = useMemo(() => {
    const values = Object.values(statuses);
    const total = values.length;
    return {
      kept: Math.round((values.filter((item) => item === "kept").length / total) * 100),
      changed: Math.round((values.filter((item) => item === "changed").length / total) * 100),
      missed: Math.round((values.filter((item) => item === "missed").length / total) * 100),
    };
  }, [statuses]);

  const goTo = (step: Step) => { setActiveStep(step); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goNext = () => goTo(steps[Math.min(currentIndex + 1, steps.length - 1)].value);
  const goBack = () => goTo(steps[Math.max(currentIndex - 1, 0)].value);

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => goTo("overview")} aria-label="Buka halaman utama KEPT">
          <span className="brand-mark"><Check aria-hidden="true" /></span><span>KEPT</span>
        </button>
        <div className="header-meta">
          <span className="prototype-pill"><Sparkles aria-hidden="true" /> Prototype demo</span>
          <span className="desktop-only">Bromo Sunrise • 12–13 Sep 2026</span>
        </div>
      </header>

      <Tabs value={activeStep} onValueChange={(value) => goTo(value as Step)} className="experience-tabs">
        <div className="step-rail-wrap">
          <TabsList variant="line" className="step-rail" aria-label="Alur prototype KEPT">
            {steps.map((step, index) => (
              <TabsTrigger key={step.value} value={step.value} className="step-trigger">
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <span><small>{step.eyebrow}</small>{step.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <section className="hero">
            <div className="hero-image" role="img" aria-label="Gunung Bromo saat matahari terbit"><div className="image-credit">Bromo • Jawa Timur</div></div>
            <div className="hero-content">
              <div className="operator-line">
                <div className="avatar">JA</div>
                <div><strong>Jelajah Aruna</strong><span><ShieldCheck aria-hidden="true" /> Integrity Profile aktif</span></div>
              </div>
              <p className="kicker">OPEN TRIP • 2D1N</p>
              <h1>Bromo Sunrise &amp;<br />Sea of Sand</h1>
              <p className="hero-copy">Lihat apa yang dijanjikan operator sebelum membayar—dan bagaimana janji itu dibuktikan setelah perjalanan.</p>
              <div className="hero-details">
                <span><CalendarDays aria-hidden="true" /> 12–13 Sep 2026</span>
                <span><MapPin aria-hidden="true" /> Berangkat dari Malang</span>
                <span><Users aria-hidden="true" /> Maks. 15 peserta</span>
              </div>
              <div className="hero-actions">
                <Button size="lg" onClick={() => goTo("promise")} className="primary-cta">Lihat Promise Snapshot <ArrowRight /></Button>
                <button className="text-action" onClick={() => goTo("report")}>Lihat trip sebelumnya <ChevronRight /></button>
              </div>
            </div>
          </section>
          <section className="trust-strip" aria-label="Ringkasan integritas operator">
            <div><span className="metric-value">92%</span><span>Janji dipenuhi dari 14 trip</span></div>
            <div><span className="metric-value">186</span><span>Peserta terverifikasi</span></div>
            <div><span className="metric-value">4.8/5</span><span>Respons perubahan</span></div>
            <p><ShieldCheck aria-hidden="true" /><span><strong>Bukan rating biasa.</strong> Semua angka berasal dari janji spesifik dan konfirmasi peserta.</span></p>
          </section>
        </TabsContent>

        <TabsContent value="promise">
          <section className="page-section">
            <div className="section-heading">
              <div><p className="kicker">SEBELUM PESERTA MEMBAYAR</p><h2>Promise Snapshot</h2><p>Versi final penawaran yang disimpan sebelum trip dibuka.</p></div>
              <div className="lock-card"><LockKeyhole aria-hidden="true" /><div><strong>Terkunci • v1.0</strong><span>Dipublikasikan 20 Agustus 2026, 14.32 WIB</span></div></div>
            </div>
            <div className="promise-grid">
              {promises.map(({ icon: Icon, title, detail }) => (
                <article className="promise-card" key={title}>
                  <span className="icon-box"><Icon aria-hidden="true" /></span>
                  <div><h3>{title}</h3><p>{detail}</p></div><CheckCircle2 className="promise-check" aria-label="Tercatat" />
                </article>
              ))}
            </div>
            <div className="snapshot-footer"><FileCheck2 aria-hidden="true" /><p><strong>Snapshot ini tidak dapat diedit diam-diam.</strong><span>Perubahan setelah publikasi akan membuat catatan baru yang terlihat oleh peserta.</span></p></div>
          </section>
        </TabsContent>

        <TabsContent value="changes">
          <section className="page-section narrow-section">
            <div className="section-heading">
              <div><p className="kicker">SAAT RENCANA HARUS BERUBAH</p><h2>Change Log</h2><p>Perubahan tetap diperbolehkan—tetapi alasan dan penggantinya harus terlihat.</p></div>
              <span className="change-count">1 perubahan tercatat</span>
            </div>
            <div className="change-story">
              <div className="change-date"><span>13</span><small>SEP<br />2026</small></div>
              <div className="change-body">
                <div className="change-topline"><span className="status-pill status-changed"><History /> Berubah transparan</span><span>03.18 WIB • Sebelum jeep berangkat</span></div>
                <h3>Sunrise Point Penanjakan dialihkan ke Bukit Cinta</h3>
                <div className="change-columns">
                  <div><span className="mini-label">JANJI AWAL</span><p>Sunrise dari View Point Penanjakan.</p></div>
                  <div><span className="mini-label">ALASAN</span><p>Akses Penanjakan ditutup petugas karena longsor ringan.</p></div>
                  <div><span className="mini-label">PENGGANTI</span><p>Bukit Cinta dengan waktu sunrise dan fasilitas jeep yang sama.</p></div>
                </div>
                <div className="evidence-note"><Info aria-hidden="true" /> Foto pemberitahuan petugas dan lokasi pengganti dilampirkan operator.</div>
              </div>
            </div>
            <div className="change-principle"><span className="quote-mark">“</span><p>Operator tidak dihukum karena cuaca atau kondisi lapangan. Yang dinilai adalah <strong>seberapa transparan mereka merespons perubahan.</strong></p></div>
          </section>
        </TabsContent>

        <TabsContent value="reality">
          <section className="page-section reality-layout">
            <div className="reality-main">
              <div className="section-heading compact-heading"><div><p className="kicker">HANYA UNTUK PESERTA TERVERIFIKASI</p><h2>Reality Check</h2><p>Cocokkan setiap janji dengan apa yang benar-benar kamu terima.</p></div></div>
              <div className="verification-banner"><ShieldCheck aria-hidden="true" /><div><strong>Trip Pass #BRM-2409-017 terverifikasi</strong><span>Atas nama Dimas • Check-in 12 Sep 2026, 23.16 WIB</span></div></div>
              <div className="reality-list">
                {realityItems.map((item, index) => (
                  <article className="reality-row" key={item.id}>
                    <div className="reality-question"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.label}</h3><p>{item.note}</p></div></div>
                    <div className="status-options" aria-label={`Status untuk ${item.label}`}>
                      {([["kept", "Dipenuhi", Check], ["changed", "Berubah", History], ["missed", "Tidak", Minus]] as const).map(([value, label, Icon]) => (
                        <button key={value} className={statuses[item.id] === value ? `selected ${value}` : ""} onClick={() => setStatuses((current) => ({ ...current, [item.id]: value }))} aria-pressed={statuses[item.id] === value}><Icon aria-hidden="true" /> {label}</button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <aside className="reality-side">
              <span className="mini-label">PROGRES KONFIRMASI</span>
              <div className="progress-label"><strong>6 dari 6</strong><span>janji diperiksa</span></div><Progress value={100} />
              <p>Jawabanmu akan digabungkan dengan peserta lain. Identitas peserta tidak ditampilkan pada laporan publik.</p>
              <Button className="submit-button" onClick={() => { setSubmitted(true); goTo("report"); }}>Kirim Reality Check <ArrowRight /></Button>
            </aside>
          </section>
        </TabsContent>

        <TabsContent value="report">
          <section className="page-section report-section">
            {submitted && <div className="success-banner"><CheckCircle2 aria-hidden="true" /> Reality Check berhasil disimpan dan masuk ke laporan trip.</div>}
            <div className="report-header">
              <div><p className="kicker">BUKTI SETELAH PERJALANAN</p><h2>Trip Integrity Report</h2><p>Bromo Sunrise &amp; Sea of Sand • 12–13 September 2026</p></div>
              <div className="verified-count"><ShieldCheck aria-hidden="true" /><span><strong>17 peserta</strong> terverifikasi</span></div>
            </div>
            <div className="score-stage">
              <div className="main-score"><span className="score-ring"><strong>{result.kept}%</strong><small>JANJI<br />DIPENUHI</small></span><div><p>Integrity result</p><h3>Mayoritas janji dipenuhi</h3><span>Tingkat keyakinan bukti: <strong>Tinggi</strong></span></div></div>
              <div className="score-breakdown">
                <div><span className="dot kept-dot" /><strong>{result.kept}%</strong><small>Dipenuhi</small></div>
                <div><span className="dot changed-dot" /><strong>{result.changed}%</strong><small>Berubah transparan</small></div>
                <div><span className="dot missed-dot" /><strong>{result.missed}%</strong><small>Tidak dipenuhi</small></div>
              </div>
            </div>
            <div className="report-table-wrap">
              <div className="table-heading"><h3>Promise vs Reality</h3><span>Berdasarkan konfirmasi peserta + Change Log</span></div>
              <div className="report-table">{realityItems.map((item) => <div className="report-row" key={item.id}><div><strong>{item.label}</strong><span>{item.note}</span></div><StatusPill status={statuses[item.id]} /></div>)}</div>
            </div>
            <div className="report-bottom"><div><ReceiptText aria-hidden="true" /><p><strong>Laporan tidak dapat dibeli.</strong><span>Operator membayar alat pengelolaan trip, bukan hasil Integrity Report.</span></p></div><Button variant="outline" onClick={() => goTo("overview")}>Kembali ke profil operator</Button></div>
          </section>
        </TabsContent>
      </Tabs>

      {activeStep !== "overview" && activeStep !== "report" && <nav className="flow-nav" aria-label="Navigasi alur prototype"><Button variant="outline" onClick={goBack}><ArrowLeft /> Sebelumnya</Button><span>Step {currentIndex + 1} of {steps.length}</span><Button onClick={goNext}>Selanjutnya <ArrowRight /></Button></nav>}
      <footer className="site-footer"><div className="brand footer-brand"><span className="brand-mark"><Check aria-hidden="true" /></span><span>KEPT</span></div><p>Did they keep their promise?</p><span>Prototype concept • Data displayed is fictional for demonstration.</span></footer>
    </main>
  );
}
