"use client";
import { MDXComponents } from "@/components/mdx/mdx-components";
import { evaluateSync } from "@mdx-js/mdx";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import matter from "gray-matter";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
};

export const mdxRehypePlugins = [[rehypePrettyCode, prettyCodeOptions]];

interface Props {
  content: string;
}

const ClientMDXRenderer = ({ content }: Props) => {
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
    } catch {
      // MDX compilation failed
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
};

export default ClientMDXRenderer;
