/* eslint-disable @next/next/no-img-element */
"use client";
import Icon from "@/components/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/site";

export default function WorkCard({ w }) {
  const router = useRouter();
  const [title, setTitle] = useState(w.title);
  const [busy, setBusy] = useState(false);

  async function patch(data) {
    setBusy(true);
    await fetch(`/api/admin/works/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${w.title}"? This can't be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/works/${w.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <article className={`overflow-hidden rounded-3xl bg-white transition-opacity ${busy ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] bg-ice/40">
        <img src={w.thumb || w.url} alt={w.title} loading="lazy" decoding="async" className="size-full object-cover" />
        <button
          type="button"
          onClick={() => patch({ featured: !w.featured })}
          aria-pressed={w.featured}
          title="Featured works play in the hero and appear first on the home page"
          className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            w.featured ? "bg-peach text-ocean" : "bg-ocean/80 text-ice"
          }`}
        >
          <Icon name="star" size={16} fill={w.featured} />
          {w.featured ? "Featured" : "Feature"}
        </button>
      </div>
      <div className="space-y-3 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== w.title && patch({ title })}
          aria-label="Title"
          className="font-display w-full rounded-xl border border-transparent px-2 py-1.5 text-base font-bold hover:border-ocean/20 focus:border-ocean focus:outline-none"
        />
        <select
          value={w.category}
          onChange={(e) => patch({ category: e.target.value })}
          aria-label="Category"
          className="w-full rounded-xl border border-ocean/15 bg-canvas px-3 py-2 text-sm"
        >
          {[...new Set([w.category, ...categories])].map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="flex items-center justify-between text-sm text-ocean/60">
          <span>{w.date}</span>
          <button type="button" onClick={remove} className="flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-red-700 hover:bg-red-50">
            <Icon name="delete" size={18} />Delete
          </button>
        </div>
      </div>
    </article>
  );
}
