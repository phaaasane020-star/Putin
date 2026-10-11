import { NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const signedIn = await verifySession(req.cookies.get(COOKIE)?.value);

  if (pathname === "/api/admin/login") return NextResponse.next();
  if (pathname === "/admin/login") {
    return signedIn ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (signedIn) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
