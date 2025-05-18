"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { slideUp, hoverScale } from "@/lib/animations";
import { NAV_ITEMS } from "@/lib/constants";

/**
 * 导航项组件
 * 负责渲染导航链接列表
 */
export function NavItems() {
  
  return (
    <ul className="flex lg:items-center lg:flex-row flex-col items-start gap-6 text-sm font-medium text-muted-foreground">
      {NAV_ITEMS.map((item) => (
        <motion.li 
          key={item.key}
          variants={slideUp}
          whileHover={hoverScale}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href={`/${item.key}`} 
            className="hover:text-primary transition-colors relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );

}