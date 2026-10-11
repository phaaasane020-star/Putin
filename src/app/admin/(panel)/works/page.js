import Uploader from "@/components/Uploader";
import WorkCard from "@/components/WorkCard";
import { adminWorks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WorksAdmin() {
  let works = [];
  let error = "";
  try {
    works = await adminWorks();
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">My work</h1>
      <p className="mt-1 text-ocean/70">Upload designs and photos. They appear on your website straight away.</p>

      {error && (
        <p className="mt-6 rounded-2xl bg-white p-5 text-sm">
          Supabase isn't connected yet. Add DATABASE_URL, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the Vercel environment variables, then redeploy. <span className="mt-2 block text-ocean/60">{error}</span>
        </p>
      )}

      <div className="mt-8"><Uploader /></div>

      <h2 className="font-display mt-10 text-xl font-bold">All work ({works.length})</h2>
      {works.length === 0 ? (
        <p className="mt-4 rounded-3xl bg-white p-8 text-center text-ocean/70">Nothing here yet. Add your first image above.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => <WorkCard key={w.id} w={w} />)}
        </div>
      )}
    </div>
  );
}
