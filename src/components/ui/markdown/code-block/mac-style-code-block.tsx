'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Copy from '@/components/ui/markdown/copy';
import { CodeBlockProps } from './code-block.types';
import { useTheme } from 'next-themes';

/**
 * macOS 风格代码块组件
 *
 * 特点：
 * 1. 顶部彩色圆点按钮（红、黄、绿）
 * 2. 根据主题自动适配颜色
 * 3. 支持语法高亮
 * 4. 复制功能
 * 5. 语言标识
 */
export function MacStyleCodeBlock({
  className,
  children,
  language,
  showLineNumbers = true,
}: CodeBlockProps) {
  // 添加调试信息
  console.log('MacStyleCodeBlock 渲染:', { language, className });
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme || 'light') as 'light' | 'dark';
  const codeRef = useRef<HTMLElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  // 提取代码内容
  const codeContent = React.isValidElement(children)
    ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
    : String(children || '');

  // 使用 useEffect 在客户端初始化 Prism
  React.useEffect(() => {
    // 动态导入语法高亮函数
    const initHighlighting = async () => {
      const { initSyntaxHighlighting } = await import('@/lib/syntax-highlight');
      initSyntaxHighlighting();

      // 确保当前代码块被高亮
      if (window.Prism && codeRef.current) {
        window.Prism.highlightElement(codeRef.current);
      }
    };

    initHighlighting();
  }, []);

  // 复制成功后的动画效果
  React.useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // 使用CSS变量替代传统颜色名称
  const bgColor = theme === 'dark' ? 'bg-card' : 'bg-muted/30';

  const borderColor = theme === 'dark' ? 'border-border' : 'border-border';

  const textColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';

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
                ? 'bg-green-500/10 text-green-500'
                : theme === 'dark'
                ? 'hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-300'
                : 'hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-700'
            )}
          >
            {isCopied ? '已复制!' : '复制'}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <div className="relative">
        {/* 行号 - 只在 showLineNumbers 为 true 时显示 */}
        {showLineNumbers && (
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-12 text-right pr-2 select-none pt-4',
              theme === 'dark'
                ? 'bg-muted/50 border-r border-border'
                : 'bg-muted/30 border-r border-border',
              'text-muted-foreground' // 使用CSS变量替代传统颜色名称
            )}
          >
            {codeContent.split('\n').map((_, i) => (
              <div key={i} className="h-6 text-xs leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* 代码 */}
        <pre className={cn('p-4 overflow-x-auto', showLineNumbers && 'pl-16', bgColor, textColor)}>
          <code
            ref={codeRef}
            className={cn('font-mono text-sm block', language ? `language-${language}` : '')}
          >
            {codeContent}
          </code>
        </pre>
      </div>
    </div>
  );
}
