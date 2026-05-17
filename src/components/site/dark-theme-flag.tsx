"use client";

import { useEffect } from "react";

/* Toggles `data-theme="dark"` on <html> while this component is
   mounted. Used on the homepage so the public dark-tokens activate
   without affecting other pages. */
export function DarkThemeFlag() {
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, []);
  return null;
}
