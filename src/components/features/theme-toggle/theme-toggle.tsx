"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pulse, iconSpin } from "@/lib/animations";
import { useTranslations } from "@/hooks/use-translations";

/**
 * 主题切换组件
 * 用于切换明暗主题模式
 */
export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title={t('theme.toggle')}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            whileHover={pulse.animate}
          >
            <Moon className="h-[1.1rem] w-[1.1rem]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.3 }}
            whileHover={pulse.animate}
          >
            <Sun className="h-[1.1rem] w-[1.1rem]" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}