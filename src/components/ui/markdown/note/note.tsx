import { cn } from "@/lib/utils";
import clsx from "clsx";
import { NoteProps } from "./note.types";

/**
 * Note 组件
 * 用于在文档中显示提示、警告、错误等信息，与Callout类似但样式不同
 */
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
