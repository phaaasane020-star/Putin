"use client";
import Icon from "@/components/Icon";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/site";

const pretty = (name) => {
  const t = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Untitled";
};

// Resizes photos in the browser: 1800px (viewer), 1400px (hero) and 720px (grid) versions, all WebP.
async function shrink(file, max = 1800, quality = 0.82) {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise((r) => canvas.toBlob(r, "image/webp", quality));
    return blob ? { blob, w, h } : null;
  } catch {
    return null;
  }
}

export default function Uploader() {
  const router = useRouter();
  const input = useRef(null);
  const [category, setCategory] = useState(categories[0]);
  const [featured, setFeatured] = useState(true);
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [drag, setDrag] = useState(false);
  const busy = items.some((i) => i.state === "wait" || i.state === "work");

  async function handle(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setItems(files.map((f) => ({ name: f.name, state: "wait" })));
    const set = (i, patch) => setItems((arr) => arr.map((x, k) => (k === i ? { ...x, ...patch } : x)));

    for (let i = 0; i < files.length; i++) {
      set(i, { state: "work" });
      try {
        const f = files[i];
        const s = await shrink(f);
        const t = s ? await shrink(f, 720, 0.78) : null;
        const h = s ? await shrink(f, 1400, 0.74) : null;
        const file = s ? new File([s.blob], f.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" }) : f;
        const body = new FormData();
        body.set("file", file);
        if (t) body.set("thumb", new File([t.blob], "thumb.webp", { type: "image/webp" }));
        if (h) body.set("hero", new File([h.blob], "hero.webp", { type: "image/webp" }));
        body.set("title", files.length === 1 && title.trim() ? title.trim() : pretty(f.name));
        body.set("category", category);
        body.set("featured", String(featured));
        body.set("width", String(s?.w || 0));
        body.set("height", String(s?.h || 0));
        const res = await fetch("/api/admin/works", { method: "POST", body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");
        set(i, { state: "done" });
      } catch (e) {
        set(i, { state: "error", msg: e.message });
      }
    }
    setTitle("");
    if (input.current) input.current.value = "";
    router.refresh();
  }

  const field = "w-full rounded-2xl border border-ocean/20 bg-white px-4 py-3 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/15";

  return (
    <section className="rounded-3xl bg-white p-6">
      <h2 className="font-display text-lg font-bold">Add new work</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="cat" className="mb-2 block text-sm font-medium">Category</label>
          <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ttl" className="mb-2 block text-sm font-medium">Title (optional)</label>
          <input id="ttl" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Taken from the file name if empty" className={field} />
        </div>
        <label className="flex items-center gap-3 self-end rounded-2xl bg-canvas px-4 py-3.5 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-[#002B4C]" />
          Feature in the hero and home page
        </label>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          drag ? "border-peach bg-peach/15" : "border-ocean/25 bg-ice/30 hover:bg-ice/50"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <Icon name="cloud_upload" size={40} className="text-ocean" />
        <span className="font-display mt-3 text-lg font-bold">Drop images here or click to choose</span>
        <span className="mt-1 text-sm text-ocean/70">JPG, PNG or WebP. You can pick many at once.</span>
        <input ref={input} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => handle(e.target.files)} />
      </label>

      {items.length > 0 && (
        <ul className="mt-5 space-y-2" aria-live="polite">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3 text-sm">
              <span className="truncate">{it.name}</span>
              <span className={`shrink-0 font-medium ${it.state === "error" ? "text-red-700" : ""}`}>
                {it.state === "wait" && "Waiting"}
                {it.state === "work" && "Uploading..."}
                {it.state === "done" && "Uploaded"}
                {it.state === "error" && (it.msg || "Failed")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
