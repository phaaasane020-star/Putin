import Icon from "@/components/Icon";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { topWorks } from "@/lib/data";
import { site, waLink } from "@/lib/site";

export const revalidate = 60;
export const metadata = { title: "Contact" };

const row = "flex items-start gap-4 rounded-2xl bg-sand p-5 transition-colors hover:bg-ink/10";

export default async function ContactPage() {
  const hero = await topWorks(8);
  return (
    <>
      <Hero works={hero} title="Let's create something amazing" lead="Send me your idea. WhatsApp is the fastest way to reach me." />

      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-7"><ContactForm /></div>

        <div className="space-y-3 md:col-span-5">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className={row}>
            <Icon name="chat" className="text-flame" />
            <span><span className="block font-semibold">WhatsApp</span><span className="text-ink/70">{site.phone}</span></span>
          </a>
          <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" className={row}>
            <Icon name="photo_camera" className="text-flame" />
            <span><span className="block font-semibold">Instagram</span><span className="text-ink/70">@{site.instagram}</span></span>
          </a>
          {site.facebookUrl ? (
            <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className={row}>
              <Icon name="thumb_up" className="text-flame" />
              <span><span className="block font-semibold">Facebook</span><span className="text-ink/70">{site.facebookName}</span></span>
            </a>
          ) : (
            <div className={row.replace("hover:bg-ink/10", "")}>
              <Icon name="thumb_up" className="text-flame" />
              <span><span className="block font-semibold">Facebook</span><span className="text-ink/70">{site.facebookName}</span></span>
            </div>
          )}
          <div className={row.replace("hover:bg-ink/10", "")}>
            <Icon name="location_on" className="text-flame" />
            <span><span className="block font-semibold">Location</span><span className="text-ink/70">{site.location}</span></span>
          </div>
        </div>
      </section>
    </>
  );
}
