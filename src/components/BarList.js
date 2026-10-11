export default function BarList({ title, hint, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="rounded-3xl bg-white p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {hint && <p className="text-sm text-ocean/60">{hint}</p>}
      {rows.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-canvas p-4 text-sm text-ocean/70">No visits recorded yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate">{r.label}</span>
                <span className="font-semibold">{r.n}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-ice/60">
                <div className="h-2 rounded-full bg-peach" style={{ width: `${(r.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
