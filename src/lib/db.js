import postgres from "postgres";

let sql;
let ready = null;

function connect() {
  if (!sql) {
    const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!raw) throw new Error("DATABASE_URL is not set. Add your Supabase connection string.");
    // Supabase's pooler URL can carry extra query parameters that Postgres rejects, so drop them.
    const url = new URL(raw);
    url.search = "";
    sql = postgres(url.toString(), { ssl: "require", prepare: false, max: 4, idle_timeout: 20, connect_timeout: 15 });
  }
  return sql;
}

// One quick check on start-up. The tables are only created/updated when something is missing.
export async function getSql() {
  const db = connect();
  if (!ready) {
    ready = (async () => {
      const [r] = await db`SELECT
        to_regclass('public.works') AS w,
        to_regclass('public.visits') AS v,
        (SELECT count(*) FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'works' AND column_name IN ('thumb_url', 'hero_url'))::int AS cols`;
      if (r.w && r.v && r.cols === 2) return;

      await db`CREATE TABLE IF NOT EXISTS works (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL,
        thumb_url TEXT,
        hero_url TEXT,
        width INT NOT NULL DEFAULT 0,
        height INT NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await db`ALTER TABLE works ADD COLUMN IF NOT EXISTS thumb_url TEXT`;
      await db`ALTER TABLE works ADD COLUMN IF NOT EXISTS hero_url TEXT`;
      await db`CREATE TABLE IF NOT EXISTS visits (
        id BIGSERIAL PRIMARY KEY,
        visitor_id TEXT NOT NULL,
        path TEXT NOT NULL,
        referrer TEXT,
        device TEXT,
        browser TEXT,
        country TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await db`CREATE INDEX IF NOT EXISTS visits_created_idx ON visits (created_at)`;
      await db`ALTER TABLE works ENABLE ROW LEVEL SECURITY`;
      await db`ALTER TABLE visits ENABLE ROW LEVEL SECURITY`;
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  await ready;
  return db;
}
