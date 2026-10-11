import Link from "next/link";
import BarList from "@/components/BarList";
import TrafficChart from "@/components/TrafficChart";
import { getStats } from "@/lib/data";

export const dynamic = "force-dynamic";

const ranges = [7, 30, 90];

function countryName(code) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export default async function Dashboard({ searchParams }) {
  const sp = await searchParams;
  const days = ranges.includes(Number(sp?.range)) ? Number(sp.range) : 30;

  let stats;
  try {
    stats = await getStats(days);
  } catch (e) {
    return (
      <div className="max-w-xl rounded-3xl bg-white p-8">
        <h1 className="font-display text-2xl font-bold">Connect your database</h1>
        <p className="mt-3 text-ocean/75">The dashboard can't reach the database yet. Add your Supabase DATABASE_URL in the Vercel environment variables, then redeploy.</p>
        <p className="mt-3 rounded-2xl bg-canvas p-4 text-sm">{e.message}</p>
      </div>
    );
  }

  const { totals, series, pages, sources, devices, countries, works } = stats;
  const cards = [
    { label: "Visitors", value: totals.visitors, note: `Last ${days} days`, cls: "bg-ocean text-ice", sub: "text-ice/70" },
    { label: "Page views", value: totals.views, note: `Last ${days} days`, cls: "bg-peach text-ocean", sub: "text-ocean/70" },
    { label: "Visitors today", value: totals.today, note: "Since midnight", cls: "bg-ice text-ocean", sub: "text-ocean/70" },
    { label: "Works live", value: works, note: "On your site", cls: "bg-white text-ocean", sub: "text-ocean/60" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 flex items-center gap-2 text-ocean/70">
            <span className={`size-2.5 rounded-full ${totals.online ? "bg-green-500" : "bg-ocean/30"}`} />
            {totals.online} {totals.online === 1 ? "person" : "people"} on the site right now
          </p>
        </div>
        <div className="flex rounded-full bg-white p-1" role="tablist" aria-label="Date range">
          {ranges.map((r) => (
            <Link key={r} href={`/admin?range=${r}`} role="tab" aria-selected={r === days}
              className={`rounded-full px-4 py-2 text-sm font-medium ${r === days ? "bg-ocean text-ice" : "text-ocean/70 hover:text-ocean"}`}>
              {r} days
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-3xl p-6 ${c.cls}`}>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="font-display mt-3 text-5xl font-extrabold tracking-tight">{c.value.toLocaleString()}</p>
            <p className={`mt-2 text-sm ${c.sub}`}>{c.note}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 rounded-3xl bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Traffic</h2>
          <p className="flex items-center gap-4 text-sm text-ocean/70">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-peach" />Page views</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-ocean" />Visitors</span>
          </p>
        </div>
        <TrafficChart data={series} />
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <BarList title="Top pages" hint="Page views" rows={pages} />
        <BarList title="Where visitors come from" hint="Visitors" rows={sources} />
        <BarList title="Countries" hint="Visitors" rows={countries.map((c) => ({ ...c, label: c.label.length === 2 ? countryName(c.label) : c.label }))} />
        <BarList title="Devices" hint="Visitors" rows={devices} />
      </div>
    </div>
  );
}
