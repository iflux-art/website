"use client";

import React, { useEffect } from "react";

/**
 * Twikoo 评论组件（适用于 Next.js）
 * 自动使用全局 envId 和当前页面 path
 */
export const TwikooComment: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const envId = "https://twikoo.iflux.art/";
    const path = window.location.pathname;
    const cdnScript = document.createElement("script");
    cdnScript.src =
      "https://cdn.jsdelivr.net/npm/twikoo@1.6.25/dist/twikoo.all.min.js";
    cdnScript.async = true;

    const loadInitScript = () => {
      if ((window as any)["twikoo"]) {
        (window as any)["twikoo"].init({
          envId,
          el: "#twikoo-comment",
          path,
        });
      } else {
        const initScript = document.createElement("script");
        initScript.innerHTML = `twikoo.init({ envId: '${envId}', el: '#twikoo-comment', path: '${path}' });`;
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
      const secondScript = document.querySelector("#twikoo-init-id");
      if (secondScript && secondScript.parentNode) {
        secondScript.parentNode.removeChild(secondScript);
      }
      const commentDiv = document.getElementById("twikoo-comment");
      if (commentDiv) commentDiv.innerHTML = "";
    };
  }, []);

  return <div id="twikoo-comment" className="relative"></div>;
};
