"use client";
import * as React from "react";
import { useMemo } from "react";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { MDXComponents } from "packages/ui/components/mdx/mdx-components";
import { evaluateSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

export const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
};

export const mdxRehypePlugins = [[rehypePrettyCode, prettyCodeOptions]];

interface Props {
  content: string;
}

export default function ClientMDXRenderer({ content }: Props) {
  const MDXContent = useMemo(() => {
    try {
      // 先去除 frontmatter
      const { content: pureContent } = matter(content);
      // 编译为 React 组件
      const mdxModule = evaluateSync(pureContent, {
        ...runtime,
        useMDXComponents,
        remarkPlugins: [remarkGfm], // 支持 GFM 表格等扩展
      });
      return mdxModule.default;
    } catch (e) {
      console.error("[MDX 编译失败]", e, content.slice(0, 200));
      return null;
    }
  }, [content]);

  if (!MDXContent) {
    return <div className="text-red-500">MDX 解析失败，请检查内容格式</div>;
  }

  return (
    <MDXProvider components={MDXComponents}>
      <MDXContent />
    </MDXProvider>
  );
}
