"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const navigationKeys = new Set(["_blank", "_parent", "_top"]);

export function SmoothNavigation() {
  const router = useRouter();

  useEffect(() => {
    let clearTimer: number | undefined;

    const finish = () => {
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(() => document.documentElement.classList.remove("kept-navigating"), 220);
    };

    const getInternalUrl = (target: EventTarget | null) => {
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || navigationKeys.has(anchor.target)) return null;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol)) return null;
      return { anchor, url };
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const match = getInternalUrl(event.target);
      if (!match) return;
      const { url } = match;
      const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
      if (sameDocument) return;

      event.preventDefault();
      const next = `${url.pathname}${url.search}${url.hash}`;

      if (url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "") && url.pathname.replace(/\/$/, "") === "/account") {
        window.history.pushState({}, "", next);
        window.dispatchEvent(new CustomEvent("kept-account-route"));
        if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      document.documentElement.classList.add("kept-navigating");
      router.push(next, { scroll: !url.hash });
      finish();
    };

    const onPrefetch = (event: Event) => {
      const match = getInternalUrl(event.target);
      if (!match) return;
      const { url } = match;
      if (url.pathname !== window.location.pathname) router.prefetch(`${url.pathname}${url.search}`);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPrefetch, { passive: true });
    document.addEventListener("focusin", onPrefetch);
    window.addEventListener("popstate", finish);
    return () => {
      window.clearTimeout(clearTimer);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPrefetch);
      document.removeEventListener("focusin", onPrefetch);
      window.removeEventListener("popstate", finish);
      document.documentElement.classList.remove("kept-navigating");
    };
  }, [router]);

  return null;
}
