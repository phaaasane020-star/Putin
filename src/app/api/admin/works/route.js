import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import { categories } from "@/lib/site";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string" || !file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
    }
    if (file.size > 4.4 * 1024 * 1024) {
      return NextResponse.json({ error: "This image is over 4.4 MB. Export a smaller version and try again." }, { status: 413 });
    }
    const title = String(form.get("title") || "Untitled").slice(0, 120);
    const requested = String(form.get("category") || "");
    const category = categories.includes(requested) ? requested : "Other";
    const featured = form.get("featured") === "true";
    const width = parseInt(form.get("width"), 10) || 0;
    const height = parseInt(form.get("height"), 10) || 0;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "work";
    const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
    const stamp = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${slug}`;
    // Optional smaller copies made in the browser: a thumbnail for grids and a mid-size one for the hero.
    const extra = async (key, prefix) => {
      const f = form.get(key);
      if (f && typeof f !== "string" && f.type?.startsWith("image/") && f.size < 1024 * 1024) {
        return uploadImage(`${prefix}-${stamp}.webp`, f, "image/webp");
      }
      return null;
    };
    const [url, thumbUrl, heroUrl] = await Promise.all([
      uploadImage(`${stamp}.${ext}`, file, file.type),
      extra("thumb", "thumb"),
      extra("hero", "hero"),
    ]);

    const sql = await getSql();
    const [row] = await sql`INSERT INTO works (title, category, url, thumb_url, hero_url, width, height, featured)
      VALUES (${title}, ${category}, ${url}, ${thumbUrl}, ${heroUrl}, ${width}, ${height}, ${featured}) RETURNING id`;
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error("upload:", e);
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
