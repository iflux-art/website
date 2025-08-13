import React from "react";
import { render, screen } from "@testing-library/react";
import { ArticleGrid } from "../article-grid";
import type { BlogPost } from "@/features/blog/types";

import { vi } from "vitest";

// Mock BlogCard component
vi.mock("@/features/blog/components", () => ({
  BlogCard: ({ title, href }: { title: string; href: string }) => (
    <div data-testid="blog-card">
      <a href={href}>{title}</a>
    </div>
  ),
}));

const mockPosts: BlogPost[] = [
  {
    slug: "test-post-1",
    title: "Test Post 1",
    description: "Test description 1",
    excerpt: "Test excerpt 1",
    date: "2024-01-01",
    tags: ["react", "typescript"],
    category: "技术",
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    description: "Test description 2",
    excerpt: "Test excerpt 2",
    date: "2024-01-02",
    tags: ["javascript"],
    category: "教程",
  },
];

describe("ArticleGrid", () => {
  it("renders articles in grid layout", () => {
    render(<ArticleGrid posts={mockPosts} />);

    expect(screen.getAllByTestId("blog-card")).toHaveLength(2);
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = render(<ArticleGrid posts={mockPosts} />);
    const gridElement = container.firstChild as HTMLElement;

    expect(gridElement).toHaveClass("grid");
    expect(gridElement).toHaveClass("grid-cols-1");
    expect(gridElement).toHaveClass("sm:grid-cols-2");
    expect(gridElement).toHaveClass("md:grid-cols-3");
    expect(gridElement).toHaveClass("lg:grid-cols-4");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ArticleGrid posts={mockPosts} className="custom-class" />,
    );
    const gridElement = container.firstChild as HTMLElement;

    expect(gridElement).toHaveClass("custom-class");
  });

  it("renders empty grid when no posts", () => {
    const { container } = render(<ArticleGrid posts={[]} />);
    const gridElement = container.firstChild as HTMLElement;

    expect(gridElement).toBeInTheDocument();
    expect(screen.queryByTestId("blog-card")).not.toBeInTheDocument();
  });
});
