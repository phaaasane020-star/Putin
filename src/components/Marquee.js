import Icon from "@/components/Icon";

export default function Marquee({ items }) {
  const row = (hidden) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-8">
          <span>{t}</span>
          <Icon name="auto_awesome" size={36} className="text-flame" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-ink py-6 text-paper md:py-8">
      <div className="marquee font-display text-4xl font-extrabold tracking-tight md:text-6xl">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
