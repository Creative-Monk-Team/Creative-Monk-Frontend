"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { submitEnquiry } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { DarkThemeFlag } from "@/components/site/dark-theme-flag";

/* ─── Contact page ─────────────────────────────────────────────
   Single-viewport layout: left = compact pitch + contact strip,
   right = the form. Built so the form is visible above the fold on
   laptop AND mobile (form stacks first on small screens) — clients
   don't have to scroll to send a brief. Validated inline; submits
   to /api/contact and lands in Admin → Enquiries. */

const SERVICES = [
  { value: "",                  label: "Pick a service…" },
  { value: "Brand Identity",    label: "Brand Identity" },
  { value: "Web Design & Build",label: "Web Design & Build" },
  { value: "SEO & Content",     label: "SEO & Content" },
  { value: "Performance Marketing", label: "Performance Marketing" },
  { value: "Social Strategy",   label: "Social Strategy" },
  { value: "Motion & Film",     label: "Motion & Film" },
  { value: "Not sure yet",      label: "Not sure yet — advise me" },
];

type Phase = "form" | "submitting" | "done";
type FieldErrors = Partial<Record<"name" | "email" | "phone" | "service" | "message", string>>;

export default function ContactPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>("form");

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!values.name.trim()) e.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Email doesn't look right.";
    if (values.phone && !/^[+\d\s()-]{7,}$/.test(values.phone))
      e.phone = "Numbers and +, -, ( ) only.";
    if (values.message.trim().length < 10)
      e.message = "A sentence or two helps us scope.";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setPhase("submitting");
    try {
      await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        service: values.service || undefined,
        message: values.message.trim(),
        sourcePage: "/contact",
      });
      setPhase("done");
      toast.success("Brief received. Replies inside 4 working hours.");
    } catch (err) {
      setPhase("form");
      toast.error(err instanceof Error ? err.message : "Couldn't send. Try again?");
    }
  }

  function set<K extends keyof typeof values>(key: K, v: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <>
      <DarkThemeFlag />
      <section
        className="relative isolate overflow-hidden flex flex-col"
        style={{
          minHeight: "100vh",
          background: "var(--site-bg, #0A0807)",
          color: "var(--site-fg, #F5F1E8)",
        }}
      >
        {/* Atmosphere */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(255,102,0,0.10), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(255,102,0,0.05), transparent 60%)",
          }}
        />

        {/* Status strip — same family as the home hero */}
        <StatusStrip />

        {/* Stage */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="container w-full py-10 lg:py-12">
            <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-center">
              {/* Left — minimal pitch */}
              <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                <Pitch />
              </div>

              {/* Right — the form (stacks first on mobile) */}
              <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                {phase === "done" ? (
                  <Done />
                ) : (
                  <form
                    onSubmit={onSubmit}
                    className="relative site-glass p-6 md:p-8 lg:p-9"
                    style={{ borderRadius: 20 }}
                    noValidate
                  >
                    <span
                      aria-hidden
                      className="absolute top-0 left-8 right-8"
                      style={{
                        height: 2,
                        background:
                          "linear-gradient(90deg, transparent, var(--site-accent) 50%, transparent)",
                      }}
                    />

                    <div className="flex items-center gap-3 mb-5">
                      <span aria-hidden style={{ display: "block", height: 1, width: 24, background: "var(--site-accent)" }} />
                      <span className="site-eyebrow">Send a brief · 60 seconds</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                      <Field
                        label="Name"
                        type="text"
                        value={values.name}
                        onChange={(v) => set("name", v)}
                        placeholder="Your name"
                        autoComplete="name"
                        error={errors.name}
                      />
                      <Field
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={(v) => set("email", v)}
                        placeholder="founder@brand.com"
                        autoComplete="email"
                        error={errors.email}
                      />
                      <Field
                        label="Phone"
                        type="tel"
                        value={values.phone}
                        onChange={(v) => set("phone", v)}
                        placeholder="Optional"
                        autoComplete="tel"
                        error={errors.phone}
                      />
                      <Select
                        label="What for?"
                        value={values.service}
                        onChange={(v) => set("service", v)}
                        options={SERVICES}
                      />
                    </div>

                    <Textarea
                      label="Tell us what you're building"
                      value={values.message}
                      onChange={(v) => set("message", v)}
                      placeholder="One or two sentences. The brand, the offer, the thing you want fixed first."
                      rows={4}
                      error={errors.message}
                    />

                    <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
                      <p className="site-mono" style={{ fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
                        No sales call · founder reads every inbound
                      </p>
                      <Magnetic strength={0.32}>
                        <button
                          type="submit"
                          disabled={phase === "submitting"}
                          className="group inline-flex items-center gap-2.5 pl-5 pr-2 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            background: "var(--site-accent)",
                            color: "#0A0807",
                            borderRadius: 999,
                            fontWeight: 600,
                            boxShadow:
                              "0 0 0 1px rgba(255,102,0,0.6), 0 0 24px -6px rgba(255,102,0,0.55)",
                          }}
                        >
                          <span style={{ fontFamily: "var(--font-funnel-display)", fontSize: 14, letterSpacing: "-0.005em" }}>
                            {phase === "submitting" ? "Sending…" : "Send the brief"}
                          </span>
                          <span
                            aria-hidden
                            className="inline-grid place-items-center"
                            style={{
                              width: 32, height: 32, borderRadius: "50%",
                              background: "#0A0807", color: "var(--site-accent)",
                            }}
                          >
                            {phase === "submitting" ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </Magnetic>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Left rail — pitch, contact strip, three quick stats ─── */
function Pitch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span aria-hidden style={{ display: "block", height: 1, width: 28, background: "var(--site-accent)" }} />
        <span className="site-eyebrow">Start a project</span>
      </div>

      <h1
        className="site-display"
        style={{
          fontSize: "clamp(2rem, 4.4vw, 3.75rem)",
          letterSpacing: "-0.028em",
          lineHeight: 1,
          color: "var(--site-fg)",
        }}
      >
        Tell us what{" "}
        <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontStyle: "italic", color: "var(--site-accent)" }}>
          you&apos;re building.
        </span>
      </h1>

      <p
        className="mt-5 max-w-[44ch]"
        style={{ fontSize: "clamp(14.5px, 1.1vw, 16px)", lineHeight: 1.6, color: "var(--site-fg-mute)" }}
      >
        A founder reads every brief personally and replies inside four
        working hours with a quick read on what to fix first.
      </p>

      {/* Channel strip — three rows, tight */}
      <div className="mt-8 space-y-3">
        <ContactRow
          icon={<Phone className="h-3.5 w-3.5" />}
          label="WhatsApp"
          value="+91 94634 45566"
          href="https://wa.me/919463445566"
          monoValue
        />
        <ContactRow
          icon={<Mail className="h-3.5 w-3.5" />}
          label="Email"
          value="hello@thecreativemonk.in"
          href="mailto:hello@thecreativemonk.in"
          monoValue
        />
        <ContactRow
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Studio"
          value="Mohali · Mon–Sat · 09:30–18:30"
        />
      </div>

      {/* Three quick proof points */}
      <div
        className="mt-8 grid grid-cols-3 gap-px"
        style={{ background: "var(--site-line)", borderTop: "1px solid var(--site-line)", borderBottom: "1px solid var(--site-line)" }}
      >
        {[
          { value: "<4hr",  label: "Avg reply" },
          { value: "4.9★", label: "From 87 reviews" },
          { value: "142+",  label: "Brands shipped" },
        ].map((s) => (
          <div key={s.label} className="py-3" style={{ background: "var(--site-bg)" }}>
            <p
              className="site-display admin-tnum"
              style={{ fontSize: "clamp(16px, 1.4vw, 19px)", letterSpacing: "-0.018em", color: "var(--site-accent)" }}
            >
              {s.value}
            </p>
            <p className="site-eyebrow mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  monoValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  monoValue?: boolean;
}) {
  const Wrap = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <a
        href={href}
        data-cursor="link"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group flex items-center gap-3 transition-colors"
        style={{ color: "var(--site-fg)" }}
      >
        {children}
      </a>
    ) : (
      <div className="flex items-center gap-3" style={{ color: "var(--site-fg)" }}>{children}</div>
    );

  return (
    <Wrap>
      <span
        className="grid place-items-center"
        style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "1px solid var(--site-line)",
          color: "var(--site-fg-mute)",
        }}
      >
        {icon}
      </span>
      <span className="site-eyebrow w-20 shrink-0">{label}</span>
      <span
        className={monoValue ? "site-mono" : ""}
        style={{
          fontSize: monoValue ? 13 : 13.5,
          color: "var(--site-fg)",
          letterSpacing: monoValue ? "0.04em" : undefined,
        }}
      >
        {value}
      </span>
    </Wrap>
  );
}

