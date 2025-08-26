"use client";

// 添加类型声明
interface TwikooInitOptions {
  envId: string;
  el: string;
  path: string;
}

interface TwikooInstance {
  init: (options: TwikooInitOptions) => void;
}

// 扩展 Window 接口
declare global {
  interface Window {
    twikoo?: TwikooInstance;
  }
}

import { getRandomGreeting } from "@/features/comment/lib";
import * as React from "react";
import { useEffect, useId, useState } from "react";

export const TwikooComment: React.FC = () => {
  const [greeting, setGreeting] = useState("");
  const commentId = useId();

  useEffect(() => {
    setGreeting(getRandomGreeting());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const envId = "https://twikoo.iflux.art/";
    const path = window.location.pathname;
    const cdnScript = document.createElement("script");
    cdnScript.src = "https://cdn.jsdelivr.net/npm/twikoo@1.6.25/dist/twikoo.all.min.js";
    cdnScript.async = true;

    const loadInitScript = () => {
      if (window.twikoo) {
        window.twikoo.init({
          envId,
          el: `#${commentId}`,
          path,
        });
      } else {
        const initScript = document.createElement("script");
        initScript.innerHTML = `twikoo.init({ envId: '${envId}', el: '#${commentId}', path: '${path}' });`;
        initScript.id = "twikoo-init-id";
        document.body.appendChild(initScript);
      }
    };

    cdnScript.addEventListener("load", loadInitScript);
    document.body.appendChild(cdnScript);

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
