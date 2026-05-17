"use client";

import { useEffect, useRef } from "react";

/* Atmospheric mesh — a fixed-position canvas-free CSS backdrop with
   two slow-drifting radial blobs and an optional dot grid. Pass
   `subtle` for non-hero sections. Respects reduced-motion. */
export function MeshBackdrop({
  subtle = false,
  showGrid = true,
  className,
}: {
  subtle?: boolean;
  showGrid?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Already handled in globals.css @media query — nothing to do
      return;
    }
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={["absolute inset-0 overflow-hidden pointer-events-none", className]
        .filter(Boolean)
        .join(" ")}
      style={{ opacity: subtle ? 0.55 : 1 }}
    >
      <div className="site-mesh" />
      {showGrid ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,241,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.03) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            backgroundPosition: "-1px -1px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 35%, #000 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 35%, #000 40%, transparent 75%)",
          }}
        />
      ) : null}
    </div>
  );
}
