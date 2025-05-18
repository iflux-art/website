// 导入 React 中的 PropsWithChildren 类型
import { PropsWithChildren } from "react";

/**
 * Typography 组件，用于渲染带有特定样式的文本内容
 * @param children - 要渲染的子元素
 */
export function Typography({ children }: PropsWithChildren) {
  // 返回一个带有特定类名的 div 元素，用于应用样式并渲染子元素
  return (
    <div className="prose prose-zinc dark:prose-invert prose-code:font-normal prose-code:font-code dark:prose-code:bg-stone-900/25 prose-code:bg-stone-50 prose-pre:bg-background prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-white prose-code:text-stone-800 prose-code:p-[0.085rem]  prose-code:rounded-md prose-code:border pt-2 !min-w-full prose-img:rounded-md prose-img:border prose-code:before:content-none prose-code:after:content-none prose-code:px-1.5 prose-code:overflow-x-auto !max-w-[500px] prose-img:my-3 prose-h2:my-4 prose-h2:mt-8">
      {children}
    </div>
  );
}
