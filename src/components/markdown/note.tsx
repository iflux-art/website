// 导入 cn 函数，来自 @/lib/utils 模块
import { cn } from "@/lib/utils";
// 导入 clsx 库，用于合并类名
import clsx from "clsx";
// 导入 React 中的 PropsWithChildren 类型
import { PropsWithChildren } from "react";

// 定义 Note 组件的属性类型
type NoteProps = PropsWithChildren & {
  // 可选的标题属性
  title?: string;
  // 可选的类型属性，限定为四种值
  type?: "note" | "danger" | "warning" | "success";
};

// 定义 Note 组件
export default function Note({
  // 组件的子元素
  children,
  // 标题的默认值为 "Note"
  title = "Note",
  // 类型的默认值为 "note"
  type = "note",
}: NoteProps) {
  // 根据不同的类型生成对应的类名
  const noteClassNames = clsx({
    // 当类型为 "note" 时应用的类名
    "dark:bg-stone-950/25 bg-stone-50": type == "note",
    // 当类型为 "danger" 时应用的类名
    "dark:bg-red-950 bg-red-100 border-red-200 dark:border-red-900":
      type === "danger",
    // 当类型为 "warning" 时应用的类名
    "dark:bg-orange-950 bg-orange-100 border-orange-200 dark:border-orange-900":
      type === "warning",
    // 当类型为 "success" 时应用的类名
    "dark:bg-green-950 bg-green-100 border-green-200 dark:border-green-900":
      type === "success",
  });

  return (
    <div
      // 合并基础类名和根据类型生成的类名
      className={cn(
        "border rounded-md px-5 pb-0.5 mt-5 mb-7 text-sm tracking-wide",
        noteClassNames
      )}
    >
      {/* 显示标题 */}
      <p className="font-bold -mb-2.5">{title}:</p> 
      {/* 显示组件的子元素 */}
      {children}
    </div>
  );
}
