import Icon from "@/components/Icon";
import Hero from "@/components/Hero";
import { topWorks } from "@/lib/data";
import { services, perks, waLink } from "@/lib/site";
import SliceButton from "@/components/SliceButton";
import Reveal from "@/components/Reveal";

export const revalidate = 60;
export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const hero = await topWorks(8);
  return (
    <>
      <Hero works={hero} title="What I can make for you" lead="Five services, one creative studio. Mix and match them for your event, brand or business." />

      <section className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
        <div className="divide-y divide-ink/10">
          {services.map((s) => (
            <Reveal key={s.title}>
            <article className="grid gap-6 py-10 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <Icon name={s.icon} size={40} className="text-flame" />
                <h2 className="font-display mt-4 text-3xl font-bold tracking-tight">{s.title}</h2>
              </div>
              <div className="md:col-span-5">
                <p className="text-lg text-ink/75">{s.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.items.map((i) => <li key={i} className="rounded-full bg-sand px-4 py-1.5 text-sm">{i}</li>)}
                </ul>
              </div>
              <div className="md:col-span-3 md:text-right">
                <SliceButton href={waLink(`Hi Putin Edit, I'd like to ask about ${s.title.toLowerCase()}.`)} external variant="dark">
                  Ask about this
                </SliceButton>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand py-16 md:py-20">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title}>
              <Icon name={p.icon} size={32} className="text-flame" />
              <h3 className="font-display mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-ink/70">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
