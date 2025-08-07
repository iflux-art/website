import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LinksContent } from "../links-content";
import { LinksItem } from "@/types/links-types";

const mockItems: LinksItem[] = [
  {
    id: "1",
    title: "React 官网",
    description: "用于构建用户界面的 JavaScript 库",
    url: "https://react.dev",
    icon: "",
    iconType: "text",
    tags: ["前端", "框架"],
    featured: false,
    category: "development",
  },
  {
    id: "2",
    title: "Vue.js",
    description: "渐进式 JavaScript 框架",
    url: "https://vuejs.org",
    icon: "",
    iconType: "text",
    tags: ["前端", "框架"],
    featured: false,
    category: "development",
  },
  {
    id: "3",
    title: "VS Code",
    description: "轻量级代码编辑器",
    url: "https://code.visualstudio.com",
    icon: "",
    iconType: "text",
    tags: ["工具", "编辑器"],
    featured: false,
    category: "development",
  },
];

describe("LinksContent", () => {
  it("should render links grouped by tags", () => {
    render(<LinksContent items={mockItems} />);

    // 检查标签标题
    expect(screen.getByText("前端")).toBeInTheDocument();
    expect(screen.getByText("框架")).toBeInTheDocument();
    expect(screen.getByText("工具")).toBeInTheDocument();
    expect(screen.getByText("编辑器")).toBeInTheDocument();

    // 检查链接卡片（使用 getAllByText 因为有些链接会在多个标签下出现）
    expect(screen.getAllByText("React 官网")).toHaveLength(2); // 出现在"前端"和"框架"标签下
    expect(screen.getAllByText("Vue.js")).toHaveLength(2); // 出现在"前端"和"框架"标签下
    expect(screen.getAllByText("VS Code")).toHaveLength(2); // 出现在"工具"和"编辑器"标签下
  });

  it("should generate correct anchor IDs for tags", () => {
    render(<LinksContent items={mockItems} />);

    const frontendHeading = screen.getByText("前端");
    expect(frontendHeading).toHaveAttribute("id", "tag-前端");

    const frameworkHeading = screen.getByText("框架");
    expect(frameworkHeading).toHaveAttribute("id", "tag-框架");
  });

  it("should sort tags alphabetically in Chinese", () => {
    render(<LinksContent items={mockItems} />);

    const headings = screen.getAllByRole("heading", { level: 2 });
    const tagTexts = headings.map((h) => h.textContent);

    // 应该按中文排序：编辑器、工具、框架、前端
    expect(tagTexts).toEqual(["编辑器", "工具", "框架", "前端"]);
  });

  it("should show empty state when no items", () => {
    render(<LinksContent items={[]} />);

    expect(screen.getByText("暂无链接")).toBeInTheDocument();
    expect(screen.getByText("没有找到任何链接")).toBeInTheDocument();
  });

  it("should show category-specific empty state", () => {
    render(<LinksContent items={[]} selectedCategory="ai" />);

    expect(screen.getByText("暂无链接")).toBeInTheDocument();
    expect(screen.getByText("当前分类下没有链接")).toBeInTheDocument();
  });

  it("should handle items with empty or invalid tags", () => {
    const itemsWithInvalidTags: LinksItem[] = [
      {
        id: "1",
        title: "Test Item",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["有效标签", "", "   ", null as any, undefined as any],
        featured: false,
        category: "development",
      },
    ];

    render(<LinksContent items={itemsWithInvalidTags} />);

    // 只应该显示有效的标签
    expect(screen.getByText("有效标签")).toBeInTheDocument();
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("should handle items without tags", () => {
    const itemsWithoutTags: LinksItem[] = [
      {
        id: "1",
        title: "No Tags Item",
        description: "Item without tags",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: [],
        featured: false,
        category: "development",
      },
    ];

    render(<LinksContent items={itemsWithoutTags} />);

    // 应该显示空状态
    expect(screen.getByText("暂无链接")).toBeInTheDocument();
  });

  it("should deduplicate items across multiple tags", () => {
    const itemWithMultipleTags: LinksItem[] = [
      {
        id: "1",
        title: "Multi-tag Item",
        description: "Item with multiple tags",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["标签A", "标签B"],
        featured: false,
        category: "development",
      },
    ];

    render(<LinksContent items={itemWithMultipleTags} />);

    // 项目应该在两个标签下都出现
    expect(screen.getByText("标签A")).toBeInTheDocument();
    expect(screen.getByText("标签B")).toBeInTheDocument();

    // 但是项目本身应该出现两次（在不同的标签组下）
    const itemElements = screen.getAllByText("Multi-tag Item");
    expect(itemElements).toHaveLength(2);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <LinksContent items={mockItems} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should handle complex tag names with special characters", () => {
    const itemsWithComplexTags: LinksItem[] = [
      {
        id: "1",
        title: "Complex Tags Item",
        description: "Item with complex tag names",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["Vue.js", "Node.js", "C++", "AI/ML"],
        featured: false,
        category: "development",
      },
    ];

    render(<LinksContent items={itemsWithComplexTags} />);

    // 检查复杂标签名称
    expect(screen.getByText("Vue.js")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("C++")).toBeInTheDocument();
    expect(screen.getByText("AI/ML")).toBeInTheDocument();

    // 检查锚点 ID
    const vueHeading = screen.getByText("Vue.js");
    expect(vueHeading).toHaveAttribute("id", "tag-vue.js");

    const aiHeading = screen.getByText("AI/ML");
    expect(aiHeading).toHaveAttribute("id", "tag-ai/ml");
  });
});
