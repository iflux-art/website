"use client";

import React, { useEffect, useRef, useState, Children, cloneElement, ReactElement } from "react";
import { cn } from "@/lib/utils";

interface FullscreenScrollProps {
  children: React.ReactNode;
  className?: string;
  navbarHeight?: number; // 导航栏高度
  footerHeight?: number; // 底栏高度（如果有）
  showIndicators?: boolean; // 是否显示指示器
  indicatorPosition?: "left" | "right" | "center"; // 指示器位置
}

/**
 * 全屏滚动容器组件
 * 提供全屏分页滚动功能，支持键盘和鼠标滚轮导航
 */
export function FullscreenScroll({
  children,
  className,
  navbarHeight = 64, // 默认导航栏高度4rem
  footerHeight = 0,
  showIndicators = true,
  indicatorPosition = "right",
}: FullscreenScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [sectionsCount, setSectionsCount] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  
  // 计算子节点数量
  useEffect(() => {
    const childrenCount = Children.count(children);
    setSectionsCount(childrenCount);
  }, [children]);

  // 滚动到指定部分
  const scrollToSection = (index: number) => {
    if (isScrolling || !containerRef.current) return;
    
    // 确保索引在有效范围内
    const targetIndex = Math.max(0, Math.min(index, sectionsCount - 1));
    
    setIsScrolling(true);
    setActiveSection(targetIndex);
    
    const container = containerRef.current;
    const sectionHeight = window.innerHeight - (targetIndex === sectionsCount - 1 ? navbarHeight + footerHeight : navbarHeight);
    
    window.scrollTo({
      top: targetIndex * sectionHeight,
      behavior: "smooth"
    });
    
    // 防止连续滚动
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // 滚动动画完成后解锁
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  // 处理滚轮事件
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      // 防止过于敏感的滚动
      if (Math.abs(e.deltaY) < 30) return;
      
      e.preventDefault();
      
      if (e.deltaY > 0) {
        // 向下滚动
        scrollToSection(activeSection + 1);
      } else {
        // 向上滚动
        scrollToSection(activeSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeSection, isScrolling]);

  // 处理触摸事件（移动端支持）
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;
      
      // 检测是否为有效的滑动（防止轻触）
      if (Math.abs(diff) < 50) return;
      
      if (diff > 0) {
        // 向上滑动，显示下一部分
        scrollToSection(activeSection + 1);
      } else {
        // 向下滑动，显示上一部分
        scrollToSection(activeSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }
    
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [activeSection, isScrolling, touchStart]);

  // 克隆子元素并添加全屏高度样式
  const fullscreenChildren = Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    // 计算高度，最后一个部分考虑底栏高度
    const height = index === sectionsCount - 1 
      ? `calc(100vh - ${navbarHeight + footerHeight}px)` 
      : `calc(100vh - ${navbarHeight}px)`;
    
    return cloneElement(child as ReactElement, {
      className: cn(
        (child as ReactElement).props.className,
        "flex items-center justify-center",
        "transition-all duration-500"
      ),
      style: {
        ...((child as ReactElement).props.style || {}),
        height,
        minHeight: height,
        scrollSnapAlign: "start",
      },
    });
  });

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full",
        "scroll-smooth",
        className
      )}
    >
      {fullscreenChildren}
      
      {/* 滚动指示器 */}
      {showIndicators && sectionsCount > 1 && (
        <div 
          className={cn(
            "fixed z-50 flex flex-col gap-2",
            {
              "left-4": indicatorPosition === "left",
              "right-4": indicatorPosition === "right",
              "left-1/2 transform -translate-x-1/2": indicatorPosition === "center"
            },
            "top-1/2 transform -translate-y-1/2"
          )}
        >
          {Array.from({ length: sectionsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeSection === index 
                  ? "bg-primary w-3 h-3" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`滚动到第${index + 1}部分`}
            />
          ))}
        </div>
      )}
    </div>
  );
}