/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import { waLink } from "@/lib/site";
import SliceButton from "@/components/SliceButton";
import Icon from "@/components/Icon";

export default function WorkGrid({ works, filters = true }) {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(-1);

  const cats = useMemo(() => {
    const m = new Map();
    works.forEach((w) => m.set(w.category, (m.get(w.category) || 0) + 1));
    return [...m];
  }, [works]);
  const list = cat === "All" ? works : works.filter((w) => w.category === cat);

  // Opens a work straight away when linked as /work#w-12
  useEffect(() => {
    const m = window.location.hash.match(/^#w-(\d+)$/);
    if (m) {
      const idx = works.findIndex((w) => String(w.id) === m[1]);
      if (idx >= 0) setOpen(idx);
    }
  }, [works]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((o) => (o + 1) % list.length);
      if (e.key === "ArrowLeft") setOpen((o) => (o - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, list.length]);

  if (works.length === 0) {
    return (
      <div className="rounded-3xl bg-sand px-6 py-20 text-center">
        <p className="font-display text-2xl font-bold">New work is on its way</p>
        <p className="mt-2 text-ink/70">Check back soon, or message me on WhatsApp to see samples.</p>
      </div>
    );
  }

  const w = open >= 0 ? list[open] : null;

  return (
    <div>
      {filters && cats.length > 1 && (
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="tablist" aria-label="Filter by category">
            {[["All", works.length], ...cats].map(([name, count]) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={cat === name}
                onClick={() => { setCat(name); setOpen(-1); }}
                className={`shrink-0 rounded-full border px-5 py-2 text-sm transition-colors ${
                  cat === name ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {name} <span className="ml-1 opacity-55">{count}</span>
              </button>
            ))}
          </div>
          <p className="shrink-0 text-sm text-ink/55">{list.length} {list.length === 1 ? "work" : "works"}</p>
        </div>
      )}

      {/* Same-size cards in an even grid, with the title underneath, like a portfolio on Behance */}
      <div key={cat} className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
        {list.map((item, i) => (
          <button
            key={item.id}
            id={`w-${item.id}`}
            type="button"
            onClick={() => setOpen(i)}
            className="rise group block scroll-mt-28 text-left"
            style={{ "--d": `${Math.min(i, 8) * 50}ms` }}
          >
            <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
              <img
                src={item.thumb || item.url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/15" />
              <span className="absolute right-3 top-3 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <Icon name="north_east" size={18} />
              </span>
            </span>
            <span className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <span className="font-display text-base font-semibold leading-snug md:text-lg">{item.title}</span>
              <span className="w-fit shrink-0 rounded-full bg-sand px-3 py-1 text-xs text-ink/65">{item.category}</span>
            </span>
          </button>
        ))}
      </div>

      {w && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label={w.title} onClick={() => setOpen(-1)}>
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="min-w-0">
              <p className="font-display truncate text-lg font-bold">{w.title}</p>
              <p className="text-sm text-white/60">{w.category}</p>
            </div>
            <button type="button" aria-label="Close" onClick={() => setOpen(-1)} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <Icon name="close" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <img src={w.url} alt={w.title} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full rounded-xl object-contain" />
            {list.length > 1 && (
              <>
                <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o - 1 + list.length) % list.length); }}
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:left-6">
                  <Icon name="arrow_back" />
                </button>
                <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o + 1) % list.length); }}
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:right-6">
                  <Icon name="arrow_forward" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <SliceButton href={waLink(`Hi Putin Edit, I saw "${w.title}" on your site and I'd like something similar.`)} external variant="flame" size="lg">
              Order something like this
            </SliceButton>
          </div>
        </div>
      )}
    </div>
  );
}
