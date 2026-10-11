import { getSql } from "./db";

const plain = (rows) => Array.from(rows, (r) => ({ ...r }));

// Public site: featured works first, then newest. Never throws, so the site still loads without a database.
export async function topWorks(limit = 8) {
  try {
    const sql = await getSql();
    return plain(await sql`SELECT id, title, category, description, url, coalesce(thumb_url, url) AS thumb, coalesce(hero_url, url) AS hero, width, height, featured
      FROM works ORDER BY featured DESC, created_at DESC LIMIT ${limit}`);
  } catch (e) {
    console.error("topWorks:", e.message);
    return [];
  }
}

export async function allWorks() {
  try {
    const sql = await getSql();
    return plain(await sql`SELECT id, title, category, description, url, coalesce(thumb_url, url) AS thumb, coalesce(hero_url, url) AS hero, width, height, featured
      FROM works ORDER BY created_at DESC LIMIT 500`);
  } catch (e) {
    console.error("allWorks:", e.message);
    return [];
  }
}

export async function adminWorks() {
  const sql = await getSql();
  return plain(await sql`SELECT id, title, category, url, coalesce(thumb_url, url) AS thumb, coalesce(hero_url, url) AS hero, width, height, featured,
      to_char(created_at, 'DD Mon YYYY') AS date
    FROM works ORDER BY created_at DESC LIMIT 500`);
}

export async function getStats(days) {
  const sql = await getSql();
  const [totals, series, pages, sources, devices, countries, works] = await Promise.all([
    sql`SELECT
        count(*)::int AS views,
        count(DISTINCT visitor_id)::int AS visitors,
        count(DISTINCT visitor_id) FILTER (WHERE created_at >= current_date)::int AS today,
        count(DISTINCT visitor_id) FILTER (WHERE created_at >= now() - interval '5 minutes')::int AS online
      FROM visits WHERE created_at >= now() - make_interval(days => ${days}::int)`,
    sql`SELECT to_char(d::date, 'DD Mon') AS label,
        coalesce(v.views, 0)::int AS views, coalesce(v.visitors, 0)::int AS visitors
      FROM generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') AS d
      LEFT JOIN (
        SELECT created_at::date AS day, count(*) AS views, count(DISTINCT visitor_id) AS visitors
        FROM visits WHERE created_at >= current_date - ${days - 1}::int GROUP BY 1
      ) v ON v.day = d::date
      ORDER BY d`,
    sql`SELECT path AS label, count(*)::int AS n FROM visits
      WHERE created_at >= now() - make_interval(days => ${days}::int)
      GROUP BY path ORDER BY n DESC LIMIT 8`,
    sql`SELECT CASE WHEN referrer = '' THEN 'Direct' ELSE referrer END AS label,
        count(DISTINCT visitor_id)::int AS n FROM visits
      WHERE referrer IS NOT NULL AND created_at >= now() - make_interval(days => ${days}::int)
      GROUP BY 1 ORDER BY n DESC LIMIT 8`,
    sql`SELECT coalesce(device, 'Unknown') AS label, count(DISTINCT visitor_id)::int AS n FROM visits
      WHERE created_at >= now() - make_interval(days => ${days}::int)
      GROUP BY 1 ORDER BY n DESC LIMIT 5`,
    sql`SELECT coalesce(country, 'Unknown') AS label, count(DISTINCT visitor_id)::int AS n FROM visits
      WHERE created_at >= now() - make_interval(days => ${days}::int)
      GROUP BY 1 ORDER BY n DESC LIMIT 8`,
    sql`SELECT count(*)::int AS n FROM works`,
  ]);
  return {
    totals: { ...totals[0] },
    series: plain(series),
    pages: plain(pages),
    sources: plain(sources),
    devices: plain(devices),
    countries: plain(countries),
    works: works[0].n,
  };
}
