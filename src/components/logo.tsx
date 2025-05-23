'use client';

import Link from 'next/link';

/**
 * Logo 组件
 *
 * 网站 Logo 组件，点击时会硬刷新导航到首页
 */
export function Logo() {
  // 处理点击事件，使用硬刷新导航到首页
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 阻止默认链接行为

    // 使用 window.location.href 进行硬刷新
    // 这将完全重新加载页面，确保所有内容都会重新获取
    window.location.href = '/';
  };

  return (
    <Link href="/" className="inline-block" onClick={handleClick}>
      <h2
        className="text-sm sm:text-md md:text-lg font-bold font-code hover:text-primary transition-all duration-400 animate-in fade-in zoom-in-90 hover:scale-105"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        iFluxArt
      </h2>
    </Link>
  );
}
