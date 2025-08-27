"use client";

/**
 * 客户端初始化组件
 * 处理需要在客户端执行的初始化逻辑
 */

import { initLinksPreload } from "@/lib/init/preload-links";
import { useEffect } from "react";

/**
 * 客户端初始化组件
 * 在客户端执行各种初始化任务
 */
export function InitClient() {
  useEffect(() => {
    // 初始化链接数据预加载
    initLinksPreload().catch(error => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to initialize links preload:", error);
      }
    });
  }, []);

  return null; // 此组件不渲染任何UI
}
