/**
 * 卡片列表组件单元测试
 * 测试性能优化组件的功能性和可访问性
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { CardList } from "./card-list";

// 扩展Jest匹配器以支持可访问性测试
expect.extend(toHaveNoViolations);

// 测试数据
const mockItems = [
  { id: "1", title: "卡片一", description: "这是第一张卡片的描述" },
  { id: "2", title: "卡片二", description: "这是第二张卡片的描述" },
  { id: "3", title: "卡片三", description: "这是第三张卡片的描述" },
];

describe("CardList 组件", () => {
  // 测试基本渲染
  test("正确渲染卡片列表", () => {
    render(<CardList items={mockItems} />);

    // 检查卡片是否正确渲染
    expect(screen.getByText("卡片一")).toBeInTheDocument();
    expect(screen.getByText("卡片二")).toBeInTheDocument();
    expect(screen.getByText("卡片三")).toBeInTheDocument();
  });

  // 测试过滤功能
  test("过滤功能正常工作", () => {
    render(<CardList items={mockItems} filter="一" />);

    // 应该只显示包含"一"的卡片
    expect(screen.getByText("卡片一")).toBeInTheDocument();
    expect(screen.queryByText("卡片二")).not.toBeInTheDocument();
    expect(screen.queryByText("卡片三")).not.toBeInTheDocument();
  });

  // 测试点击事件
  test("点击卡片触发回调函数", () => {
    const handleClick = jest.fn();
    render(<CardList items={mockItems} onCardClick={handleClick} />);

    // 点击第一张卡片
    fireEvent.click(screen.getByText("卡片一"));

    // 验证回调函数被调用，且参数正确
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith("1");
  });

  // 测试键盘导航
  test("支持键盘导航和交互", () => {
    const handleClick = jest.fn();
    render(<CardList items={mockItems} onCardClick={handleClick} />);

    // 获取第一张卡片
    const firstCard = screen.getByText("卡片一").closest('[role="button"]');
    expect(firstCard).toHaveAttribute("tabIndex", "0");

    // 模拟键盘Enter键按下
    fireEvent.keyDown(firstCard!, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledWith("1");

    // 模拟键盘空格键按下
    fireEvent.keyDown(firstCard!, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // 测试可访问性
  test("卡片列表符合可访问性标准", async () => {
    const { container } = render(<CardList items={mockItems} />);

    // 使用jest-axe测试可访问性
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 测试空状态
  test("当没有匹配项时显示空状态消息", () => {
    render(<CardList items={mockItems} filter="不存在的文本" />);

    // 应该显示空状态消息
    expect(screen.getByText("没有找到匹配的卡片")).toBeInTheDocument();

    // 确保没有卡片被渲染
    expect(screen.queryByText("卡片一")).not.toBeInTheDocument();
    expect(screen.queryByText("卡片二")).not.toBeInTheDocument();
    expect(screen.queryByText("卡片三")).not.toBeInTheDocument();
  });

  // 测试ARIA属性
  test("包含正确的ARIA属性", () => {
    render(<CardList items={mockItems} />);

    // 检查区域标签
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "卡片列表"
    );

    // 检查卡片的可访问性
    const cards = screen.getAllByRole("button");
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute("aria-label", "卡片: 卡片一");
  });
});
