import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "../loading-state";

describe("LoadingState", () => {
  it("renders with default props", () => {
    render(<LoadingState />);

    expect(screen.getByText("加载中...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<LoadingState text="正在处理..." />);

    expect(screen.getByText("正在处理...")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(<LoadingState showText={false} />);

    expect(screen.queryByText("加载中...")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies different sizes", () => {
    const { rerender, container } = render(<LoadingState size="small" />);
    let spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toHaveClass("h-4", "w-4");

    rerender(<LoadingState size="medium" />);
    spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toHaveClass("h-6", "w-6");

    rerender(<LoadingState size="large" />);
    spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("applies custom className", () => {
    const { container } = render(<LoadingState className="custom-class" />);
    const loadingElement = container.firstChild as HTMLElement;

    expect(loadingElement).toHaveClass("custom-class");
  });

  it("has proper accessibility attributes", () => {
    render(<LoadingState text="正在加载数据" />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toHaveAttribute("aria-live", "polite");
    expect(statusElement).toHaveAttribute("aria-label", "正在加载数据");
  });
});
