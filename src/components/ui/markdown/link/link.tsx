import NextLink from "next/link";
import { LinkProps } from "./link.types";

/**
 * 自定义链接组件
 * 用于渲染带有特定属性的链接，支持外部链接和内部导航
 */
export default function Link({ href, ...props }: LinkProps) {
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
