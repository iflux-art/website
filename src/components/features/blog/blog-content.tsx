import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar } from "lucide-react";

import { mdxComponents } from "@/mdx-components";
import { AuthorCard } from "./author-card";

/**
 * 博客内容组件属性
 *
 * @interface BlogContentProps
 */
interface BlogContentProps {
  /**
   * 文章标题
   */
  title: string;

  /**
   * 发布日期
   */
  date: string | null;

  /**
   * 文章内容（MDX 格式）
   */
  content: string;

  /**
   * 作者名称
   */
  author: string;

  /**
   * 作者头像 URL
   */
  authorAvatar: string | null;

  /**
   * 作者简介
   */
  authorBio: string;
}

/**
 * 博客内容组件
 *
 * 用于显示博客文章的主要内容，包括标题、日期、正文和作者信息
 *
 * @param {BlogContentProps} props - 组件属性
 * @returns {JSX.Element} 博客内容组件
 *
 * @example
 * ```tsx
 * <BlogContent
 *   title="Hello World"
 *   date="2023-01-01"
 *   content="# Hello World\n\nThis is my first blog post"
 *   author="Bowie"
 *   authorAvatar="/images/bowie.jpg"
 *   authorBio="iflux.art | 斐流艺创"
 * />
 * ```
 */
export function BlogContent({
  title,
  date,
  content,
  author,
  authorAvatar,
  authorBio,
}: BlogContentProps) {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <time>{date}</time>
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      <AuthorCard
        author={author}
        authorAvatar={authorAvatar}
        authorBio={authorBio}
      />
    </article>
  );
}