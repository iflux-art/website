"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/use-translations";
import { NAV_ITEMS } from "@/lib/constants";
import { slideUp, hoverScale } from "@/lib/animations";

interface NavItemsProps {
  lang: string;
}

/**
 * 导航项组件
 * 负责渲染导航链接列表
 */
export function NavItems({ lang }: NavItemsProps) {
  const t = useTranslations();
  
  return (
    <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
      {NAV_ITEMS.map((item) => (
        <motion.li 
          key={item.key}
          variants={slideUp}
          whileHover={hoverScale}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href={`/${lang}/${item.key}`} 
            className="hover:text-primary transition-colors relative group"
          >
            {t(item.labelKey)}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}