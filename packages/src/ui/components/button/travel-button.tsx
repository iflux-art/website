"use client";

import * as React from "react";
import { TramFront } from "lucide-react";
import { Button } from "packages/src/ui/components/shared-ui/button";

const ICON_SIZE = {
  height: "1rem",
  width: "1rem",
} as const;

const BUTTON_CLASSES = "h-9 w-9";

const DEFAULT_TRAVEL_URL = "https://www.travellings.cn/go.html";

/**
 * 开往按钮组件属性
 */
export interface TravelButtonProps {
  /**
   * 自定义跳转链接
   * @default 'https://www.travellings.cn/go.html'
   */
  href?: string;
  /**
   * 自定义按钮标题
   * @default '开往'
   */
  title?: string;
  /**
   * 加载状态
   * @default false
   */
  loading?: boolean;
  /**
   * 点击回调
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 开往按钮组件
 * 点击跳转到开往友链接力网站，实现网站之间的随机跳转
 *
 * 特性：
 * - 支持自定义跳转链接
 * - 支持自定义标题
 * - 支持加载状态
 * - 支持点击回调
 * - 安全的外部链接处理
 *
 * @example
 * // 基础用法
 * <TravelButton />
 *
 * // 自定义链接
 * <TravelButton href="https://example.com" />
 *
 * // 加载状态
 * <TravelButton loading />
 */
export function TravelButton({
  href = DEFAULT_TRAVEL_URL,
  title = "开往",
  loading = false,
  onClick,
}: TravelButtonProps = {}) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // 执行自定义点击回调
      onClick?.(event);

      // 如果正在加载或事件被阻止，则不继续处理
      if (loading || event.defaultPrevented) return;

      try {
        window.open(href, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Failed to open travel link:", error);
      }
    },
    [href, loading, onClick],
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className={BUTTON_CLASSES}
      title={title}
      onClick={handleClick}
      disabled={loading}
      aria-label={title}
    >
      <TramFront style={ICON_SIZE} />
      <span className="sr-only">{title}</span>
    </Button>
  );
}

/**
 * @deprecated 请使用 TravelButton 替代 Travelling，Travelling 将在未来版本中移除
 */
export const Travelling = TravelButton;
