"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

let firstView = true;

// Sends one anonymous page view per page change. Skips the admin panel.
export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;
    let vid = null;
    try {
      vid = localStorage.getItem("pe_vid");
      if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem("pe_vid", vid);
      }
    } catch {}
    if (!vid) return;
    const first = firstView;
    firstView = false;
    const timer = setTimeout(() => fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer: document.referrer, first, vid }),
      keepalive: true,
    }).catch(() => {}), 1500);
    return () => clearTimeout(timer);
  }, [path]);
  return null;
}
