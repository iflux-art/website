import { UnifiedCard } from '@/components/common/cards/unified-card';

/**
 * 导航项属性
 */
export interface NavigationItemProps {
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 链接地址 */
  url: string;
  /** 图标 */
  icon?: string;
  /** 是否为特色项目 */
  featured?: boolean;
}

/**
 * 导航项组件
 *
 * @example
 * ```tsx
 * <UnifiedGrid columns={3}>
 *   <NavigationItem
 *     title="示例导航"
 *     description="这是一个示例导航项"
 *     url="https://example.com"
 *     icon="icon.svg"
 *     featured={true}
 *   />
 * </UnifiedGrid>
 * ```
 */
export function NavigationItem({
  title,
  description,
  url,
  icon,
  featured = false,
}: NavigationItemProps) {
  return (
    <UnifiedCard
      type="navigation"
      title={title}
      description={description}
      href={url}
      icon={icon}
      featured={featured}
      isExternal={true}
    />
  );
}