/* ─── Field primitives ─────────────────────────────────────── */
function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  type: "text" | "email" | "tel";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} error={error} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className="w-full h-11 px-3.5 text-[14px] mt-1.5"
        style={{
          background: "var(--site-bg)",
          border: `1px solid ${error ? "rgba(229,72,77,0.55)" : "var(--site-line-strong)"}`,
          borderRadius: 10,
          color: "var(--site-fg)",
          outline: "none",
          transition: "border-color 160ms ease",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--site-accent)";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--site-line-strong)";
        }}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 text-[14px] mt-1.5"
        style={{
          background: "var(--site-bg)",
          border: "1px solid var(--site-line-strong)",
          borderRadius: 10,
          color: value ? "var(--site-fg)" : "var(--site-fg-dim)",
          outline: "none",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%23A1A1A1' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' d='M1 1l5 5 5-5'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 32,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "var(--site-bg-soft)", color: "var(--site-fg)" }}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <label className="block mt-4">
      <FieldLabel label={label} error={error} hint={`${value.trim().length}/600`} />
      <textarea
        rows={rows ?? 4}
        maxLength={600}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="w-full px-3.5 py-3 text-[14px] mt-1.5 resize-y"
        style={{
          background: "var(--site-bg)",
          border: `1px solid ${error ? "rgba(229,72,77,0.55)" : "var(--site-line-strong)"}`,
          borderRadius: 10,
          color: "var(--site-fg)",
          outline: "none",
          lineHeight: 1.55,
          minHeight: 100,
          transition: "border-color 160ms ease",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--site-accent)";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--site-line-strong)";
        }}
      />
    </label>
  );
}

