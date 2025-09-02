"use client";

/**
 * Twikoo 初始化选项接口
 * 包含初始化评论系统所需的基本配置
 */
interface TwikooInitOptions {
  /** 环境 ID，用于标识评论系统的实例 */
  envId: string;
  /** 挂载元素的选择器 */
  el: string;
  /** 页面路径，用于标识当前页面 */
  path: string;
}

/**
 * Twikoo 实例接口
 * 定义 Twikoo 评论系统的核心方法
 */
interface TwikooInstance {
  /**
   * 初始化评论系统
   * @param options 初始化选项
   */
  init: (options: TwikooInitOptions) => void;
}

/**
 * 扩展全局 Window 接口
 * 添加 Twikoo 评论系统实例的类型定义
 */
declare global {
  interface Window {
    /** 可选的 Twikoo 实例 */
    twikoo?: TwikooInstance;
  }
}

import { getRandomGreeting } from "@/features/comment/lib";
import * as React from "react";
import { useEffect, useId, useState } from "react";

/**
 * Twikoo 评论组件
 * 提供基于 Twikoo 的评论系统集成
 * @returns React 组件
 */
export const TwikooComment: React.FC = () => {
  /** 问候语状态 */
  const [greeting, setGreeting] = useState("");
  /** 评论区域唯一 ID */
  const commentId = useId();

  // 组件挂载时设置随机问候语
  useEffect(() => {
    setGreeting(getRandomGreeting());
  }, []);

  // 初始化 Twikoo 评论系统
  useEffect(() => {
    // 服务端渲染时不执行
    if (typeof window === "undefined") return;

    /** Twikoo 环境 ID */
    const envId = "https://twikoo.iflux.art/";
    /** 当前页面路径 */
    const path = window.location.pathname;
    /** Twikoo CDN 脚本元素 */
    const cdnScript = document.createElement("script");
    cdnScript.src = "https://cdn.jsdelivr.net/npm/twikoo@1.6.25/dist/twikoo.all.min.js";
    cdnScript.async = true;

    /** 加载初始化脚本的回调函数 */
    const loadInitScript = () => {
      if (window.twikoo) {
        // 如果 twikoo 已存在，直接初始化
        window.twikoo.init({
          envId,
          el: `#${commentId}`,
          path,
        });
      } else {
        // 否则创建初始化脚本
        const initScript = document.createElement("script");
        initScript.innerHTML = `twikoo.init({ envId: '${envId}', el: '#${commentId}', path: '${path}' });`;
        initScript.id = "twikoo-init-id";
        document.body.appendChild(initScript);
      }
    };

    cdnScript.addEventListener("load", loadInitScript);
    document.body.appendChild(cdnScript);

    // 清理函数
    return () => {
      cdnScript.removeEventListener("load", loadInitScript);
      if (cdnScript.parentNode) {
        cdnScript.parentNode.removeChild(cdnScript);
      }
      const secondScript = document.querySelector<HTMLElement>("#twikoo-init-id");
      if (secondScript?.parentNode) {
        secondScript.parentNode.removeChild(secondScript);
      }
      const commentDiv = document.getElementById(commentId);
      if (commentDiv) commentDiv.innerHTML = "";
    };
  }, [commentId]);

  return (
    <div className="mt-4 rounded-xl border bg-card p-6">
      <div className="mb-4 flex justify-center">
        <button
          className="cursor-pointer text-center text-base text-muted-foreground transition-colors hover:text-muted-foreground/70"
          title="点击刷新问候语"
          onClick={() => setGreeting(getRandomGreeting())}
          type="button"
          onKeyDown={e => e.key === "Enter" && setGreeting(getRandomGreeting())}
        >
          {greeting}
        </button>
      </div>
      <div id={commentId} className="relative" />
    </div>
  );
};
