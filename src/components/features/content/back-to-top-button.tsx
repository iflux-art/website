"use client";

import React from "react";

interface BackToTopButtonProps {
  title: string;
}

/**
 * 回到顶部按钮组件
 * 客户端组件，处理点击事件
 */
export function BackToTopButton({ title }: BackToTopButtonProps) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="rounded-full p-2 bg-primary/10 hover:bg-primary/20 transition-colors"
      title={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </button>
  );
}