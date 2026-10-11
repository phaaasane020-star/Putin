import Icon from "@/components/Icon";
import Link from "next/link";
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import SliceButton from "@/components/SliceButton";
import { topWorks } from "@/lib/data";
import { perks, services, steps, waLink } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const works = await topWorks(8);
  const order = waLink("Hi Putin Edit, I'd like to place an order.");

  return (
    <>
      <Hero
        variant="home"
        works={works}
        title="More than just edits. It's a vibe."
        lead="Picture editing, graphic design, AI ads, photography and video from Ghana. Your vision, my creativity."
      >
        <SliceButton href="/work" variant="flame" size="lg">See the work</SliceButton>
        <SliceButton href={order} external variant="light" size="lg">Chat on WhatsApp</SliceButton>
      </Hero>

      <Marquee items={services.map((s) => s.title)} />

      <section className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Recent work</h2>
            <Link href="/work" className="link-slide font-medium text-flame-deep hover:text-flame">See all work</Link>
          </div>
        </Reveal>
        <Reveal delay={120}><WorkGrid works={works.slice(0, 6)} filters={false} /></Reveal>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-5 md:px-10">
          <Reveal><h2 className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">Everything from the first shot to the final post</h2></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 110} className="h-full">
                <Link href="/services" className="block h-full rounded-3xl bg-paper p-7 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl">
                  <Icon name={s.icon} size={36} className="text-flame" />
                  <h3 className="font-display mt-6 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-ink/70">{s.items.join(", ")}</p>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={220} className="h-full">
              <Link href="/contact" className="flex h-full flex-col justify-between rounded-3xl bg-ink p-7 text-paper transition-all duration-300 hover:-translate-y-1.5 hover:bg-flame-deep">
                <h3 className="font-display text-2xl font-bold">Not sure what you need?</h3>
                <p className="mt-6 font-medium">Tell me your idea</p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-28">
        <Reveal><h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">How it works</h2></Reveal>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 120}>
                <span className="font-display text-6xl font-extrabold text-flame">{i + 1}</span>
                <h3 className="font-display mt-3 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-ink/70">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <Icon name={p.icon} size={32} className="text-flame" />
              <h3 className="font-display mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-white/65">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-24 text-center md:px-10 md:py-32">
        <Reveal>
          <h2 className="font-display mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-balance md:text-6xl">Let's create something amazing</h2>
          <div className="mt-9 flex justify-center">
            <SliceButton href={order} external variant="dark" size="lg">
              <Icon name="chat" /> Chat on WhatsApp
            </SliceButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
