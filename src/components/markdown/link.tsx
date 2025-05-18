// 导入 Next.js 的 Link 组件
import NextLink from "next/link";
// 导入 React 的 ComponentProps 类型
import { ComponentProps } from "react";

/**
 * 自定义链接组件，用于渲染带有特定属性的链接。
 * 如果没有提供 href 属性，则不渲染任何内容。
 * 
 * @param {ComponentProps<'a'>} props - 链接组件的属性，包含 href 和其他通用属性。
 * @param {string} props.href - 链接的目标地址。
 */
export default function Link({ href, ...props }: ComponentProps<"a">) {
  // 如果没有提供 href 属性，则返回 null，不渲染任何内容
  if (!href) return null;
  // 渲染 Next.js 的 Link 组件，并设置目标窗口为新窗口，防止安全风险
  return (
    <NextLink
      href={href}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    />
  );
}
