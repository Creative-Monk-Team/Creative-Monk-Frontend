"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Lenis-backed site-wide smooth scroll. Mount once at the root of any
   page that wants the magical lerp-easing. Tied to RAF; respects
   prefers-reduced-motion by short-circuiting init. */
export function SmoothScrollProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Smooth cubic-bezier-ish easing — pleasant inertia without feeling sluggish
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
