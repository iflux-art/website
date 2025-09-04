"use client";

import { CodeBlock } from "@/features/content/components/code/code-block";
import { useEffect, useState } from "react";
import React from "react";
import "@/features/content/components/code/styles/prism-custom.css";

type MDXPreProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLPreElement>;

/**
 * 从 children 中提取代码内容和语言
 */
function extractCodeInfo(children: React.ReactNode): { code: string; language: string } {
  let code = "";
  let language = "plaintext";

  // 直接从pre标签的className中提取语言信息
  if (
    React.isValidElement(children) &&
    children.props &&
    typeof children.props === "object" &&
    "className" in children.props
  ) {
    const preClassName = children.props.className as string | undefined;
    const langMatch = preClassName?.match(/language-(\w+)/);
    if (langMatch?.[1]) {
      language = langMatch[1];
    }
  }

  // 递归遍历 children 来提取代码内容
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return String(node);
    }
    if (React.isValidElement(node)) {
      // 检查是否是 code 元素
      if (
        node.type === "code" &&
        typeof node.props === "object" &&
        node.props &&
        "className" in node.props
      ) {
        const className = node.props.className as string | undefined;
        const langMatch = className?.match(/language-(\w+)/);
        if (langMatch?.[1]) {
          language = langMatch[1];
        }
      }
      // 递归处理子元素
      if (typeof node.props === "object" && node.props && "children" in node.props) {
        return extractText(node.props.children as React.ReactNode);
      }
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    return "";
  };

  code = extractText(children);
  return { code: code.trim(), language };
}

/**
 * MDX Pre 组件 - 处理代码块
 * 转换 MDX 代码块为 CodeBlock 组件，提供语法高亮和统一样式
 */
export function MDXPre({ children, className, ...props }: MDXPreProps) {
  const [isClient, setIsClient] = useState(false);
  const { code, language } = extractCodeInfo(children);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 为了避免水合不匹配，在服务端和客户端初始渲染时使用相同的结构
  if (!isClient) {
    return (
      <pre className={className} suppressHydrationWarning {...props}>
        {children}
      </pre>
    );
  }

  // 客户端渲染时，如果有代码内容则使用 CodeBlock
  if (code) {
    return (
      <CodeBlock code={code} language={language} showLineNumbers={true} className={className} />
    );
  }

  // 回退到原始 pre 元素
  return (
    <pre className={className} {...props}>
      {children}
    </pre>
  );
}

export default MDXPre;
