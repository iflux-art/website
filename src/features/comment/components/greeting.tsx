"use client";

import { getRandomGreeting } from "@/features/comment/lib";
import type { GreetingProps } from "@/features/comment/types";
import { useCallback, useEffect, useState } from "react";

/**
 * 问候语组件
 * 根据当前时间显示不同的问候语
 */
export const Greeting = ({ className }: GreetingProps) => {
  const [greeting, setGreeting] = useState("");

  // 刷新问候语的函数
  const refreshGreeting = useCallback(() => {
    setGreeting(getRandomGreeting());
  }, []);

  // 在组件挂载时设置随机问候语
  useEffect(() => {
    refreshGreeting();
  }, [refreshGreeting]);

  return (
    <button
      className={`mb-5 cursor-pointer text-xl font-normal text-muted-foreground transition-colors hover:text-muted-foreground/70 md:text-2xl ${className ?? ""}`}
      onClick={refreshGreeting}
      onKeyDown={e => e.key === "Enter" && refreshGreeting()}
      title="点击刷新问候语"
      type="button"
    >
      {greeting}
    </button>
  );
};
