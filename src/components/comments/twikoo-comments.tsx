'use client';

import { useEffect, useRef } from 'react';

interface TwikooCommentsProps {
  envId: string;
  path?: string;
  className?: string;
}

export function TwikooComments({ envId, path, className = '' }: TwikooCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 动态加载 Twikoo CDN
    const loadTwikoo = async () => {
      try {
        // 检查是否已经加载过 Twikoo
        if (typeof window !== 'undefined' && (window as any).twikoo) {
          initTwikoo();
          return;
        }

        // 动态加载 Twikoo CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.staticfile.org/twikoo/1.6.16/twikoo.all.min.js';
        script.async = true;
        script.onload = () => {
          initTwikoo();
        };
        script.onerror = () => {
          showError('评论系统加载失败，请刷新页面重试');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Twikoo:', error);
        showError('评论系统加载失败，请刷新页面重试');
      }
    };

    const initTwikoo = () => {
      if (containerRef.current && (window as any).twikoo) {
        (window as any).twikoo.init({
          envId, // 腾讯云环境 ID
          el: containerRef.current, // 容器元素
          path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'), // 用于区分不同页面的评论
          lang: 'zh-CN', // 语言
          region: 'ap-shanghai', // 环境地域，默认为 ap-shanghai
        });
      }
    };

    const showError = (message: string) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="p-6 text-center border rounded-lg bg-muted/50">
            <p class="text-muted-foreground">${message}</p>
            <button onclick="window.location.reload()" class="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              刷新页面
            </button>
          </div>
        `;
      }
    };

    // 检查是否有环境 ID
    if (!envId) {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="p-6 text-center border rounded-lg bg-muted/50">
            <p class="text-muted-foreground">评论系统未配置，请联系管理员</p>
          </div>
        `;
      }
      return;
    }

    loadTwikoo();
  }, [envId, path]);

  return (
    <div className={`twikoo-container ${className}`}>
      <div ref={containerRef} />

      {/* 加载中状态 */}
      <div className="twikoo-loading p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">评论系统加载中...</p>
      </div>

      <style jsx>{`
        .twikoo-container .twikoo-loading {
          display: block;
        }

        .twikoo-container:has(.tk-comments) .twikoo-loading {
          display: none;
        }

        /* Twikoo 自定义样式 */
        .twikoo-container :global(.tk-comments) {
          margin-top: 0;
        }

        .twikoo-container :global(.tk-submit) {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }

        .twikoo-container :global(.tk-submit:hover) {
          background: hsl(var(--primary) / 0.9);
        }

        .twikoo-container :global(.tk-input) {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .twikoo-container :global(.tk-input:focus) {
          border-color: hsl(var(--primary));
          outline: none;
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
        }

        .twikoo-container :global(.tk-comment) {
          border-bottom: 1px solid hsl(var(--border));
          padding: 1rem 0;
        }

        .twikoo-container :global(.tk-comment:last-child) {
          border-bottom: none;
        }

        .twikoo-container :global(.tk-nick) {
          color: hsl(var(--primary));
          font-weight: 500;
        }

        .twikoo-container :global(.tk-time) {
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
        }

        .twikoo-container :global(.tk-content) {
          color: hsl(var(--foreground));
          line-height: 1.6;
        }

        .twikoo-container :global(.tk-replies) {
          margin-left: 2rem;
          border-left: 2px solid hsl(var(--border));
          padding-left: 1rem;
        }

        @media (max-width: 640px) {
          .twikoo-container :global(.tk-replies) {
            margin-left: 1rem;
            padding-left: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
