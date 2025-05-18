"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition } from "@/lib/animations";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * 页面过渡组件
 * 为整个应用提供平滑的页面切换动画
 * 使用方法：在根布局文件中包裹内容
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}