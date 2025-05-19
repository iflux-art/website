"use client";

import React, { useEffect, useState } from "react";

interface FullscreenScrollControllerProps {
  sectionIds: string[];
  navbarHeight?: number;
  children: React.ReactNode;
}

/**
 * 全屏滚动控制器
 * 实现一键翻屏功能，支持鼠标滚轮和键盘上下键
 */
export function FullscreenScrollController({
  sectionIds,
  navbarHeight = 64, // 默认导航栏高度
  children
}: FullscreenScrollControllerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // 滚动到指定部分
  const scrollToSection = (index: number) => {
    if (isScrolling) return;

    // 确保索引在有效范围内
    const targetIndex = Math.max(0, Math.min(index, sectionIds.length - 1));

    if (targetIndex === activeIndex) return;

    setIsScrolling(true);
    setActiveIndex(targetIndex);

    const targetSection = document.getElementById(sectionIds[targetIndex]);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth"
      });
    }

    // 防止连续滚动
    setTimeout(() => {
      setIsScrolling(false);
    }, 800); // 滚动动画完成后解锁
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToSection(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isScrolling]);

  // 处理滚轮事件
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      // 防止过于敏感的滚动
      if (Math.abs(e.deltaY) < 30) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        // 向下滚动
        scrollToSection(activeIndex + 1);
      } else {
        // 向上滚动
        scrollToSection(activeIndex - 1);
      }
    };

    const handleWheelCapture = (e: WheelEvent) => {
      // 在捕获阶段阻止默认滚动行为
      if (Math.abs(e.deltaY) >= 30) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("wheel", handleWheelCapture, { capture: true, passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("wheel", handleWheelCapture, { capture: true });
    };
  }, [activeIndex, isScrolling]);

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
        scrollToSection(activeIndex + 1);
      } else {
        // 向下滑动，显示上一部分
        scrollToSection(activeIndex - 1);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, isScrolling, touchStart]);

  // 监听滚动事件，更新当前活动部分
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // 找到当前滚动位置对应的部分
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, isScrolling]);

  // 设置每个部分的高度
  useEffect(() => {
    const setSectionHeights = () => {
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight - navbarHeight;

      sectionIds.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
          section.style.height = `${sectionHeight}px`;
          section.style.minHeight = `${sectionHeight}px`;
          section.style.maxHeight = `${sectionHeight}px`;
          section.style.overflow = 'hidden';
        }
      });
    };

    setSectionHeights();
    window.addEventListener("resize", setSectionHeights);

    return () => {
      window.removeEventListener("resize", setSectionHeights);
    };
  }, [sectionIds, navbarHeight]);

  return <>{children}</>;
}
