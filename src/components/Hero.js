/* eslint-disable @next/next/no-img-element */
"use client";
import Icon from "@/components/Icon";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const DELAY = 6500;
const pad = (x) => String(x).padStart(2, "0");

// Full-screen hero. The designer's works fade into each other in a loop.
// variant="home": big hero with a card strip. variant="page": shorter hero for inner pages.
export default function Hero({ works = [], title, lead, variant = "page", children }) {
  const n = works.length;
  const home = variant === "home";
  const [s, setS] = useState({ cur: 0, prev: -1 });
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  const step = useCallback((d) => setS((v) => ({ cur: (v.cur + d + n) % n, prev: v.cur })), [n]);
  const jump = (k) => setS((v) => (k === v.cur ? v : { cur: k, prev: v.cur }));

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || n < 2 || paused || still) return;
    const t = setTimeout(() => step(1), DELAY);
    return () => clearTimeout(t);
  }, [ready, s.cur, n, paused, still, step]);

  const cur = works[s.cur];
  const stopped = paused || still;
  const order = Array.from({ length: Math.min(n, 3) }, (_, k) => (s.cur + k) % n);

  const arrows = n > 0 && (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => step(-1)} aria-label="Previous work"
        className="grid size-11 place-items-center rounded-full border border-white/30 bg-black/20 transition-colors hover:bg-white/15">
        <Icon name="arrow_back" />
      </button>
      <button type="button" onClick={() => step(1)} aria-label="Next work"
        className="grid size-11 place-items-center rounded-full bg-white text-ink transition-transform hover:scale-105">
        <Icon name="arrow_forward" />
      </button>
      {n > 1 && (
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
          className="grid size-11 place-items-center rounded-full border border-white/30 bg-black/20 transition-colors hover:bg-white/15">
          <Icon name={stopped ? "play_arrow" : "pause"} />
        </button>
      )}
    </div>
  );

  return (
    <section
      className={`relative isolate flex overflow-hidden bg-[#111] text-white ${s.prev === -1 ? "hero-intro" : ""} ${home ? "min-h-[100svh]" : "min-h-[68svh]"} ${
        n === 0 ? "bg-[radial-gradient(70%_60%_at_75%_25%,#4a1d0c,#111_70%)]" : ""
      }`}
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {works.map((w, k) => {
          // Only the current, previous and next images are loaded, so the page opens fast.
          if (!(k === s.cur || k === s.prev || k === (s.cur + 1) % n)) return null;
          return (
            <img
              key={w.id}
              src={w.hero || w.url}
              alt=""
              decoding="async"
              fetchPriority={k === 0 ? "high" : "auto"}
              className="hero-img"
              data-s={ready && k === s.cur ? "active" : ready && k === s.prev ? "prev" : "idle"}
            />
          );
        })}
        <div className="absolute inset-0 z-10 bg-black/45" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-transparent to-black/60" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col justify-between px-5 pb-8 pt-32 md:px-10 lg:pb-12">
        <div className={`flex flex-col items-start ${home ? "lg:ml-auto lg:max-w-[640px] lg:items-end lg:text-right" : "max-w-[760px]"}`}>
          <h1 style={{ "--d": "60ms" }} className="rise font-display text-[clamp(2.4rem,6.4vw,5.2rem)] font-extrabold leading-[1.02] tracking-tight text-balance">
            {title}
          </h1>
          {lead && <p style={{ "--d": "140ms" }} className="rise mt-5 max-w-[46ch] text-base text-white/80 md:text-lg">{lead}</p>}
          {children && <div style={{ "--d": "220ms" }} className={`rise mt-7 flex flex-wrap gap-3 ${home ? "lg:justify-end" : ""}`}>{children}</div>}
        </div>

        {n > 0 && home && (
          <div style={{ "--d": "300ms" }} className="rise mt-14 flex w-full flex-col gap-5 lg:ml-auto lg:w-[640px]">
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="font-display">{pad(s.cur + 1)}</span>
              <span className="relative h-px flex-1 overflow-hidden bg-white/25">
                {!stopped && n > 1 && (
                  <span key={`${s.cur}-${paused}`} className="hero-progress absolute inset-0 bg-white" style={{ animationDuration: `${DELAY}ms` }} />
                )}
              </span>
              <span className="font-display text-white/60">{pad(n)}</span>
            </div>

            <div className="flex gap-3 overflow-hidden [mask-image:linear-gradient(to_right,black_78%,transparent)]">
              {order.map((k, pos) => {
                const w = works[k];
                return (
                  <div key={w.id} className={`w-[290px] shrink-0 rounded-[28px] border border-white/15 bg-white/10 p-3 backdrop-blur-xl transition-opacity sm:w-[330px] ${pos ? "opacity-60" : ""}`}>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => jump(k)} aria-label={`Show ${w.title}`} className="shrink-0 overflow-hidden rounded-2xl">
                        <img src={w.thumb || w.url} alt={w.title} decoding="async" className="h-28 w-24 object-cover" />
                      </button>
                      <div className="flex min-w-0 flex-col py-1 text-left">
                        <p className="font-display line-clamp-2 text-base font-semibold leading-tight">{w.title}</p>
                        <p className="mt-1 text-xs text-white/65">{w.category}</p>
                        {pos === 0 && (
                          <Link href={`/work#w-${w.id}`} className="mt-auto inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink">
                            View work
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {arrows}
          </div>
        )}

        {n > 0 && !home && (
          <div style={{ "--d": "200ms" }} className="rise mt-12 flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-sm">
            <Link href={`/work#w-${cur.id}`} className="min-w-0 truncate hover:text-flame">
              <span className="font-semibold">{cur.title}</span> <span className="text-white/55">{cur.category}</span>
            </Link>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-display hidden sm:inline">{pad(s.cur + 1)} / {pad(n)}</span>
              {arrows}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
