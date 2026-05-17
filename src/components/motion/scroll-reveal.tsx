"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* Generic in-view reveal. Use for cards, paragraphs, stat tiles — any
   block that should "float up" as it enters the viewport. */
const baseVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.2, 0.7, 0.2, 1] },
  },
};

export function ScrollReveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "h2" | "h3" | "p" | "span";
}) {
  const Comp = motion[as as "div"] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={baseVariants}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/* Staggered children — wrap a list and each direct child gets a
   subtle delayed entrance. */
export function ScrollStagger({
  children,
  delayChildren = 0.08,
  staggerChildren = 0.08,
  className,
}: {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const itemReveal: Variants = baseVariants;
