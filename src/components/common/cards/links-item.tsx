import { UnifiedCard } from '@/components/common/cards/unified-card';

/**
 * 链接项属性
 */
export interface LinksItemProps {
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
 * 链接项组件
 *
 * @example
 * ```tsx
 * <UnifiedGrid columns={3}>
 *   <LinksItem
 *     title="示例链接"
 *     description="这是一个示例链接项"
 *     url="https://example.com"
 *     icon="icon.svg"
 *     featured={true}
 *   />
 * </UnifiedGrid>
 * ```
 */
export function LinksItem({ title, description, url, icon, featured = false }: LinksItemProps) {
  return (
    <UnifiedCard
      type="link"
      title={title}
      description={description}
      href={url}
      icon={icon}
      featured={featured}
      isExternal={true}
    />
  );
}
