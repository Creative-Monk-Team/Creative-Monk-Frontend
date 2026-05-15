"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { submitEnquiry } from "@/lib/api";

const HERO_STATS = [
  { value: "<4hr", label: "Avg reply" },
  { value: "Q3", label: "Open slots", suffix: "· 3 left" },
  { value: "Mon–Sat", label: "Studio hours" },
  { value: "4.9", label: "From 87 reviews", suffix: "★" },
];

const CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp the studio",
    value: "+91 94634 45566",
    helper: "Fastest — replies inside 4 working hours",
    href: "https://wa.me/919463445566",
    brand: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="20" height="20">
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 22h-.1c-1.8 0-3.5-.5-5-1.4l-3.7 1 1-3.6c-1-1.6-1.5-3.4-1.5-5.3 0-5.4 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9s2.9 4.3 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email the founder",
    value: "hello@thecreativemonk.in",
    helper: "Read personally by Sahil",
    href: "mailto:hello@thecreativemonk.in",
    brand: "#FF6600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden width="20" height="20">
        <path
          d="M3 5h18v14H3z M3 5l9 7 9-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "call",
    label: "Call the studio",
    value: "+91 94634 45566",
    helper: "Mon–Sat · 09:30–18:30 IST",
    href: "tel:+919463445566",
    brand: "#0F0C08",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden width="20" height="20">
        <path
          d="M22 16.9v3a2 2 0 0 1-2.2 2A19.9 19.9 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const SCOPES = [
  "Brand & identity",
  "Web design + build",
  "Performance marketing",
  "SEO & content",
  "Motion & film",
  "Full studio engagement",
  "Not sure yet — help me scope it",
];

