// 导入 cn 函数，该函数来自项目的 @/lib/utils 模块
import { cn } from "@/lib/utils";
// 导入 clsx 库，用于方便地组合类名
import clsx from "clsx";
// 从 react 库中导入 Children 和 PropsWithChildren 工具
import { Children, PropsWithChildren } from "react";

/**
 * Stepper 组件，用于展示一个步骤条
 * @param children - 包含多个 StepperItem 组件的子元素
 */
export function Stepper({ children }: PropsWithChildren) {
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
 * StepperItem 组件，用于展示步骤条中的单个步骤项
 * @param children - 步骤项的内容
 * @param title - 步骤项的标题，可选参数
 */
export function StepperItem({
  children,
  title,
}: PropsWithChildren & { title?: string }) {
  return (
    // 步骤项容器，设置顶部内边距
    <div className="pt-0.5">
      {/* 步骤项标题 */}
      <h4 className="mt-0">{title}</h4>
      {/* 渲染步骤项内容 */}
      <div>{children}</div>
    </div>
  );
}
