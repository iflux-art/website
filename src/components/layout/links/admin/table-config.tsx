import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink, Search } from 'lucide-react';
import type { TableColumn } from '@/components/layout/links/admin/data-table';
import type { LinksItem } from '@/types/links-types';

export const getTableColumns = (
  getCategoryName: (categoryId: string) => string
): TableColumn<LinksItem>[] => [
  {
    key: 'icon',
    title: '图标',
    width: '60px',
    render: (value, record, _index) => (
      <div className="text-lg">
        {record.iconType === 'emoji' ? (
          record.icon
        ) : record.iconType === 'image' ? (
          <img src={record.icon} alt="" className="w-6 h-6" />
        ) : (
          <span className="text-sm font-bold">{record.icon}</span>
        )}
      </div>
    ),
  },
  {
    key: 'title',
    title: '标题',
    render: (value, record, _index) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-muted-foreground">{record.url}</div>
      </div>
    ),
  },
  {
    key: 'category',
    title: '分类',
    render: (value, _record, _index) => (value ? getCategoryName(value as string) : '-'),
  },
  {
    key: 'tags',
    title: '标签',
    render: (value, _record, _index) => {
      const tags = value as string[];
      if (!tags?.length) return null;
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: 'featured',
    title: '状态',
    render: (value, _record, _index) =>
      (value as boolean) ? (
        <Badge variant="default">精选</Badge>
      ) : (
        <Badge variant="outline">普通</Badge>
      ),
  },
];

export const getTableActions = (
  onEdit: (record: LinksItem) => void,
  onDelete: (record: LinksItem) => void
) => [
  {
    label: '访问',
    onClick: (record: LinksItem) => window.open(record.url, '_blank'),
    icon: ExternalLink,
    variant: 'outline' as const,
  },
  {
    label: '编辑',
    onClick: onEdit,
    icon: Edit,
    variant: 'outline' as const,
  },
  {
    label: '删除',
    onClick: onDelete,
    icon: Trash2,
    variant: 'destructive' as const,
  },
];

export const getPageActions = (onAdd: () => void, onRefresh: () => void) => [
  {
    label: '添加网址',
    onClick: onAdd,
    icon: Plus,
  },
  {
    label: '刷新数据',
    onClick: onRefresh,
    icon: Search,
    variant: 'outline' as const,
  },
];
