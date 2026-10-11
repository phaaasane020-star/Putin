import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Tracker from "@/components/Tracker";
import { site } from "@/lib/site";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });

const description =
  "Picture editing, graphic design, AI advertising, photography and video editing in Ghana. Your vision, my creativity.";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${site.name} | Editing, design & photography in Ghana`, template: `%s | ${site.name}` },
  description,
  openGraph: { title: site.name, description, type: "website", siteName: site.name },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dm.variable} font-body antialiased`}>
        {children}
        <Tracker />
      </body>
    </html>
  );
}
