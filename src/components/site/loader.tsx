"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Brand-reveal loader. Shows on first paint, animates out after a
   short window. Persists a sessionStorage flag so it doesn't replay
   on every client-side route change. */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("cm-loader-seen");
    if (seen) {
      setVisible(false);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 250 : 1400;
    const start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("cm-loader-seen", "true");
        // Small delay before unmount so the 100% snaps cleanly
        setTimeout(() => setVisible(false), reduced ? 100 : 320);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } }}
          className="fixed inset-0 z-[100] grid place-items-center"
          style={{ background: "var(--site-bg, #0A0807)" }}
        >
          {/* Animated rings */}
          <motion.span
            aria-hidden
            initial={{ scale: 0, opacity: 0.0 }}
            animate={{ scale: [0, 1.4], opacity: [0.0, 0.18, 0] }}
            transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
            className="absolute"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "1px solid rgba(255,102,0,0.6)",
            }}
          />
          <motion.span
            aria-hidden
            initial={{ scale: 0, opacity: 0.0 }}
            animate={{ scale: [0, 1.8], opacity: [0.0, 0.10, 0] }}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, delay: 0.4 }}
            className="absolute"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "1px solid rgba(255,102,0,0.4)",
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Wordmark */}
            <motion.p
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              className="site-eyebrow"
              style={{ color: "rgba(245,241,232,0.55)" }}
            >
              The Creative Monk · Studio
            </motion.p>
            <motion.h1
              initial={{ y: 18, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
              className="site-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                color: "var(--site-fg, #F5F1E8)",
                textAlign: "center",
              }}
            >
              creative
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--site-accent, #FF6600)",
                  marginLeft: "0.25em",
                }}
              >
                monk
              </span>
            </motion.h1>

            {/* Progress bar */}
            <div
              className="relative overflow-hidden"
              style={{
                width: 240,
                height: 2,
                background: "rgba(245,241,232,0.08)",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: `${progress * 100}%`,
                  background:
                    "linear-gradient(90deg, var(--site-accent, #FF6600), var(--site-accent-hot, #FF8A33))",
                  boxShadow: "0 0 12px rgba(255,102,0,0.6)",
                  transition: "width 80ms linear",
                }}
              />
            </div>

            <p className="site-mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "rgba(245,241,232,0.32)" }}>
              EST · MMXVIII · {Math.round(progress * 100).toString().padStart(3, "0")}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
