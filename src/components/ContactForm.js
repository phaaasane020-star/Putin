"use client";
import Icon from "@/components/Icon";
import { useState } from "react";
import { services, waLink } from "@/lib/site";
import SliceButton from "@/components/SliceButton";

const field = "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-flame focus:ring-2 focus:ring-flame/20";

// Builds a WhatsApp message from the form so the order lands straight in the chat.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hi Putin Edit, my name is ${f.get("name")}.\nI need: ${f.get("service")}.\nDeadline: ${f.get("when")}.\n\n${f.get("details")}`;
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl bg-sand p-6 md:p-8">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">Your name</label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-2 block text-sm font-medium">What do you need?</label>
          <select id="service" name="service" className={field} defaultValue={services[0].title}>
            {services.map((s) => <option key={s.title}>{s.title}</option>)}
            <option>Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="when" className="mb-2 block text-sm font-medium">When do you need it?</label>
          <select id="when" name="when" className={field} defaultValue="Within a week">
            <option>As soon as possible</option>
            <option>Within a week</option>
            <option>Within a month</option>
            <option>I&apos;m flexible</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="details" className="mb-2 block text-sm font-medium">Tell me about it</label>
        <textarea id="details" name="details" required rows={5} className={field} placeholder="Event name, colors you like, text to include..." />
      </div>
      <SliceButton type="submit" variant="dark" size="lg">
        <Icon name="chat" /> Send on WhatsApp
      </SliceButton>
      <p className="text-sm text-ink/60" aria-live="polite">
        {sent ? "WhatsApp should have opened with your message. Press send there to finish." : "This opens WhatsApp with your message already written."}
      </p>
    </form>
  );
}
