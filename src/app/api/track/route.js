import { COOKIE, verifySession } from "@/lib/auth";
import { getSql } from "@/lib/db";

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|facebookexternalhit/i;

const device = (ua) => (/ipad|tablet/i.test(ua) ? "Tablet" : /mobi|android|iphone/i.test(ua) ? "Mobile" : "Desktop");
const browser = (ua) =>
  /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /firefox/i.test(ua) ? "Firefox"
  : /chrome|crios/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other";

export async function POST(req) {
  const done = () => new Response(null, { status: 204 });
  try {
    const ua = req.headers.get("user-agent") || "";
    if (!ua || BOT.test(ua)) return done();
    // Don't count the owner's own visits while signed in to the admin panel.
    if (await verifySession(req.cookies.get(COOKIE)?.value)) return done();

    const { path, referrer, first, vid } = await req.json();
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return done();
    if (typeof vid !== "string" || vid.length < 8 || vid.length > 64) return done();

    // referrer: null = moved around inside the site, "" = typed the address or no referrer, otherwise the source site.
    let ref = null;
    if (first) {
      ref = "";
      try {
        const host = new URL(referrer).hostname.replace(/^www\./, "");
        const own = (req.headers.get("host") || "").split(":")[0].replace(/^www\./, "");
        ref = host === own ? null : host;
      } catch {}
    }

    const country = req.headers.get("x-vercel-ip-country") || null;
    const sql = await getSql();
    await sql`INSERT INTO visits (visitor_id, path, referrer, device, browser, country)
      VALUES (${vid}, ${path.slice(0, 200)}, ${ref}, ${device(ua)}, ${browser(ua)}, ${country})`;
  } catch (e) {
    console.error("track:", e.message);
  }
  return done();
}
