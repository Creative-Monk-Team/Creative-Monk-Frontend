"use client";

import type { ReactNode } from "react";

/* Pure-CSS marquee. Renders the children twice for seamless looping,
   driven by the `.site-marquee` keyframes in globals.css.
   - duration controls speed; bigger = slower
   - direction "reverse" runs right-to-left visually */
export function MarqueeStrip({
  children,
  duration = 50,
  direction = "forward",
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  duration?: number;
  direction?: "forward" | "reverse";
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden",
        pauseOnHover ? "site-marquee-pause" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="site-marquee"
        data-direction={direction}
        style={{ ["--marquee-dur" as never]: `${duration}s` }}
      >
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
