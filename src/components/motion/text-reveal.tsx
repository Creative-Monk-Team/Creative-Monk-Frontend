"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* Word-by-word reveal — each word slides up from below a clipping mask
   on a staggered timeline. Use as a child of headings. Accepts inline
   ReactNode children for mixed runs (e.g. italic accents). */
export function TextReveal({
  children,
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  startAt = "load",
  className,
  style,
  as: Tag = "span",
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** 'load' = animate on mount; 'inview' = animate when intersecting. */
  startAt?: "load" | "inview";
  className?: string;
  style?: CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-word] > span"));
    if (!words.length) return;

    function reveal() {
      words.forEach((w, i) => {
        w.style.transition = `transform ${duration}s cubic-bezier(.2,.7,.2,1)`;
        w.style.transitionDelay = `${delay + i * stagger}s`;
        w.style.transform = "translateY(0)";
      });
    }

    if (reduced) {
      words.forEach((w) => {
        w.style.transform = "translateY(0)";
      });
      return;
    }

    if (startAt === "load") {
      requestAnimationFrame(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, duration, stagger, startAt, children]);

  return (
    // @ts-expect-error — dynamic element tag
    <Tag ref={ref} className={className} style={style}>
      {splitNode(children)}
    </Tag>
  );
}

/* Recursively walk children, splitting plain strings into word spans
   while preserving inline JSX (anchors, italics, spans). */
function splitNode(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;
  if (typeof node === "string" || typeof node === "number") {
    return splitString(String(node));
  }
  if (Array.isArray(node)) {
    return node.map((n, i) => <span key={i}>{splitNode(n)}</span>);
  }
  return node;
}

function splitString(text: string): ReactNode {
  return text.split(/(\s+)/).map((token, idx) => {
    if (/^\s+$/.test(token)) return <span key={idx}>{token}</span>;
    return (
      <span key={idx} data-word className="word-reveal">
        <span>{token}</span>
      </span>
    );
  });
}
