"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * 页面过渡包装组件
 * 
 * 为页面切换提供平滑的过渡动画效果
 * 使用 AnimatePresence 和 motion 组件实现
 * 
 * @param {PageTransitionWrapperProps} props - 组件属性
 * @returns {JSX.Element} 页面过渡包装组件
 */
export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // 在组件挂载后标记为非首次渲染
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstRender ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
