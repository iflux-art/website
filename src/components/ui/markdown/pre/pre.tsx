import Copy from "@/components/ui/markdown/copy";
import { PreProps } from "./pre.types";

/**
 * Pre 组件
 * 用于渲染带有复制功能的代码块
 */
export default function Pre({
  children,
  raw,
  ...rest
}: PreProps) {
  // 返回一个包含复制按钮和代码块的容器元素
  return (
    // 外层容器，设置外边距和相对定位，使用 group 类以便实现悬停效果
    <div className="my-5 relative group">
      {/* 复制按钮容器，绝对定位在右上角，初始透明度为 0，悬停时显示 */}
      <div className="absolute top-3 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* 渲染 Copy 组件，并传递原始代码内容 */}
        <Copy content={raw!} />
      </div>
      {/* 代码块容器，设置相对定位 */}
      <div className="relative">
        {/* 渲染 pre 元素，并传递其他属性和代码内容 */}
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  );
}
