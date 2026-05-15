"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { submitEnquiry } from "@/lib/api";
import { toast } from "sonner";

const CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp the studio",
    value: "+91 94634 45566",
    helper: "Fastest path — replies inside 4 working hours",
    href: "https://wa.me/919463445566",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 22h-.1c-1.8 0-3.5-.5-5-1.4l-3.7 1 1-3.6c-1-1.6-1.5-3.4-1.5-5.3 0-5.4 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9s2.9 4.3 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email the founder",
    value: "hello@thecreativemonk.in",
    helper: "Read personally by Abhishek",
    href: "mailto:hello@thecreativemonk.in",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
          stroke="currentColor"
          strokeWidth="1.8"
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

export function ContactForm({ className = "" }: { className?: string }) {
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
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
      });
      toast.success("Got it. Abhishek will reply within 4 working hours.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Couldn't send right now — email us at hello@thecreativemonk.in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className={`relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden ${className}`}
      aria-label="Contact the studio"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Start a project
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[18ch]">
              Tell us what you&apos;re{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                building.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4 md:justify-self-end"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-stone-900/10 bg-stone-50 px-5 py-3.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 hero-pulse" />
              <div className="leading-tight">
                <p className="font-funnel text-[14.5px] font-bold tracking-tight text-stone-900">
                  Open for Q3
                </p>
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-500 mt-0.5">
                  3 slots left · Avg reply &lt;4hr
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main grid — channels left, form right */}
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          {/* Channels */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-5 md:gap-6"
          >
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-8">
              <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-5">
                Three ways in
              </p>
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
                      <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-[#FF6600] text-stone-900">
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

            {/* Studio location card */}
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
                  Studio · open now
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
                  Zirakpur · Mohali · Punjab — 140603
                </p>
                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-3">
                  <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                    Mon–Sat · 09:30–18:30 IST
                  </span>
                  <a
                    href="https://g.page/creativemonk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-50 hover:text-[#FF6600] transition-colors cursor-pointer"
                  >
                    View on map
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
          </motion.aside>

          {/* Form */}
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
                  "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(255,102,0,0.06), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 mb-7">
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Send us a brief
                </p>
                <span className="inline-flex items-center gap-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#FF6600]">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                    <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
                  </svg>
                  5 fields · 60 seconds
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
                  name="message"
                  label="Tell us about the project"
                  required
                  textarea
                  placeholder="What are you building? What stage are you at? What's getting in the way?"
                />
              </div>

              <div className="mt-9 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <p className="font-jakarta text-[12.5px] text-stone-500 leading-[1.55] max-w-[42ch]">
                  We read every brief personally. Expect a real reply — not a
                  templated "thanks for reaching out" — inside 4 working hours.
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

/* ─── Field components ─── */
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
