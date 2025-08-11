import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { LinksSidebar } from "../links-sidebar";
import { LinksCategory } from "@/features/links/types";

const mockCategories: LinksCategory[] = [
  {
    id: "development",
    name: "技术",
    description: "技术相关",
    order: 1,
  },
  {
    id: "design",
    name: "设计",
    description: "设计相关",
    order: 2,
  },
  {
    id: "friends",
    name: "友链",
    description: "友情链接",
    order: 3,
  },
  {
    id: "profile",
    name: "个人主页",
    description: "个人主页",
    order: 4,
  },
];

describe("LinksSidebar", () => {
  const mockOnCategoryChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render categories as top-level items without collapsible wrapper", () => {
    render(
      <LinksSidebar
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    // Should show "全部分类" as top-level item
    expect(screen.getByText("全部分类")).toBeInTheDocument();

    // Should show categories as top-level items
    expect(screen.getByText("技术")).toBeInTheDocument();
    expect(screen.getByText("设计")).toBeInTheDocument();

    // Should filter out friends and profile categories
    expect(screen.queryByText("友链")).not.toBeInTheDocument();
    expect(screen.queryByText("个人主页")).not.toBeInTheDocument();

    // Should NOT have collapsible wrapper with "分类导航" title
    expect(screen.queryByText("分类导航")).not.toBeInTheDocument();
  });

  it("should handle category selection correctly", () => {
    render(
      <LinksSidebar
        categories={mockCategories}
        selectedCategory="development"
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    // Tech category should be selected (highlighted)
    const techButton = screen.getByText("技术").closest("button");
    expect(techButton).toHaveClass("bg-accent");

    // Click on design category
    const designButton = screen.getByText("设计").closest("button");
    fireEvent.click(designButton!);

    expect(mockOnCategoryChange).toHaveBeenCalledWith("design");
  });

  it("should handle 'all categories' selection", () => {
    render(
      <LinksSidebar
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    // "全部分类" should be selected when no category is selected
    const allButton = screen.getByText("全部分类").closest("button");
    expect(allButton).toHaveClass("bg-accent");

    // Click on "全部分类"
    fireEvent.click(allButton!);

    expect(mockOnCategoryChange).toHaveBeenCalledWith("");
  });

  it("should sort categories by order", () => {
    const unsortedCategories: LinksCategory[] = [
      { id: "design", name: "设计", description: "设计相关", order: 3 },
      { id: "development", name: "技术", description: "技术相关", order: 1 },
      { id: "productivity", name: "工具", description: "工具相关", order: 2 },
    ];

    render(
      <LinksSidebar
        categories={unsortedCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    // First button should be "全部分类", then categories in order
    expect(buttons[0]).toHaveTextContent("全部分类");
    expect(buttons[1]).toHaveTextContent("技术"); // order: 1
    expect(buttons[2]).toHaveTextContent("工具"); // order: 2
    expect(buttons[3]).toHaveTextContent("设计"); // order: 3
  });

  it("should show category description as tooltip", () => {
    render(
      <LinksSidebar
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    const techButton = screen.getByText("技术").closest("button");
    expect(techButton).toHaveAttribute("title", "技术相关");
  });
});
