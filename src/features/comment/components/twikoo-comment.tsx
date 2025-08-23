'use client';

import React, { useEffect, useState } from 'react';
import { getRandomGreeting } from '@/features/comment/lib';

// 扩展 Window 接口以包含 Twikoo
declare global {
  interface Window {
    Twikoo: {
      init: (options: { envId: string; el: string; path: string }) => void;
    };
  }
}

/**
 * Twikoo 评论组件（适用于 Next.js）
 * 自动使用全局 envId 和当前页面 path
 * 内部包含分割线、卡片、引导文案和评论区
 */
export const TwikooComment: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getRandomGreeting());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const envId = 'https://twikoo.iflux.art/';
    const path = window.location.pathname;
    const cdnScript = document.createElement('script');
    cdnScript.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.25/dist/twikoo.all.min.js';
    cdnScript.async = true;

    const loadInitScript = () => {
      if (window.Twikoo) {
        window.Twikoo.init({
          envId,
          el: '#twikoo-comment',
          path,
        });
      } else {
        const initScript = document.createElement('script');
        initScript.innerHTML = `twikoo.init({ envId: '${envId}', el: '#twikoo-comment', path: '${path}' });`;
        initScript.id = 'twikoo-init-id';
        document.body.appendChild(initScript);
      }
    };

    cdnScript.addEventListener('load', loadInitScript);
    document.body.appendChild(cdnScript);

    return () => {
      cdnScript.removeEventListener('load', loadInitScript);
      if (cdnScript.parentNode) {
        cdnScript.parentNode.removeChild(cdnScript);
      }
      const secondScript = document.querySelector<HTMLElement>('#twikoo-init-id');
      if (secondScript?.parentNode) {
        secondScript.parentNode.removeChild(secondScript);
      }
      const commentDiv = document.getElementById('twikoo-comment');
      if (commentDiv) commentDiv.innerHTML = '';
    };
  }, []);

  return (
    <div className="mt-4 rounded-xl border bg-card p-6">
      <div className="mb-4 flex justify-center">
        <button
          className="cursor-pointer text-center text-base text-muted-foreground transition-colors hover:text-muted-foreground/70"
          title="点击刷新问候语"
          onClick={() => setGreeting(getRandomGreeting())}
          type="button"
          onKeyDown={e => e.key === 'Enter' && setGreeting(getRandomGreeting())}
        >
          {greeting}
        </button>
      </div>
      <div id="twikoo-comment" className="relative" />
    </div>
  );
};
