"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Compass, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { KeptLogo } from "@/components/kept-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoUser, initialsFromName, readKeptUser, saveKeptUser, type KeptUser } from "@/lib/kept-account";

export function AccountControls({ showWelcome = false }: { showWelcome?: boolean }) {
  const [user, setUser] = useState<KeptUser | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [postAuthPath, setPostAuthPath] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => setUser(readKeptUser());
    sync();
    const requireAuth = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: "login" | "register"; redirect?: string }>).detail;
      const currentUser = readKeptUser();
      if (currentUser) {
        if (detail?.redirect) window.location.href = detail.redirect;
        return;
      }
      setWelcomeOpen(false);
      setAuthTab(detail?.tab ?? "register");
      setPostAuthPath(detail?.redirect ?? null);
      setMessage("");
      setAuthOpen(true);
    };
    window.addEventListener("kept-user-change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("kept-auth-required", requireAuth);
    if (showWelcome && !readKeptUser()) setWelcomeOpen(true);
    return () => {
      window.removeEventListener("kept-user-change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("kept-auth-required", requireAuth);
    };
  }, [showWelcome]);

  const finishWelcome = () => {
    window.localStorage.setItem("kept-welcome-seen", "1");
    setWelcomeOpen(false);
  };

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setPostAuthPath(null);
    setMessage("");
    setAuthOpen(true);
  };

  const authenticate = (event: FormEvent<HTMLFormElement>, kind: "login" | "register") => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (kind === "login" && (String(data.get("email")) !== "alif@kept.id" || String(data.get("password")) !== "keptdemo")) {
      setMessage("Akun belum ditemukan. Sebelum backend produksi aktif, gunakan kredensial demo yang sudah terisi.");
      return;
    }
    const name = kind === "register" ? String(data.get("name") || "Traveller Kept") : "Alif Makarim";
    const email = String(data.get("email") || "alif@kept.id");
    const nextUser: KeptUser = kind === "register" ? { name, email, initials: initialsFromName(name), mode: "traveller", organizerStatus: "none" } : demoUser;
    saveKeptUser(nextUser);
    setUser(nextUser);
    setAuthOpen(false);
    if (postAuthPath) window.location.href = postAuthPath;
  };

  const changeMode = (checked: boolean) => {
    if (!user) return;
    if (checked && user.organizerStatus !== "verified") {
      window.location.href = "/account?tab=eligibility";
      return;
    }
    const next = { ...user, mode: checked ? "organizer" as const : "traveller" as const };
    saveKeptUser(next);
    setUser(next);
  };

  return <>
    {user ? <div className="account-chip">
      <a className="account-avatar" href="/account" aria-label="Buka Account Center">{user.initials}</a>
      <a className="account-identity" href="/account"><strong>{user.name.split(" ")[0]}</strong><small>{user.mode === "organizer" ? "Organizer Mode" : "Traveller Mode"}</small></a>
      <div className="mode-switch" title={user.organizerStatus === "verified" ? "Ganti mode akun" : "Daftar sebagai organizer"}>
        <span>Traveller</span><Switch checked={user.mode === "organizer"} onCheckedChange={changeMode} aria-label="Ganti Traveller dan Organizer Mode" /><span className={user.organizerStatus === "verified" ? "" : "locked-mode"}>Organizer</span>
      </div>
    </div> : <div className="guest-account-actions"><Button variant="ghost" className="login-button" onClick={() => openAuth("login")}>Masuk</Button><Button className="signup-button" onClick={() => openAuth("register")}>Daftar</Button></div>}

    <Dialog open={welcomeOpen} onOpenChange={(open) => { setWelcomeOpen(open); if (!open) finishWelcome(); }}>
      <DialogContent className="welcome-dialog">
        <DialogHeader className="welcome-heading"><span className="welcome-logo"><KeptLogo /></span><DialogTitle>Selamat datang di Kept</DialogTitle><DialogDescription>Pilih cara kamu ingin menggunakan Kept hari ini.</DialogDescription></DialogHeader>
        <div className="welcome-choice-grid">
          <button onClick={() => { finishWelcome(); openAuth("register"); }}><span className="welcome-choice-icon traveller"><Compass /></span><strong>Jelajahi sebagai Traveller</strong><small>Temukan destinasi dan bandingkan open trip berdasarkan bukti.</small><b>Buat akun Traveller <ArrowRight /></b></button>
          <button onClick={() => { finishWelcome(); setAuthTab("register"); setPostAuthPath("/account?tab=eligibility"); setAuthOpen(true); }}><span className="welcome-choice-icon organizer"><BriefcaseBusiness /></span><strong>Kelola Open Trip</strong><small>Buat Promise Card dan bangun rekam jejak operator.</small><b>Buat akun lalu daftar organizer <ArrowRight /></b></button>
        </div>
        <button className="guest-entry" onClick={finishWelcome}>Hanya ingin melihat-lihat? Lanjut tanpa akun</button>
      </DialogContent>
    </Dialog>

    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="auth-dialog">
        <DialogHeader><span className="auth-mark"><ShieldCheck /></span><DialogTitle>Masuk ke Kept</DialogTitle><DialogDescription>Mode prototype menyimpan sesi di perangkat ini. Akun bersama lintas perangkat akan diaktifkan bersama backend VPS.</DialogDescription></DialogHeader>
        <Tabs value={authTab} onValueChange={setAuthTab}>
          <TabsList className="auth-tabs"><TabsTrigger value="login">Masuk</TabsTrigger><TabsTrigger value="register">Daftar</TabsTrigger></TabsList>
          <TabsContent value="login"><form className="auth-form" onSubmit={(event) => authenticate(event, "login")}><label>Email<input name="email" type="email" defaultValue="alif@kept.id" required /></label><label>Password<input name="password" type="password" defaultValue="keptdemo" required /></label>{message && <p role="alert">{message}</p>}<Button type="submit"><LogIn /> Masuk Demo</Button><button type="button" className="demo-account" onClick={() => { saveKeptUser(demoUser); setUser(demoUser); setAuthOpen(false); if (postAuthPath) window.location.href = postAuthPath; }}><BadgeCheck /> Gunakan akun demo terverifikasi</button></form></TabsContent>
          <TabsContent value="register"><form className="auth-form" onSubmit={(event) => authenticate(event, "register")}><label>Nama lengkap<input name="name" placeholder="Nama lengkap" required /></label><label>Email<input name="email" type="email" placeholder="nama@email.com" required /></label><label>Password<input name="password" type="password" placeholder="Minimal 8 karakter" minLength={8} required /></label><Button type="submit"><UserRound /> Buat Profil Demo</Button></form></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  </>;
}
