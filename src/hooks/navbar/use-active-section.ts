"use client";

import { useEffect, useState } from "react";

/**
 * 监听页面滚动并激活当前 section 的 hook
 */
export function useActiveSection(sectionIds: string[], offset = 80) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    function onScroll() {
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top - offset < 1) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
