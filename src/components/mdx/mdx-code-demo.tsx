'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Code, Eye, Copy, Check, RefreshCw } from 'lucide-react';

export interface MDXCodeDemoProps {
  code: string;
  preview: React.ReactNode;
  title?: string;
  description?: string;
  language?: string;
  defaultView?: 'code' | 'preview' | 'split';
  className?: string;
}

/**
 * MDX 代码示例组件
 * - 支持代码和预览切换
 * - 支持分屏模式
 * - 支持全屏预览
 * - 代码高亮
 * - 支持复制代码
 */
export const MDXCodeDemo = ({
  code,
  preview,
  title,
  description,
  language = 'jsx',
  defaultView = 'split',
  className = '',
}: MDXCodeDemoProps) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>(defaultView);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        my-6 rounded-lg border border-gray-200 dark:border-gray-700
        ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}
        ${className}
      `}
    >
      {/* 头部工具栏 */}
      <div
        className="
        flex items-center justify-between
        px-4 py-2 border-b border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800
      "
      >
        <div className="flex items-center gap-3">
          {title && (
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setView('code')}
              className={`
                p-1.5 flex items-center gap-1.5
                text-xs font-medium
                ${
                  view === 'code'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">代码</span>
            </button>
            <button
              onClick={() => setView('preview')}
              className={`
                p-1.5 flex items-center gap-1.5
                text-xs font-medium
                ${
                  view === 'preview'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">预览</span>
            </button>
            <button
              onClick={() => setView('split')}
              className={`
                p-1.5 flex items-center gap-1.5
                text-xs font-medium
                ${
                  view === 'split'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">分屏</span>
            </button>
          </div>

          {/* 操作按钮 */}
          <button
            onClick={handleCopy}
            className="
              p-1.5 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
            "
            aria-label={copied ? '已复制' : '复制代码'}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="
              p-1.5 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
            "
            aria-label={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 描述信息 */}
      {description && (
        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          {description}
        </div>
      )}

      {/* 内容区域 */}
      <div
        className={`
        ${view === 'split' ? 'grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700' : ''}
      `}
      >
        {/* 代码区域 */}
        {(view === 'code' || view === 'split') && (
          <div className="overflow-auto">
            <pre className={`language-${language} m-0 p-4`}>
              <code>{code}</code>
            </pre>
          </div>
        )}

        {/* 预览区域 */}
        {(view === 'preview' || view === 'split') && (
          <div className="p-4 overflow-auto bg-gray-50 dark:bg-gray-800">{preview}</div>
        )}
      </div>
    </div>
  );
};
