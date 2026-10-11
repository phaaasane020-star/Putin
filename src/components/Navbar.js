"use client";
import Icon from "@/components/Icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import SliceButton from "@/components/SliceButton";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/site";

const links = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/services", "Services"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Slides away when you scroll down, returns when you scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isActive = (href) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 md:px-6 md:pt-5 ${hidden && !open ? "-translate-y-full" : ""}`}>
      <div className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/15 bg-black/35 py-2 pl-5 pr-2 text-white backdrop-blur-xl">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          Putin <span className="text-flame">Edit</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(href) ? "bg-white font-medium text-ink" : "text-white/75 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SliceButton href={waLink("Hi Putin Edit, I'd like to place an order.")} external variant="flame" size="sm" className="hidden sm:inline-flex">
            Hire me on WhatsApp
          </SliceButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full bg-white/10 md:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-white/15 bg-black/80 p-3 text-white backdrop-blur-xl md:hidden" aria-label="Mobile">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block rounded-2xl px-4 py-3 ${isActive(href) ? "bg-white/15 font-medium" : "text-white/80"}`}
            >
              {label}
            </Link>
          ))}
          <a
            href={waLink("Hi Putin Edit, I'd like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-2xl bg-flame px-4 py-3 text-center font-medium"
          >
            Hire me on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
