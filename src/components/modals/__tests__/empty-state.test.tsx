import React from "react";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders with default props", () => {
    render(<EmptyState />);

    expect(screen.getByText("暂无内容")).toBeInTheDocument();
    expect(screen.getByText("当前没有相关内容")).toBeInTheDocument();
    expect(screen.getByLabelText("空状态图标")).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(<EmptyState title="自定义标题" description="自定义描述" />);

    expect(screen.getByText("自定义标题")).toBeInTheDocument();
    expect(screen.getByText("自定义描述")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    render(<EmptyState icon="🔍" />);

    const iconElement = screen.getByLabelText("空状态图标");
    expect(iconElement).toHaveTextContent("🔍");
  });

  it("renders with custom action", () => {
    const action = <button>重试</button>;
    render(<EmptyState action={action} />);

    expect(screen.getByRole("button", { name: "重试" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyState className="custom-class" />);
    const emptyStateElement = container.firstChild as HTMLElement;

    expect(emptyStateElement).toHaveClass("custom-class");
  });
});