const PROMISES = [
  {
    no: "01",
    title: "We read it",
    italic: "personally",
    detail:
      "Every inbound lands in a shared inbox the founder reads. No SDRs, no chatbot, no \"thanks for reaching out\" auto-reply.",
  },
  {
    no: "02",
    title: "Quick reply",
    italic: "under four hours",
    detail:
      "Within working hours (Mon-Sat · 09:30–18:30 IST) you'll get a real reply with next steps — usually a short Loom or a calendar link.",
  },
  {
    no: "03",
    title: "Honest scope",
    italic: "in 48 hours",
    detail:
      "If it's a fit, you'll have a written proposal with fixed scope and price inside 48 hours of the first call. No hourly billing.",
  },
  {
    no: "04",
    title: "We ship",
    italic: "or we don't take it",
    detail:
      "If we can't give the work real attention, we'll say so on the first call. We turn down most projects — that's what keeps the rest sharp.",
  },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await submitEnquiry({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "",
        service: (formData.get("scope") as string) || "",
        message: (formData.get("message") as string) || "",
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : "/contact",
      });
      toast.success("Got it. We'll reply within 4 working hours.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Couldn't send. Email us at hello@thecreativemonk.in instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative">
      <ContactHero />
      <MainGrid handleSubmit={handleSubmit} submitting={submitting} />
      <Promises />
      <MapSection />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function ContactHero() {
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, rgba(255,102,0,0.12), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-12 md:pt-20 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
              Get in touch · Start a project
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Open studio · Accepting Q3 briefs
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[14ch]"
            >
              Tell us what{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                you&apos;re building.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-[58ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              We read every brief personally. Pick the channel that fits — they
              all land in the same inbox, and you'll get a real reply from a
              real human inside four working hours.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="grid grid-cols-2 gap-3 max-w-md md:ml-auto">
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-stone-900/10 bg-stone-50 p-4 hover:bg-white hover:border-[#FF6600]/40 transition-all duration-300 cursor-default"
                >
                  <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.25rem,1.9vw,1.65rem)]">
                    {s.value}
                    {s.suffix === "★" && (
                      <span className="ml-1 text-[#FF6600] align-baseline">★</span>
                    )}
                  </p>
                  <p className="mt-2.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {s.label}
                    {s.suffix && s.suffix !== "★" && (
                      <span className="text-stone-400"> {s.suffix}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main: channels + form ─────────────────────────────────── */
function MainGrid({
  handleSubmit,
  submitting,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}) {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          {/* LEFT — channels + studio card */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-5 md:gap-6"
          >
            {/* Three ways in */}
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-8">
              <div className="flex items-baseline justify-between mb-6">
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Three ways in
                </p>
                <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF6600]">
                  Same inbox
                </span>
              </div>
              <div className="space-y-3">
                {CHANNELS.map((c) => (
                  <a
                    key={c.id}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-900/10 bg-white/60 px-4 py-3.5 cursor-pointer transition-all duration-300 hover:border-stone-900/30 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-22px_rgba(15,12,8,0.25)]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className="shrink-0 grid place-items-center w-11 h-11 rounded-full text-stone-50"
                        style={{ background: c.brand }}
                      >
                        {c.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1">
                          {c.label}
                        </p>
                        <p className="font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900 truncate">
                          {c.value}
                        </p>
                        <p
                          className="font-jakarta text-[12px] text-stone-500 mt-1"
                          style={{
                            fontFamily: "var(--font-newsreader), Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 400,
                          }}
                        >
                          {c.helper}
                        </p>
                      </div>
                    </div>
                    <svg
                      width="18"
                      height="11"
                      viewBox="0 0 22 12"
                      fill="none"
                      className="shrink-0 text-stone-400 group-hover:text-[#FF6600] group-hover:translate-x-1 transition-all"
                      aria-hidden
                    >
                      <path
                        d="M1 6 H 20 M 16 1 L 20 6 L 16 11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Studio dark card */}
            <div className="rounded-3xl border border-stone-900/10 bg-stone-900 text-stone-50 p-7 md:p-8 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 100% 100%, rgba(255,102,0,0.18), transparent 60%)",
                }}
              />
              <div className="relative">
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-300 mb-4 flex items-center gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400 hero-pulse" />
                  Studio · Mohali
                </p>
                <address className="not-italic font-funnel text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.45] font-bold text-stone-50 tracking-[-0.015em]">
                  Office No. 11-12, 9th Floor
                  <br />
                  Sushma Infinium
                </address>
                <p
                  className="mt-2 font-jakarta text-[13.5px] leading-[1.55] text-stone-300"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Zirakpur · Mohali · Punjab — 140603 · India
                </p>
                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-3">
                  <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                    Mon–Sat · 09:30–18:30 IST
                  </span>
                  <a
                    href="https://g.page/creativemonk?we"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-50 hover:text-[#FF6600] transition-colors cursor-pointer"
                  >
                    Get directions
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 12 L12 2 M5 2 L12 2 L12 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Booking slot tile */}
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-6 md:p-7 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2">
                  Prefer to book a call?
                </p>
                <p className="font-funnel text-[15.5px] font-bold tracking-[-0.015em] text-stone-900 leading-tight">
                  30 minutes,{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "#FF6600",
                    }}
                  >
                    no decks.
                  </span>
                </p>
              </div>
              <a
                href="https://wa.me/919463445566"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 pl-5 pr-1.5 py-1.5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_14px_30px_-14px_rgba(15,12,8,0.45)] shrink-0"
              >
                <span className="font-funnel text-[13px] font-semibold tracking-tight">
                  Book a slot
                </span>
                <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 12 L12 2 M5 2 L12 2 L12 9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </motion.aside>

          {/* RIGHT — Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="col-span-12 lg:col-span-7 rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-10 relative overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(255,102,0,0.07), transparent 60%)",
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-4 mb-7">
                <div>
                  <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-2">
                    Send us a brief
                  </p>
                  <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.6rem,2.6vw,2.2rem)] max-w-[20ch]">
                    Start the{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-newsreader), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        color: "#FF6600",
                      }}
                    >
                      conversation.
                    </span>
                  </h2>
                </div>
                <span className="hidden md:inline-flex items-center gap-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#FF6600] shrink-0">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                    <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
                  </svg>
                  6 fields · 90 seconds
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
                <Field name="name" label="Your name" required placeholder="First & last" />
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  required
                  placeholder="you@company.com"
                />
                <Field
                  name="phone"
                  type="tel"
                  label="Phone (optional)"
                  placeholder="+91 XXXXX XXXXX"
                />
                <SelectField
                  name="scope"
                  label="What do you need?"
                  options={SCOPES}
                />
              </div>

              <div className="mt-7">
                <Field
                  name="company"
                  label="Company or website (optional)"
                  placeholder="Brand name or URL"
                />
              </div>

              <div className="mt-7">
                <Field
                  name="message"
                  label="Tell us about the project"
                  required
                  textarea
                  placeholder="What are you building? What stage are you at? Anything getting in the way?"
                />
              </div>

              <div className="mt-9 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <p className="font-jakarta text-[12.5px] text-stone-500 leading-[1.55] max-w-[44ch]">
                  We read every brief personally. Expect a real reply — not a
                  templated auto-response — inside 4 working hours.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_36px_-18px_rgba(15,12,8,0.5)] disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,102,0,0.85), transparent)",
                    }}
                  />
                  <span className="relative font-funnel text-[14.5px] font-semibold tracking-tight">
                    {submitting ? "Sending…" : "Send brief"}
                  </span>
                  <span className="relative inline-grid place-items-center w-10 h-10 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 12 L12 2 M5 2 L12 2 L12 9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ─── Promises ──────────────────────────────────────────────── */
function Promises() {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-14"
        >
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                What happens next
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[22ch]">
              Four{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                small promises
              </span>{" "}
              about your inbound.
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 font-jakarta text-[14.5px] leading-[1.6] text-stone-700 max-w-[42ch]">
            The studio runs the same playbook for every brief, from a single
            logo refresh to a multi-quarter retainer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {PROMISES.map((p, i) => (
            <motion.article
              key={p.no}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="group relative rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-8 hover:-translate-y-1.5 hover:border-stone-900/25 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.2)] transition-all duration-500"
            >
              <span
                className="font-funnel leading-none tracking-[-0.04em] block mb-6"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(2.4rem, 3vw, 3rem)",
                  color: "#FF6600",
                }}
              >
                {p.no}
              </span>
              <h3 className="font-funnel text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                {p.title}
                <span
                  className="block mt-1 text-[0.74em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#6b6b70",
                  }}
                >
                  — {p.italic}.
                </span>
              </h3>
              <p className="mt-4 font-jakarta text-[13.5px] leading-[1.6] text-stone-600">
                {p.detail}
              </p>
              <div className="mt-6 relative h-px bg-stone-900/10 overflow-hidden">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 right-0 bg-[#FF6600] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Map ──────────────────────────────────────────────────── */
function MapSection() {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Find the studio
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3vw,2.5rem)] max-w-[24ch]">
              Coffee&apos;s on if you&apos;d like to{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                drop by.
              </span>
            </h2>
          </div>
          <a
            href="https://g.page/creativemonk?we"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
          >
            <span className="relative">
              Open in Google Maps
              <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
              <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M2 12 L12 2 M5 2 L12 2 L12 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-stone-900/10 bg-stone-50"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.8172!3d30.6432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSushma+Infinium+Zirakpur!5e0!3m2!1sen!2sin"
            width="100%"
            height="100%"
            className="w-full h-[360px] md:h-[440px]"
            style={{ border: 0 }}
            loading="lazy"
            title="Creative Monk — Sushma Infinium, Zirakpur"
            allowFullScreen
          />

          {/* Floating address card */}
          <div className="hidden md:block absolute top-6 left-6 max-w-[320px] rounded-2xl border border-stone-900/10 bg-[#FAF7F2]/95 backdrop-blur-md p-5 shadow-[0_18px_36px_-18px_rgba(15,12,8,0.35)]">
            <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-2 flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Studio · Open now
            </p>
            <p className="font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900 leading-[1.4]">
              Office No. 11-12, 9th Floor
              <br />
              Sushma Infinium · Zirakpur
            </p>
            <p
              className="mt-2 text-[12.5px] text-stone-600"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Punjab — 140603 · India
            </p>
            <div className="mt-4 pt-3 border-t border-stone-900/10 flex items-center justify-between gap-3 text-[10.5px] font-jakarta font-semibold uppercase tracking-[0.2em] text-stone-500">
              <span>30.64°N · 76.82°E</span>
              <span className="text-[#FF6600]">Mon-Sat · 9:30–18:30</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Field helpers ───────────────────────────────────────── */
function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const inputCls =
    "w-full bg-transparent border-b border-stone-900/15 pb-3 pt-1 font-funnel text-[16px] text-stone-900 placeholder:font-jakarta placeholder:text-stone-400 focus:outline-none focus:border-[#FF6600] transition-colors";
  return (
    <label htmlFor={name} className="block">
      <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2 block">
        {label}
        {required && <span className="text-[#FF6600] ml-1">*</span>}
      </span>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          required={required}
          placeholder={placeholder}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </label>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2 block">
        {label}
      </span>
      <div className="relative">
        <select
          id={name}
          name={name}
          defaultValue=""
          className="appearance-none w-full bg-transparent border-b border-stone-900/15 pb-3 pt-1 pr-8 font-funnel text-[16px] text-stone-900 focus:outline-none focus:border-[#FF6600] transition-colors cursor-pointer"
        >
          <option value="" disabled className="text-stone-400">
            Select what you need…
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#FAF7F2] text-stone-900">
              {opt}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          className="absolute right-0 bottom-4 text-stone-500 pointer-events-none"
        >
          <path
            d="M2 5 L7 10 L12 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}
