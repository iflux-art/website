"use client";
import React from "react";

const LANGUAGE_DISPLAY_MAP: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  py: "Python",
  jsx: "JSX",
  tsx: "TSX",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  md: "Markdown",
  mdx: "MDX",
  sh: "Shell",
  bash: "Bash",
  c: "C",
  cpp: "C++",
  java: "Java",
  go: "Go",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  rust: "Rust",
  // 可按需扩展
};

function getDisplayLanguage(lang: string): string {
  return LANGUAGE_DISPLAY_MAP[lang] || lang;
}

function getThemeColors(isDark: boolean) {
  return {
    toolbarBg: isDark ? "#23272f" : "#f3f4f6",
    contentBg: isDark ? "#1a1d23" : "#f8fafc",
  };
}

export function useEnhanceCodeBlocks() {
  React.useEffect(() => {
    const pres = document.querySelectorAll<HTMLPreElement>("pre");
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const { toolbarBg, contentBg } = getThemeColors(isDark);

    pres.forEach((pre) => {
      // 避免重复插入
      const prev = pre.previousElementSibling;
      if (prev && prev.classList.contains("mdx-code-toolbar")) return;
      const parent = pre.parentElement;
      if (!parent) return;
      const language = pre.getAttribute("data-language") || "text";
      const filename = pre.getAttribute("data-filename") || "";
      const code = pre.querySelector("code");
      const codeText = code?.textContent || "";
      const displayLanguage = getDisplayLanguage(language);

      // 标题栏（无论有无语言标识都插入）
      const toolbar = document.createElement("div");
      toolbar.className = [
        "mdx-code-toolbar",
        "flex items-center justify-between px-4 py-2 text-xs text-muted-foreground",
        "bg-[" + toolbarBg + "]",
        "rounded-t-md",
      ].join(" ");
      toolbar.style.backgroundColor = toolbarBg;
      toolbar.innerHTML = `
        <span class="font-medium">${filename || displayLanguage}</span>
        <button class="mdx-copy-btn flex items-center gap-1 rounded px-2 py-1 transition-all duration-200 hover:bg-muted-foreground/10 bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20">
          <svg class="lucide lucide-copy h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          <span class="sr-only md:not-sr-only">复制</span>
        </button>
      `;
      parent.insertBefore(toolbar, pre);

      // 内容区
      pre.classList.add("rounded-b-md");
      pre.classList.remove("rounded-md", "rounded-t-md");
      pre.style.backgroundColor = contentBg;
      pre.style.borderTopLeftRadius = "0";
      pre.style.borderTopRightRadius = "0";
      pre.style.borderBottomLeftRadius = "0.5rem";
      pre.style.borderBottomRightRadius = "0.5rem";
      pre.style.marginTop = "0";
      pre.style.marginBottom = "0";
      pre.style.paddingTop = "1rem";
      pre.style.paddingBottom = "1rem";

      // 复制按钮逻辑
      const copyBtn = toolbar.querySelector<HTMLButtonElement>(".mdx-copy-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(codeText);
            copyBtn.innerHTML = `
              <svg class="lucide lucide-check h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span class="sr-only md:not-sr-only">已复制</span>
            `;
            setTimeout(() => {
              copyBtn.innerHTML = `
                <svg class="lucide lucide-copy h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
                <span class="sr-only md:not-sr-only">复制</span>
              `;
            }, 2000);
          } catch {
            /* ignore */
          }
        });
      }
    });
  }, []);
}

export function MDXCodeEnhance() {
  useEnhanceCodeBlocks();
  return null;
}
