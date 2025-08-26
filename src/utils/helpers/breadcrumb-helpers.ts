/**
 * 面包屑相关工具函数
 *
 * 提供与面包屑导航相关的工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 格式化路径段为显示标签
 *
 * 将路径段转换为可读的标题格式，例如：
 * "blog-posts" -> "Blog Posts"
 * "user-profile" -> "User Profile"
 *
 * @param segment - 路径段
 * @returns 格式化后的标签
 */
export function formatSegmentLabel(segment: string): string {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * 生成面包屑导航数据
 */
export function generateBreadcrumbs(
  segments: string[],
  basePath = "",
  customLabels: Record<string, string> = {}
): { label: string; href?: string; isCurrent?: boolean }[] {
  const breadcrumbs: { label: string; href?: string; isCurrent?: boolean }[] = [
    {
      label: "首页",
      href: "/",
    },
  ];

  let currentPath = basePath;

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // 使用自定义标签或格式化segment
    const label = customLabels[segment] || formatSegmentLabel(segment);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isCurrent: isLast,
    });
  });

  return breadcrumbs;
}
