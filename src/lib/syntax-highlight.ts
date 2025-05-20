"use client";

/**
 * 语法高亮工具函数
 * 用于在客户端初始化语法高亮
 */
export function initSyntaxHighlighting() {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined') return;

  // 检查是否已经加载了 Prism
  if ((window as any).Prism) return;

  // 动态加载 Prism.js
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
  script.async = true;
  script.onload = () => {
    // 加载语言支持
    loadLanguages();
    // 高亮页面上的所有代码块
    (window as any).Prism.highlightAll();
  };
  document.head.appendChild(script);

  // 加载 Prism 样式 - 使用更适合 macOS 风格的主题
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
  document.head.appendChild(style);

  // 添加自定义样式以覆盖 Prism 默认样式，使其更符合 macOS 风格
  const customStyle = document.createElement('style');
  customStyle.textContent = `
    /* 移除 Prism 默认的圆角和阴影 */
    :not(pre) > code[class*="language-"],
    pre[class*="language-"] {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      border: none;
      margin: 0;
      padding: 0;
    }

    /* 确保代码内容不受 Prism 样式影响 */
    code[class*="language-"],
    pre[class*="language-"] {
      text-shadow: none;
      font-family: var(--font-geist-mono);
    }
  `;
  document.head.appendChild(customStyle);
}

/**
 * 加载常用编程语言的语法高亮支持
 */
function loadLanguages() {
  if (typeof window === 'undefined' || !(window as any).Prism) return;

  const languages = [
    'javascript',
    'typescript',
    'jsx',
    'tsx',
    'css',
    'scss',
    'html',
    'bash',
    'json',
    'markdown',
    'yaml',
    'python',
    'java',
    'c',
    'cpp',
    'csharp',
    'go',
    'rust',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'sql',
  ];

  // 动态加载语言支持
  languages.forEach(lang => {
    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
    script.async = true;
    document.head.appendChild(script);
  });
}

/**
 * 高亮特定容器内的代码块
 * @param container - 包含代码块的容器元素
 */
export function highlightCodeInContainer(container: HTMLElement) {
  if (typeof window === 'undefined' || !(window as any).Prism) return;

  // 查找容器内的所有代码块
  const codeBlocks = container.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    (window as any).Prism.highlightElement(block);
  });
}
