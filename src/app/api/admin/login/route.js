import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { COOKIE, createSession } from "@/lib/auth";

function same(a, b) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export async function POST(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "ADMIN_PASSWORD and SESSION_SECRET are not set on the server." }, { status: 500 });
  }
  let body = {};
  try { body = await req.json(); } catch {}
  const password = typeof body.password === "string" ? body.password : "";
  if (!same(password, expected)) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
