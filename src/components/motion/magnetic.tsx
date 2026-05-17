"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";

/* Magnetic wrapper — pulls its child toward the cursor when within a
   given radius, with springy ease. Used on primary CTAs to give them
   that "the page is alive" feel.

   The child must accept refs; we apply transform on hover so callers
   should avoid setting transform conflicts. */
export function Magnetic({
  children,
  strength = 0.32,
  radius = 120,
  className,
  style,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.hypot(dx, dy);
    if (distance > radius) {
      content.style.transform = "translate(0, 0)";
      return;
    }
    const factor = 1 - distance / radius;
    content.style.transform = `translate(${dx * strength * factor}px, ${dy * strength * factor}px)`;
  }

  function onLeave() {
    if (contentRef.current) {
      contentRef.current.style.transform = "translate(0, 0)";
    }
  }

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ display: "inline-flex", ...style }}
    >
      <span
        ref={contentRef}
        style={{
          display: "inline-flex",
          transition: "transform 320ms cubic-bezier(.2,.7,.2,1)",
          willChange: "transform",
        }}
      >
        {children}
      </span>
    </span>
  );
}
