"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

interface ScrollIndicatorProps {
  sections: Section[];
}

/**
 * 滚动指示器组件
 * 显示当前滚动位置，并允许点击跳转到指定部分
 */
export function ScrollIndicator({ sections }: ScrollIndicatorProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  // 监听滚动事件，更新当前活动部分
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // 找到当前滚动位置对应的部分
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  // 滚动到指定部分
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col items-center">
      <div className="bg-background/80 backdrop-blur-sm rounded-full py-3 px-1 border border-border/40 shadow-sm">
        <div className="space-y-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="relative w-4 h-4 rounded-full block"
              aria-label={`滚动到${section.label}`}
              title={section.label}
            >
              <span className={`absolute inset-0 rounded-full ${
                activeSection === section.id
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              } transition-colors`}></span>

              {activeSection === section.id && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary/30"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
