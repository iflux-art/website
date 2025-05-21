"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionProps {
  children: React.ReactNode;
  mode?: "wait" | "sync";
  initial?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 页面过渡组件
 * 
 * 使用 framer-motion 实现平滑的页面过渡效果
 */
export function Transition({
  children,
  mode = "wait",
  initial = false,
  className = "",
  style = {},
}: TransitionProps) {
  const [key, setKey] = useState(0);
  const prevPathname = useRef<string | null>(null);
  
  // 当路径变化时更新 key，触发动画
  useEffect(() => {
    const pathname = window.location.pathname;
    if (prevPathname.current !== pathname) {
      setKey(prev => prev + 1);
      prevPathname.current = pathname;
    }
  }, [children]);

  return (
    <AnimatePresence mode={mode} initial={initial}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
