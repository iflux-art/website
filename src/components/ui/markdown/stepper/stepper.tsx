import { Children } from "react";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { StepperProps, StepperItemProps } from "./stepper.types";

/**
 * Stepper 组件
 * 用于展示一个步骤条
 */
export function Stepper({ children }: StepperProps) {
  // 计算子元素的数量
  const length = Children.count(children);

  return (
    // 外层容器，使用 flex 布局，垂直排列子元素
    <div className="flex flex-col">
      {/* 遍历子元素并渲染每个步骤项 */}
      {Children.map(children, (child, index) => {
        return (
          <div
            // 组合类名，根据是否为最后一个步骤项添加不同的样式
            className={cn(
              "border-l pl-9 ml-3 relative",
              clsx({
                "pb-5 ": index < length - 1,
              })
            )}
          >
            {/* 步骤序号容器，显示当前步骤的序号 */}
            <div className="bg-muted w-8 h-8 text-xs font-medium rounded-md border flex items-center justify-center absolute -left-4 font-code">
              {index + 1}
            </div>
            {/* 渲染子元素 */}
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * StepperItem 组件
 * 用于展示步骤条中的单个步骤
 */
export function StepperItem({ children }: StepperItemProps) {
  return <div>{children}</div>;
}
