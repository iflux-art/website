import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar } from "lucide-react";

import { mdxComponents } from "@/mdx-components";
import { AuthorCard } from "./author-card";

interface BlogContentProps {
  title: string;
  date: string | null;
  content: string;
  author: string;
  authorAvatar: string | null;
  authorBio: string;
}

/**
 * 博客内容组件
 * 用于显示博客文章的主要内容，包括标题、日期、正文和作者信息
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