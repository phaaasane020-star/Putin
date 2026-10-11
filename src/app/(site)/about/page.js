import Hero from "@/components/Hero";
import { topWorks } from "@/lib/data";
import { about, pillars, site, waLink } from "@/lib/site";
import SliceButton from "@/components/SliceButton";
import Reveal from "@/components/Reveal";

export const revalidate = 60;
export const metadata = { title: "About" };

export default async function AboutPage() {
  const hero = await topWorks(8);
  return (
    <>
      <Hero works={hero} title="Capture. Edit. Design." lead={site.tagline + "."} />

      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-5">
          <h2 className="font-display text-4xl font-bold tracking-tight">Quality designs, timeless memories</h2>
        </div>
        <div className="space-y-5 text-lg text-ink/75 md:col-span-7">
          {about.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-4 px-5 md:grid-cols-3 md:px-10">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 120} className="h-full">
            <div className="h-full rounded-3xl bg-paper p-8 transition-transform duration-300 hover:-translate-y-1.5">
              <h3 className="font-display text-3xl font-bold">{p.title}</h3>
              <p className="mt-3 text-ink/70">{p.text}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-20 text-center md:px-10">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Have something in mind?</h2>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <SliceButton href={waLink("Hi Putin Edit, I'd like to place an order.")} external variant="dark" size="lg">Chat on WhatsApp</SliceButton>
          <SliceButton href="/work" variant="dark" size="lg">See the work</SliceButton>
        </div>
      </section>
    </>
  );
}
