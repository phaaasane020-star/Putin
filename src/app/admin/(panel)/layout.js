import AdminNav from "@/components/AdminNav";

export default function PanelLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas text-ocean md:flex">
      <aside className="bg-ocean text-ice md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <AdminNav />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-10">{children}</main>
    </div>
  );
}