function FieldLabel({ label, error, hint }: { label: string; error?: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="block"
        style={{
          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: error ? "#E5484D" : "var(--site-fg-mute)",
        }}
      >
        {error ? `${label} · ${error}` : label}
      </span>
      {hint ? (
        <span
          className="site-mono"
          style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--site-fg-dim)" }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/* ─── Status strip + Done ─────────────────────────────────── */
function StatusStrip() {
  return (
    <div
      className="relative z-10 shrink-0"
      style={{ borderBottom: "1px solid var(--site-line)", background: "rgba(10,8,7,0.65)", backdropFilter: "blur(10px)" }}
    >
      <div className="container flex items-center justify-between gap-6 py-3.5 site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#30A46C",
              boxShadow: "0 0 10px rgba(48,164,108,0.7)",
            }}
          />
          Studio open · Q3 booking
        </span>
        <span className="hidden md:inline" style={{ color: "var(--site-fg-dim)" }}>
          Mohali · serving worldwide
        </span>
        <Link
          href="/"
          data-cursor="link"
          className="site-mono"
          style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--site-fg-mute)" }}
        >
          ← Back to studio
        </Link>
      </div>
    </div>
  );
}

function Done() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative site-glass p-9 md:p-12 text-center"
      style={{ borderRadius: 20 }}
    >
      <span
        aria-hidden
        className="absolute top-0 left-8 right-8"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--site-accent) 50%, transparent)",
        }}
      />
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="inline-grid place-items-center mb-5"
        style={{
          width: 56, height: 56,
          borderRadius: "50%",
          background: "rgba(48,164,108,0.12)",
          border: "1px solid rgba(48,164,108,0.4)",
          color: "#30A46C",
          boxShadow: "0 0 32px rgba(48,164,108,0.35)",
        }}
      >
        <CheckCircle2 className="h-7 w-7" />
      </motion.span>
      <h2
        className="site-display"
        style={{ fontSize: "clamp(1.4rem, 2.6vw, 2rem)", letterSpacing: "-0.022em", color: "var(--site-fg)" }}
      >
        Brief received.{" "}
        <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontStyle: "italic", color: "var(--site-accent)" }}>
          Reply on its way.
        </span>
      </h2>
      <p
        className="mt-3 mx-auto"
        style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--site-fg-mute)", maxWidth: 460 }}
      >
        A founder reads every inbound personally and writes back inside four
        working hours with a quick teardown of what to fix first.
      </p>
      <Link
        href="/"
        data-cursor="link"
        className="inline-flex items-center gap-2 mt-7 site-mono"
        style={{
          fontSize: 11.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--site-accent)",
          padding: "10px 18px",
          border: "1px solid rgba(255,102,0,0.4)",
          borderRadius: 999,
        }}
      >
        Return to studio
        <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}
