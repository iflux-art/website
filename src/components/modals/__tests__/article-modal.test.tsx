/**
 * ArticleModal 组件测试
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ArticleModal } from "../article-modal";
import type { BlogPost } from "@/features/blog/types";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// 测试用的文章数据
const mockPosts: BlogPost[] = [
  {
    slug: "test-post-1",
    title: "测试文章 1",
    description: "这是第一篇测试文章",
    excerpt: "测试摘要 1",
    tags: ["React", "TypeScript"],
    date: "2024-01-01",
    category: "技术",
    author: "测试作者",
  },
  {
    slug: "test-post-2",
    title: "测试文章 2",
    description: "这是第二篇测试文章",
    excerpt: "测试摘要 2",
    tags: ["Vue", "JavaScript"],
    date: "2024-01-02",
    category: "技术",
    author: "测试作者",
  },
];

describe("ArticleModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "技术分类",
    posts: mockPosts,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该正确渲染模态对话框", () => {
    render(<ArticleModal {...defaultProps} />);

    expect(screen.getByText("技术分类")).toBeInTheDocument();
    expect(screen.getByText("(2 篇文章)")).toBeInTheDocument();
    expect(screen.getByText("测试文章 1")).toBeInTheDocument();
    expect(screen.getByText("测试文章 2")).toBeInTheDocument();
  });

  it("应该在加载状态时显示加载指示器", () => {
    render(<ArticleModal {...defaultProps} isLoading={true} />);

    expect(screen.getByText("加载中...")).toBeInTheDocument();
  });

  it("应该在没有文章时显示空状态", () => {
    render(<ArticleModal {...defaultProps} posts={[]} />);

    expect(screen.getByText("暂无文章")).toBeInTheDocument();
    expect(screen.getByText("技术分类暂时没有相关文章")).toBeInTheDocument();
  });

  it("应该在出错时显示错误状态", () => {
    render(<ArticleModal {...defaultProps} error="网络错误" />);

    expect(screen.getByText("加载失败")).toBeInTheDocument();
    expect(screen.getByText("网络错误")).toBeInTheDocument();
  });

  it("应该在点击关闭按钮时调用 onClose", () => {
    const onClose = vi.fn();
    render(<ArticleModal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("应该在模态对话框关闭时不渲染内容", () => {
    render(<ArticleModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("技术分类")).not.toBeInTheDocument();
  });

  it("应该正确处理标签点击事件", () => {
    const onTagClick = vi.fn();
    render(<ArticleModal {...defaultProps} onTagClick={onTagClick} />);

    const reactTag = screen.getByText("React");
    fireEvent.click(reactTag);

    expect(onTagClick).toHaveBeenCalledWith("React");
  });
});
