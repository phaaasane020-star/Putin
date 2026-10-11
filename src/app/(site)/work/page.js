import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import { allWorks, topWorks } from "@/lib/data";

export const revalidate = 60;
export const metadata = { title: "Work" };

export default async function WorkPage() {
  const [hero, works] = await Promise.all([topWorks(8), allWorks()]);
  return (
    <>
      <Hero works={hero} title="The work" lead="Flyers, logos, edits and shoots. Tap any piece to see it up close." />
      <section className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
        <WorkGrid works={works} />
      </section>
    </>
  );
}
