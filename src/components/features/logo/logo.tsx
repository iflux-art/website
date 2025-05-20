"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { logoAnimation } from "@/lib/animations";

export function Logo() {
  // 处理点击事件，使用硬刷新导航到首页
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 阻止默认链接行为

    // 使用 window.location.href 进行硬刷新
    // 这将完全重新加载页面，确保所有内容都会重新获取
    window.location.href = '/';
  };

  return (
    <Link href="/" className="inline-block" onClick={handleClick}>
      <motion.h2
        className="text-sm sm:text-md md:text-lg font-bold font-code hover:text-primary transition-colors"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={logoAnimation}
      >
        iFluxArt
      </motion.h2>
    </Link>
  );
}
