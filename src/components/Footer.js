import Link from "next/link";
import { site, waLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-display text-3xl font-extrabold tracking-tight">
            Putin <span className="text-flame">Edit</span>
          </p>
          <p className="mt-3 max-w-xs text-white/70">{site.tagline}. {site.motto.replaceAll("|", "·")}</p>
        </div>

        <div className="md:col-span-3">
          <p className="font-display text-sm font-semibold text-white/50">Pages</p>
          <ul className="mt-4 space-y-2">
            {[["/", "Home"], ["/work", "Work"], ["/services", "Services"], ["/about", "About"], ["/contact", "Contact"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="link-slide text-white/85 hover:text-flame">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-display text-sm font-semibold text-white/50">Get in touch</p>
          <ul className="mt-4 space-y-2 text-white/85">
            <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-slide hover:text-flame">WhatsApp {site.phone}</a></li>
            <li><a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" className="link-slide hover:text-flame">Instagram @{site.instagram}</a></li>
            <li>
              {site.facebookUrl
                ? <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="link-slide hover:text-flame">Facebook {site.facebookName}</a>
                : <span>Facebook {site.facebookName}</span>}
            </li>
            <li className="text-white/60">{site.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
        <span className="mt-1 block text-white/70">
          Powered by{" "}
          <a href="https://paatech.vercel.app" target="_blank" rel="noopener noreferrer" className="link-slide font-medium text-white hover:text-flame">
            Paa Asane Technologies
          </a>
        </span>
      </div>
    </footer>
  );
}
