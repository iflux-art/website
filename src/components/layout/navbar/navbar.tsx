"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/features/logo";
import { MobileMenu } from "./mobile-menu";
import { NavItems } from "./nav-items";
import { slideDown, fadeIn } from "@/lib/animations";

/**
 * 主导航栏组件
 * 负责整体导航布局和响应式处理
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // 移除语言相关逻辑

  return (
    <motion.nav 
      initial="initial"
      animate="animate"
      variants={slideDown}
      className="w-full h-16 sticky top-0 z-50 backdrop-blur-md bg-background/80 shadow-sm border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300"
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
        {/* 左侧部分 - Logo */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Logo />
        </motion.div>

        {/* 居中部分 - 桌面导航 */}
        <motion.div 
          className="hidden lg:flex items-center justify-center"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <NavItems />
        </motion.div>

        {/* 右侧部分 - 功能按钮和移动菜单 */}
        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </motion.nav>
  );
}