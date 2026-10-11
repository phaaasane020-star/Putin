"use client";
import Icon from "@/components/Icon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  ["/admin", "Dashboard", "monitoring"],
  ["/admin/works", "My work", "photo_library"],
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const base = "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors";

  return (
    <div className="flex items-center gap-2 overflow-x-auto p-3 md:h-full md:flex-col md:items-stretch md:gap-1 md:p-5">
      <Link href="/admin" className="font-display hidden px-4 pb-6 pt-2 text-2xl font-extrabold md:block">
        Putin <span className="text-peach">Edit</span>
        <span className="mt-1 block text-xs font-medium text-ice/60">Admin panel</span>
      </Link>

      {items.map(([href, label, icon]) => {
        const on = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}
            className={`${base} shrink-0 ${on ? "bg-ice text-ocean" : "text-ice/80 hover:bg-white/10"}`}>
            <Icon name={icon} />{label}
          </Link>
        );
      })}

      <a href="/" target="_blank" rel="noopener noreferrer" className={`${base} shrink-0 text-ice/80 hover:bg-white/10`}>
        <Icon name="open_in_new" />View site
      </a>
      <button type="button" onClick={logout} className={`${base} shrink-0 text-ice/80 hover:bg-white/10 md:mt-auto`}>
        <Icon name="logout" />Sign out
      </button>
    </div>
  );
}
