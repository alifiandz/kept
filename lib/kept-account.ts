export type KeptMode = "traveller" | "organizer";
export type OrganizerStatus = "none" | "pending" | "verified";

export type KeptUser = {
  name: string;
  email: string;
  initials: string;
  mode: KeptMode;
  organizerStatus: OrganizerStatus;
};

export const demoUser: KeptUser = {
  name: "Alifian Dzaky Makarim",
  email: "alifian@kept.id",
  initials: "AD",
  mode: "traveller",
  organizerStatus: "verified",
};

const userKey = "kept-prototype-user";

export function readKeptUser(): KeptUser | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(userKey);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as KeptUser;
    if (parsed.email === "alif@kept.id" && parsed.organizerStatus === "verified") {
      return { ...parsed, name: demoUser.name, email: demoUser.email, initials: demoUser.initials };
    }
    return parsed;
  } catch { return null; }
}

export function saveKeptUser(user: KeptUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(userKey, JSON.stringify(user));
  else window.localStorage.removeItem(userKey);
  window.dispatchEvent(new Event("kept-user-change"));
}

export function initialsFromName(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "KT";
}
