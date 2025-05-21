"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CodeBlockProps } from "./code-block.types";

/**
 * 特殊代码块组件
 *
 * 用于处理特殊类型的代码块，如 mermaid 流程图、图表等
 * 保持 macOS 风格的外观，但内部渲染特殊内容
 */
export function SpecialCodeBlock({
  className,
  children,
  language,
}: CodeBlockProps) {
  // 添加调试信息
  console.log('SpecialCodeBlock 渲染:', { language, className });
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme || 'light') as 'light' | 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // 提取代码内容
  const codeContent = React.isValidElement(children)
    ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
    : String(children || '');

  // 处理 mermaid 图表和 flowchart
  useEffect(() => {
    if ((language === 'mermaid' || language === 'flowchart') && containerRef.current) {
      const renderMermaid = async () => {
        try {
          // 动态导入 mermaid
          let mermaid;
          try {
            // 尝试使用 ESM 导入
            mermaid = (await import('mermaid')).default;
          } catch (importError) {
            console.error('Failed to import mermaid as ESM:', importError);

            // 如果 ESM 导入失败，尝试使用全局变量
            if (typeof window !== 'undefined' && (window as any).mermaid) {
              mermaid = (window as any).mermaid;
            } else {
              throw new Error('Mermaid library not available');
            }
          }

          // 配置 mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          });

          // 清除容器内容
          if (containerRef.current) {
            containerRef.current.innerHTML = '';

            // 创建一个唯一的 ID
            const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

            // 创建一个新的 div 元素
            const mermaidDiv = document.createElement('div');
            mermaidDiv.id = id;
            mermaidDiv.className = 'flex justify-center py-4';
            containerRef.current.appendChild(mermaidDiv);

            try {
              // 渲染 mermaid 图表
              const { svg } = await mermaid.render(id, codeContent);
              if (mermaidDiv) {
                mermaidDiv.innerHTML = svg;
                setIsRendered(true);
              }
            } catch (renderError) {
              console.error('Failed to render mermaid diagram:', renderError);

              // 尝试使用替代方法
              try {
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = codeContent;
                mermaid.init(undefined, mermaidDiv);
                setIsRendered(true);
              } catch (initError) {
                console.error('Failed to initialize mermaid:', initError);
                if (containerRef.current) {
                  containerRef.current.innerHTML = `<pre>${codeContent}</pre>`;
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to process mermaid diagram:', error);
          // 如果渲染失败，显示原始代码
          if (containerRef.current) {
            containerRef.current.innerHTML = `<pre>${codeContent}</pre>`;
          }
        }
      };

      renderMermaid();
    }
  }, [codeContent, language, theme]);

  // 复制成功后的动画效果
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // 根据主题设置背景和边框颜色
  const bgColor = theme === 'dark'
    ? 'bg-zinc-900'
    : 'bg-zinc-50';

  const borderColor = theme === 'dark'
    ? 'border-zinc-700'
    : 'border-zinc-200';

  const textColor = theme === 'dark'
    ? 'text-zinc-300'
    : 'text-zinc-800';

  return (
    <div className={cn(
      "relative my-6 rounded-lg overflow-hidden border shadow-sm",
      bgColor,
      borderColor,
      className
    )}>
      {/* 标题栏 - macOS 风格 */}
      <div className={cn(
        "flex items-center px-4 h-10 border-b",
        borderColor
      )}>
        {/* 左侧三个圆点按钮 */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm shadow-[#FF5F56]/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm shadow-[#FFBD2E]/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm shadow-[#27C93F]/20"></div>
        </div>

        {/* 语言标识 - 居中 */}
        {language && (
          <div className="flex-1 text-center">
            <span className={cn(
              "text-xs uppercase font-medium",
              theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
            )}>
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
              "text-xs px-2 py-1 rounded transition-colors",
              isCopied
                ? "bg-green-500/10 text-green-500"
                : theme === 'dark'
                  ? "hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-300"
                  : "hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-700"
            )}
          >
            {isCopied ? "已复制!" : "复制"}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        ref={containerRef}
        className={cn(
          "overflow-x-auto p-4",
          textColor,
          !isRendered && "font-mono text-sm"
        )}
      >
        {/* 初始显示代码内容，后续会被替换为渲染后的内容 */}
        {!isRendered && language === 'mermaid' && (
          <div className="animate-pulse flex justify-center py-4">
            <div className="h-40 w-full max-w-md bg-muted rounded"></div>
          </div>
        )}
        {language !== 'mermaid' && codeContent}
      </div>
    </div>
  );
}
