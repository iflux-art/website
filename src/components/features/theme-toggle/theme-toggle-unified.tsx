"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

/**
 * 主题切换组件属性
 */
export interface ThemeToggleProps {
  /**
   * 是否显示文本标签
   * 在移动设备上标签会被隐藏
   * @default false
   */
  showLabel?: boolean;
}

/**
 * 主题图标动画组件属性
 */
interface ThemeIconAnimationProps {
  /**
   * 当前主题
   */
  theme: string | undefined;

  /**
   * 是否正在动画中
   */
  isAnimating: boolean;

  /**
   * 图标元素
   */
  icon: React.ReactNode;
}

/**
 * 主题涟漪效果组件属性
 */
interface ThemeRippleEffectProps {
  /**
   * 是否激活动画
   */
  active: boolean;

  /**
   * 动画完成后的回调
   */
  onAnimationComplete: () => void;

  /**
   * 触发点的位置
   */
  position: {
    x: number;
    y: number;
  } | null;
}

/**
 * 主题图标动画组件
 *
 * 使用 React.memo 优化性能，避免不必要的重新渲染
 */
const ThemeIconAnimation = React.memo(
  function ThemeIconAnimation({ theme, isAnimating, icon }: ThemeIconAnimationProps) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme || "system"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    );
  },
  // 自定义比较函数，只有当主题或动画状态变化时才重新渲染
  (prevProps, nextProps) => {
    return (
      prevProps.theme === nextProps.theme &&
      prevProps.isAnimating === nextProps.isAnimating
    );
  }
);

/**
 * 主题切换涟漪效果组件
 *
 * 实现从点击位置向外扩散的圆形动画效果
 */
function ThemeRippleEffect({
  active,
  onAnimationComplete,
  position
}: ThemeRippleEffectProps) {
  const { resolvedTheme } = useTheme();
  const rippleRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);

  // 在客户端渲染时设置 portal 容器
  React.useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // 处理动画效果
  React.useEffect(() => {
    if (!active || !position || !rippleRef.current || !portalContainer) return;

    const ripple = rippleRef.current;

    // 计算动画起始位置
    const posX = position.x;
    const posY = position.y;

    // 计算最大半径（屏幕对角线长度）
    const maxRadius = Math.sqrt(
      Math.pow(Math.max(posX, window.innerWidth - posX), 2) +
      Math.pow(Math.max(posY, window.innerHeight - posY), 2)
    );

    // 设置起始位置
    ripple.style.top = `${posY}px`;
    ripple.style.left = `${posX}px`;

    // 设置动画起始状态
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';

    // 触发重排以确保初始状态被应用
    ripple.getBoundingClientRect();

    // 应用动画
    ripple.style.transform = `scale(${maxRadius / 20})`; // 除以20是因为我们设置了40px的初始大小

    // 动画完成后的处理
    const animationDuration = 1000; // 1秒

    // 监听过渡结束事件
    const handleTransitionEnd = () => {
      ripple.removeEventListener('transitionend', handleTransitionEnd);
      onAnimationComplete();
    };

    ripple.addEventListener('transitionend', handleTransitionEnd);

    // 作为备份，如果过渡事件没有触发，使用定时器
    const timer = setTimeout(() => {
      ripple.removeEventListener('transitionend', handleTransitionEnd);
      onAnimationComplete();
    }, animationDuration + 100);

    return () => clearTimeout(timer);
  }, [active, position, portalContainer, onAnimationComplete]);

  // 如果没有 portal 容器或动画未激活，则不渲染
  if (!portalContainer || !active) return null;

  // 确定背景颜色（与目标主题相反）
  // 使用目标主题的背景色，这样扩散效果更自然
  const bgColor = resolvedTheme === 'dark' ? 'var(--foreground)' : 'var(--background)';

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={rippleRef}
        className="absolute rounded-full w-[40px] h-[40px]"
        style={{
          backgroundColor: bgColor,
          transformOrigin: 'center center',
          transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1.4), opacity 0.2s ease-out',
          willChange: 'transform, opacity',
          opacity: 0,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>,
    portalContainer
  );
}

/**
 * 主题切换组件
 * 用于切换明暗主题模式
 *
 * 增强版本：
 * - 更炫酷的涟漪动画效果
 * - 更好的可访问性
 * - 支持系统主题
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle({ showLabel = false }: ThemeToggleProps = {}) {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [ripplePosition, setRipplePosition] = React.useState<{ x: number; y: number } | null>(null);
  const [showRipple, setShowRipple] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // 确保组件在客户端渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 处理主题切换
  const toggleTheme = React.useCallback(() => {
    if (isAnimating) return;
    if (!setTheme || !resolvedTheme) return;

    setIsAnimating(true);

    // 获取按钮的位置信息
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      // 使用按钮中心点作为涟漪起始点
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      setRipplePosition({ x: centerX, y: centerY });
      setShowRipple(true);
    }

    // 延迟切换主题，等待动画开始
    setTimeout(() => {
      // 简单地在亮色和暗色主题之间切换
      // 无论当前是系统主题还是用户选择的主题
      const newTheme = resolvedTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }, 200); // 延迟200ms切换主题，让动画先开始
  }, [resolvedTheme, setTheme, isAnimating]);

  // 处理涟漪动画完成
  const handleRippleComplete = React.useCallback(() => {
    setShowRipple(false);
    setRipplePosition(null);
    setIsAnimating(false);
  }, []);

  // 获取当前主题图标和标签
  const getThemeInfo = () => {
    if (!mounted || !resolvedTheme) return { icon: null, label: "加载中..." };

    // 获取当前解析的主题（实际显示的主题）
    const currentTheme = resolvedTheme || "system";

    // 根据当前解析的主题显示相应的图标和标签
    switch (currentTheme) {
      case "dark":
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换到亮色模式"
        };
      case "light":
        return {
          icon: <Moon className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换到暗色模式"
        };
      default:
        return {
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
          label: "切换主题"
        };
    }
  };

  // 服务端渲染时返回占位符
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="sr-only">加载中...</span>
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  const { icon, label } = getThemeInfo();

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        className={showLabel ? "gap-2" : ""}
        title={label}
        aria-label={label}
        onClick={toggleTheme}
        disabled={isAnimating}
      >
        <ThemeIconAnimation
          theme={resolvedTheme}
          isAnimating={isAnimating}
          icon={icon}
        />

        {showLabel && (
          <span className="hidden sm:inline-block">{label}</span>
        )}
      </Button>

      {/* 涟漪效果 */}
      <ThemeRippleEffect
        active={showRipple}
        position={ripplePosition}
        onAnimationComplete={handleRippleComplete}
      />
    </>
  );
}
