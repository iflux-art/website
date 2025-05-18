"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Languages, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { pulse } from "@/lib/animations";
import { useTranslations } from "@/hooks/use-translations";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

/**
 * 语言切换组件，用于切换中英文语言
 */
export function LanguageToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
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
      title={t(`language.${language}`)}
      onClick={() => {
        // 获取下一个语言
        const currentIndex = SUPPORTED_LANGUAGES.findIndex(lang => lang.code === language);
        const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
        const newLang = SUPPORTED_LANGUAGES[nextIndex].code;
        
        setLanguage(newLang as "zh" | "en");
        
        // 更新URL路径，保持在当前页面但切换语言
        const segments = pathname.split("/");
        if (segments.length > 1) {
          segments[1] = newLang;
          router.push(segments.join("/"));
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={pulse.animate}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        key={language} // 添加key以触发动画重新渲染
      >
        {language === "zh" ? (
          <Globe className="h-[1.1rem] w-[1.1rem]" />
        ) : (
          <Languages className="h-[1.1rem] w-[1.1rem]" />
        )}
      </motion.div>
      <span className="sr-only">{language === "zh" ? '切换到英文' : 'Switch to Chinese'}</span>
    </Button>
  );
}