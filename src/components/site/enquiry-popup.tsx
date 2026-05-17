"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { submitEnquiry } from "@/lib/api";

/* ─── EnquiryPopup ──────────────────────────────────────────────
   A site-wide capture modal. Triggers on whichever happens first:
   - 25 seconds after first paint
   - Mouse-leaves-viewport (desktop exit-intent)
   - Manual prop / event (future use)

   Dismissal is sticky for the session — closing once means it stays
   closed until the next browser session. Skip on admin + contact
   routes (don't double up).

   Submits to /api/contact via the existing submitEnquiry() helper.
   Records sourcePage so the inbox can attribute the lead. */

const DISMISS_KEY = "cm-enquiry-popup-dismissed";
const TIMED_OPEN_MS = 25_000;
const SKIP_ROUTES = ["/admin", "/contact"];

type Phase = "form" | "submitting" | "done";

export function EnquiryPopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Honour the dismissal flag on mount
  useEffect(() => {
    if (!mounted) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") {
        dismissedRef.current = true;
      }
    } catch {
      /* sessionStorage blocked — fall through */
    }
  }, [mounted]);

  // Skip on protected/duplicate routes
  const skip = SKIP_ROUTES.some((r) => pathname?.startsWith(r));

  // Timed + exit-intent triggers
  useEffect(() => {
    if (!mounted || skip) return;

    const timer = setTimeout(() => {
      if (!dismissedRef.current) setOpen(true);
    }, TIMED_OPEN_MS);

    function onLeave(e: MouseEvent) {
      // Mouse leaving via the top edge = exit intent (heuristic)
      if (e.clientY <= 0 && !dismissedRef.current) {
        setOpen(true);
      }
    }
    document.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted, skip]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Listen for ESC + a custom "cm:open-enquiry" event so future code
  // can trigger the popup imperatively (e.g., from a nav button)
  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) close();
    }
    function onOpen() {
      dismissedRef.current = false;
      try {
        sessionStorage.removeItem(DISMISS_KEY);
      } catch {}
      setOpen(true);
      setPhase("form");
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("cm:open-enquiry", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cm:open-enquiry", onOpen as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open]);

  function close() {
    setOpen(false);
    dismissedRef.current = true;
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.name.trim()) return setError("Tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      return setError("That email doesn't look quite right.");
    if (values.message.trim().length < 10)
      return setError("A sentence or two helps us scope it correctly.");

    setPhase("submitting");
    try {
      await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        message: values.message.trim(),
        sourcePage: typeof window !== "undefined" ? `popup · ${window.location.pathname}` : "popup",
      });
      setPhase("done");
      toast.success("Brief received. We'll be in touch inside 4 working hours.");
      try {
        sessionStorage.setItem(DISMISS_KEY, "true");
      } catch {}
      dismissedRef.current = true;
    } catch (err) {
      setPhase("form");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!mounted || skip) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] grid place-items-center px-4 py-6"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quick enquiry"
            className="relative w-full max-w-[560px] overflow-hidden"
            style={{
              background: "var(--site-bg-soft, #14110E)",
              border: "1px solid rgba(245,241,232,0.10)",
              borderRadius: 18,
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,102,0,0.18)",
              color: "var(--site-fg, #F5F1E8)",
            }}
          >
            {/* Top accent strip */}
            <span
              aria-hidden
              className="absolute top-0 left-0 right-0"
              style={{
                height: 2,
                background: "linear-gradient(90deg, transparent, var(--site-accent, #FF6600) 50%, transparent)",
              }}
            />

            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 grid place-items-center transition-colors"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                color: "rgba(245,241,232,0.62)",
                background: "rgba(245,241,232,0.05)",
                border: "1px solid rgba(245,241,232,0.10)",
              }}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-7 sm:p-9">
              {phase !== "done" ? (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
                      fontSize: 10.5,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(245,241,232,0.62)",
                    }}
                  >
                    ⌘ A 60-second brief
                  </p>
                  <h2
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-funnel-display), system-ui, sans-serif",
                      fontWeight: 600,
                      letterSpacing: "-0.025em",
                      lineHeight: 1.05,
                      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                      color: "var(--site-fg, #F5F1E8)",
                    }}
                  >
                    Tell us what you&apos;re building.{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-newsreader), Georgia, serif",
                        fontStyle: "italic",
                        color: "var(--site-accent, #FF6600)",
                      }}
                    >
                      We&apos;ll reply in 4 hours.
                    </span>
                  </h2>
                  <p
                    className="mt-3"
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: "rgba(245,241,232,0.62)",
                    }}
                  >
                    No sales call. The founder reads every inbound personally
                    and replies with a teardown of what to fix first.
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <Row>
                      <Field
                        label="Name"
                        type="text"
                        value={values.name}
                        onChange={(v) => setValues((p) => ({ ...p, name: v }))}
                        autoComplete="name"
                        placeholder="What should we call you?"
                      />
                      <Field
                        label="Phone"
                        type="tel"
                        value={values.phone}
                        onChange={(v) => setValues((p) => ({ ...p, phone: v }))}
                        autoComplete="tel"
                        placeholder="Optional"
                      />
                    </Row>
                    <Field
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={(v) => setValues((p) => ({ ...p, email: v }))}
                      autoComplete="email"
                      placeholder="founder@yourbrand.com"
                    />
                    <FieldTextarea
                      label="What are you building, and what's stuck?"
                      value={values.message}
                      onChange={(v) => setValues((p) => ({ ...p, message: v }))}
                      placeholder="A sentence or two on the brand, the offer, and what you want fixed first."
                      rows={4}
                    />

                    {error ? (
                      <p
                        style={{
                          fontSize: 12.5,
                          color: "#E5484D",
                          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ERR · {error}
                      </p>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between gap-4 flex-wrap">
                      <p
                        style={{
                          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
                          fontSize: 10.5,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(245,241,232,0.36)",
                        }}
                      >
                        No spam · Goes straight to the founder
                      </p>
                      <button
                        type="submit"
                        disabled={phase === "submitting"}
                        className="group inline-flex items-center gap-2.5 pl-5 pr-2 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--site-accent, #FF6600)",
                          color: "#0A0807",
                          borderRadius: 999,
                          fontWeight: 600,
                          boxShadow:
                            "0 0 0 1px rgba(255,102,0,0.6), 0 0 24px -6px rgba(255,102,0,0.55)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-funnel-display)",
                            fontSize: 13.5,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {phase === "submitting" ? "Sending…" : "Send the brief"}
                        </span>
                        <span
                          aria-hidden
                          className="inline-grid place-items-center"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "#0A0807",
                            color: "var(--site-accent, #FF6600)",
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
                    </div>
                  </form>
                </>
              ) : (
                <Done onClose={close} />
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: "text" | "email" | "tel";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span
        className="block mb-1.5"
        style={{
          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(245,241,232,0.62)",
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full h-11 px-3.5 text-[14px]"
        style={{
          background: "#0A0807",
          border: "1px solid rgba(245,241,232,0.12)",
          borderRadius: 8,
          color: "var(--site-fg, #F5F1E8)",
          outline: "none",
          transition: "border-color 160ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--site-accent, #FF6600)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(245,241,232,0.12)";
        }}
      />
    </label>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span
        className="block mb-1.5"
        style={{
          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(245,241,232,0.62)",
        }}
      >
        {label}
      </span>
      <textarea
        rows={rows ?? 4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-[14px] resize-y"
        style={{
          background: "#0A0807",
          border: "1px solid rgba(245,241,232,0.12)",
          borderRadius: 8,
          color: "var(--site-fg, #F5F1E8)",
          outline: "none",
          lineHeight: 1.55,
          minHeight: 110,
          transition: "border-color 160ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--site-accent, #FF6600)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(245,241,232,0.12)";
        }}
      />
    </label>
  );
}

function Done({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="inline-grid place-items-center mb-5"
        style={{
          width: 56,
          height: 56,
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
        style={{
          fontFamily: "var(--font-funnel-display)",
          fontWeight: 600,
          fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--site-fg, #F5F1E8)",
        }}
      >
        Brief received.{" "}
        <span
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            color: "var(--site-accent, #FF6600)",
          }}
        >
          Reply on its way.
        </span>
      </h2>
      <p
        className="mt-3"
        style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(245,241,232,0.62)", maxWidth: 380, margin: "0 auto" }}
      >
        Inside 4 working hours, the founder will write back with a quick read
        on what to fix first. Keep an eye on your inbox.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-7 inline-flex items-center gap-2 px-4 py-2"
        style={{
          fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(245,241,232,0.62)",
          border: "1px solid rgba(245,241,232,0.12)",
          borderRadius: 999,
        }}
      >
        Close
      </button>
    </div>
  );
}
