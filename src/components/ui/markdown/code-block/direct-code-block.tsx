'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

/**
 * 直接代码块组件
 *
 * 一个简化的 macOS 风格代码块组件，用于直接在 MDX 中使用
 */
export function DirectCodeBlock({
  className,
  children,
  language,
}: {
  className?: string;
  children: React.ReactNode;
  language?: string;
}) {
  console.log('DirectCodeBlock 渲染:', { language, className });

  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme || 'light') as 'light' | 'dark';
  const [isCopied, setIsCopied] = useState(false);

  // 提取代码内容
  const codeContent = React.isValidElement(children)
    ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
    : String(children || '');

  // 复制成功后的动画效果
  React.useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // 根据主题设置背景和边框颜色
  const bgColor = theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50';

  const borderColor = theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200';

  const textColor = theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800';

  return (
    <div
      className={cn(
        'relative my-6 rounded-lg overflow-hidden border shadow-sm',
        bgColor,
        borderColor,
        className
      )}
    >
      {/* 标题栏 - macOS 风格 */}
      <div className={cn('flex items-center px-4 h-10 border-b', borderColor)}>
        {/* 左侧三个圆点按钮 */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm shadow-[#FF5F56]/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm shadow-[#FFBD2E]/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm shadow-[#27C93F]/20"></div>
        </div>

        {/* 语言标识 - 居中 */}
        {language && (
          <div className="flex-1 text-center">
            <span
              className={cn(
                'text-xs uppercase font-medium',
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              )}
            >
              {language}
            </span>
          </div>
        )}

        {/* 复制按钮 - 右侧 */}
        <div className="ml-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeContent);
              setIsCopied(true);
            }}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors',
              isCopied
                ? 'bg-[oklch(0.96_0.03_140/0.1)] text-[oklch(0.5_0.15_140)]' // 成功状态使用绿色OKLCH颜色
                : theme === 'dark'
                ? 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                : 'hover:bg-muted/70 text-muted-foreground hover:text-foreground'
            )}
          >
            {isCopied ? '已复制!' : '复制'}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <pre className={cn('p-4 overflow-x-auto', bgColor, textColor)}>
        <code className="font-mono text-sm block">{codeContent}</code>
      </pre>
    </div>
  );
}
