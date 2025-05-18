"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pageTitle, setPageTitle] = useState("");
  const pathname = usePathname();

  // 检测滚动方向和位置
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // 滚动阈值，超过此值显示标题
      
      // 判断滚动方向
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      
      // 更新最后滚动位置
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 获取页面标题和监听标题变化
  useEffect(() => {
    // 仅在博客和文档页面显示标题
    if (pathname.startsWith("/blog/") || pathname.startsWith("/docs/")) {
      // 延迟获取标题，确保页面已渲染
      const getTitle = () => {
        const h1Element = document.querySelector("h1");
        if (h1Element) {
          setPageTitle(h1Element.textContent || "");
        }
      };
      
      // 初始获取标题
      setTimeout(getTitle, 100);
      
      // 监听DOM变化，以便在动态加载内容后更新标题
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const h1Element = document.querySelector("h1");
          if (h1Element && h1Element.textContent !== pageTitle) {
            setPageTitle(h1Element.textContent || "");
          }
        });
      });
      
      // 监听滚动时的当前标题变化（由目录组件设置）
      const handleCurrentHeadingChange = () => {
        const currentHeading = document.documentElement.getAttribute('data-current-heading');
        if (currentHeading && currentHeading !== pageTitle) {
          setPageTitle(currentHeading);
        }
      };
      
      // 添加滚动事件监听器，检查当前标题变化
      window.addEventListener('scroll', handleCurrentHeadingChange, { passive: true });
      
      // 开始观察文档变化
      observer.observe(document.body, { childList: true, subtree: true });
      
      // 清理观察器和事件监听器
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleCurrentHeadingChange);
      };
    } else {
      setPageTitle("");
    }
  }, [pathname, pageTitle]);

  // 判断是否显示标题 - 在向下滚动且滚动超过阈值时显示标题，向上滚动时显示导航
  const showTitle = scrollDirection === "down" && lastScrollY > 100 && pageTitle && (pathname.startsWith("/blog/") || pathname.startsWith("/docs/"));

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

        {/* 居中部分 - 桌面导航或页面标题 */}
        <motion.div 
          className="hidden lg:flex items-center justify-center overflow-hidden"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {showTitle ? (
            <motion.h2 
              className="text-lg font-semibold truncate max-w-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {pageTitle}
            </motion.h2>
          ) : (
            <NavItems />
          )}
        </motion.div>

        {/* 右侧部分 - 功能按钮和移动菜单 */}
        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </motion.nav>
  );
}