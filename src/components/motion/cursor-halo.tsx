"use client";

import { useEffect, useRef, useState } from "react";

/* Custom cursor — a tight inner dot plus a larger outer halo that
   lags slightly for an "anchor + drift" feel. The halo grows + tints
   orange when hovering elements that mark themselves with
   data-cursor="link" or any anchor/button.
   Hidden on touch devices automatically. */
export function CursorHalo() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    if (isTouch) return;

    setEnabled(true);
    document.documentElement.setAttribute("data-cursor-active", "true");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let raf = 0;

    function update(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    }

    function tick() {
      // Lerp halo toward cursor — gives the soft trail
      hx += (mx - hx) * 0.18;
      hy += (my - hy) * 0.18;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    function onEnter(e: Event) {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const interactive =
        target.closest("a, button, [data-cursor='link'], [role='button'], input, textarea, select, label");
      if (interactive) {
        haloRef.current?.setAttribute("data-state", "link");
      }
    }
    function onLeave(e: Event) {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const interactive = target.closest(
        "a, button, [data-cursor='link'], [role='button'], input, textarea, select, label",
      );
      if (interactive) {
        haloRef.current?.setAttribute("data-state", "idle");
      }
    }

    function onMouseDown() {
      haloRef.current?.setAttribute("data-pressed", "true");
    }
    function onMouseUp() {
      haloRef.current?.setAttribute("data-pressed", "false");
    }

    window.addEventListener("mousemove", update);
    window.addEventListener("mouseover", onEnter, true);
    window.addEventListener("mouseout", onLeave, true);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", update);
      window.removeEventListener("mouseover", onEnter, true);
      window.removeEventListener("mouseout", onLeave, true);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden
        data-state="idle"
        data-pressed="false"
        className="cursor-halo"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: "50%",
          border: "1px solid rgba(245,241,232,0.45)",
          background: "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          mixBlendMode: "difference",
          transition: "width 220ms cubic-bezier(.2,.7,.2,1), height 220ms cubic-bezier(.2,.7,.2,1), border-color 220ms ease, background-color 220ms ease",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "#FF6600",
          pointerEvents: "none",
          zIndex: 99999,
          boxShadow: "0 0 12px rgba(255,102,0,0.7)",
        }}
      />
      <style jsx global>{`
        .cursor-halo[data-state="link"] {
          width: 60px !important;
          height: 60px !important;
          margin-left: -30px !important;
          margin-top: -30px !important;
          background-color: rgba(255, 102, 0, 0.12) !important;
          border-color: rgba(255, 102, 0, 0.7) !important;
        }
        .cursor-halo[data-pressed="true"] {
          width: 24px !important;
          height: 24px !important;
          margin-left: -12px !important;
          margin-top: -12px !important;
        }
      `}</style>
    </>
  );
}
