import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { removeImage } from "@/lib/storage";
import { categories } from "@/lib/site";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 120) : null;
  const category = categories.includes(body.category) ? body.category : null;
  const featured = typeof body.featured === "boolean" ? body.featured : null;
  const sql = await getSql();
  await sql`UPDATE works SET
      title = COALESCE(${title}::text, title),
      category = COALESCE(${category}::text, category),
      featured = COALESCE(${featured}::boolean, featured)
    WHERE id = ${Number(id)}`;
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  const sql = await getSql();
  const rows = await sql`DELETE FROM works WHERE id = ${Number(id)} RETURNING url, thumb_url, hero_url`;
  if (rows[0]?.url) {
    try {
      await removeImage(rows[0].url);
      if (rows[0].thumb_url) await removeImage(rows[0].thumb_url);
      if (rows[0].hero_url) await removeImage(rows[0].hero_url);
    } catch (e) { console.error("image delete:", e.message); }
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
