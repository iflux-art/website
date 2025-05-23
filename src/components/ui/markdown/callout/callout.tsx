import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

/**
 * Callout 组件属性
 */
export interface CalloutProps {
  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * Callout 类型
   * @default 'info'
   */
  type?: 'info' | 'warning' | 'success' | 'error' | 'tip';

  /**
   * 标题
   */
  title?: string;

  /**
   * 自定义类名
   */
  className?: string;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
  tip: HelpCircle,
};

// 使用 OKLCH 颜色和 CSS 变量
const styles = {
  info: 'bg-[oklch(0.96_0.03_240)] border-[oklch(0.85_0.1_240)] dark:bg-[oklch(0.2_0.1_240/0.3)] dark:border-[oklch(0.3_0.1_240/0.5)] text-[oklch(0.5_0.15_240)] dark:text-[oklch(0.8_0.1_240)]',
  warning:
    'bg-[oklch(0.96_0.03_80)] border-[oklch(0.85_0.1_80)] dark:bg-[oklch(0.2_0.1_80/0.3)] dark:border-[oklch(0.3_0.1_80/0.5)] text-[oklch(0.5_0.15_80)] dark:text-[oklch(0.8_0.1_80)]',
  success:
    'bg-[oklch(0.96_0.03_140)] border-[oklch(0.85_0.1_140)] dark:bg-[oklch(0.2_0.1_140/0.3)] dark:border-[oklch(0.3_0.1_140/0.5)] text-[oklch(0.5_0.15_140)] dark:text-[oklch(0.8_0.1_140)]',
  error:
    'bg-[oklch(0.96_0.03_20)] border-[oklch(0.85_0.1_20)] dark:bg-[oklch(0.2_0.1_20/0.3)] dark:border-[oklch(0.3_0.1_20/0.5)] text-[oklch(0.5_0.15_20)] dark:text-[oklch(0.8_0.1_20)]',
  tip: 'bg-[oklch(0.96_0.03_300)] border-[oklch(0.85_0.1_300)] dark:bg-[oklch(0.2_0.1_300/0.3)] dark:border-[oklch(0.3_0.1_300/0.5)] text-[oklch(0.5_0.15_300)] dark:text-[oklch(0.8_0.1_300)]',
};

/**
 * Callout 组件
 * 用于在文档中显示提示、警告、错误等信息
 */
export function Callout({ children, type = 'info', title, className }: CalloutProps) {
  const IconComponent = icons[type];

  return (
    <div
      className={cn(
        'my-8 rounded-xl border p-5 shadow-sm hover:shadow-md transition-all',
        styles[type],
        className
      )}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          {title && <h5 className="mb-2 font-semibold text-lg tracking-tight">{title}</h5>}
          <div className="text-sm leading-relaxed mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

// 导出Callout组件
export const calloutComponents = {
  Callout,
};
