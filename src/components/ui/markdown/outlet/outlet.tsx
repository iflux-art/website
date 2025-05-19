import { BaseMdxFrontmatter, getAllChilds } from "@/lib/markdown";
import Link from "next/link";
import { OutletProps } from "./outlet.types";

/**
 * Outlet 组件
 * 用于渲染路径下的子项卡片列表
 */
export default async function Outlet({ path }: OutletProps) {
  // 检查路径是否提供，如果未提供则抛出错误
  if (!path) throw new Error("path not provided");
  // 异步调用 getAllChilds 方法获取指定路径下的所有子项
  const output = await getAllChilds(path);

  return (
    // 使用网格布局，在中等屏幕及以上时分为两列，项之间有 5 单位的间距
    <div className="grid md:grid-cols-2 gap-5">
      {/* 遍历子项数组并渲染每个子项的卡片组件 */}
      {output.map((child) => (
        <ChildCard {...child} key={child.title} />
      ))}
    </div>
  );
}

// 定义 ChildCard 组件的属性类型，继承 BaseMdxFrontmatter 并添加 href 属性
type ChildCardProps = BaseMdxFrontmatter & { href: string };

/**
 * 子项卡片组件
 * 用于显示子项的标题和描述，并提供链接
 */
function ChildCard({ description, href, title }: ChildCardProps) {
  return (
    // 使用 Link 组件创建链接
    <Link
      href={href}
      className="border rounded-md p-4 no-underline flex flex-col gap-0.5"
    >
      {/* 显示子项标题，设置外边距为 0 */}
      <h4 className="!my-0">{title}</h4>
      {/* 显示子项描述，设置字体大小为小，颜色为次要前景色，外边距为 0 */}
      <p className="text-sm text-muted-foreground !my-0">{description}</p>
    </Link>
  );
}
