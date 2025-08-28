"use client";

import { CodeBlock } from "@/features/code";
import { useEffect, useRef, useState } from "react";
import "@/features/code/styles/prism-custom.css";

type MDXPreProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLPreElement>;

/**
 * MDX Pre 组件 - 处理代码块
 * 转换 MDX 代码块为 CodeBlock 组件，提供语法高亮和统一样式
 */
export function MDXPre({ children, className, ...props }: MDXPreProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [codeContent, setCodeContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("plaintext");

  useEffect(() => {
    if (preRef.current) {
      // 查找内部的 code 元素
      const codeElement = preRef.current.querySelector("code");
      if (codeElement) {
        // 提取代码内容
        setCodeContent(codeElement.textContent || "");

        // 提取语言类别
        if (codeElement.className) {
          const langMatch = codeElement.className.match(/language-(\w+)/);
          if (langMatch?.[1]) {
            setLanguage(langMatch[1]);
          }
        }
      }
    }
  }, []);

  // 渲染原始 pre 元素，用于初始数据提取
  if (!codeContent) {
    return (
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    );
  }

  // 一旦提取到代码内容和语言，渲染 CodeBlock 组件
  return (
    <CodeBlock
      code={codeContent}
      language={language}
      showLineNumbers={true}
      className={className}
    />
  );
}

export default MDXPre;
