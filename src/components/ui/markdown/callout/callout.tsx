import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { CalloutProps } from './callout.types';

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
  tip: HelpCircle,
};

const styles = {
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 text-blue-800 dark:text-blue-300',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 text-amber-800 dark:text-amber-300',
  success: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900/50 text-green-800 dark:text-green-300',
  error: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50 text-red-800 dark:text-red-300',
  tip: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/50 text-purple-800 dark:text-purple-300',
};

/**
 * Callout 组件
 * 用于在文档中显示提示、警告、错误等信息
 */
export function Callout({ children, type = 'info', title, className }: CalloutProps) {
  const IconComponent = icons[type];

  return (
    <div className={cn(
      'my-6 rounded-lg border p-4',
      styles[type],
      className
    )}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          {title && <h5 className="mb-2 font-medium">{title}</h5>}
          <div className="text-[0.9em]">{children}</div>
        </div>
      </div>
    </div>
  );
}

// 导出Callout组件
export const calloutComponents = {
  Callout,
};
