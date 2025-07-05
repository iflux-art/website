import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import type { TableColumn } from '@/components/layout/links/admin/data-table';
import type { LinksItem } from '@/types';

export const getTableColumns = (
  getCategoryName: (categoryId: string) => string
): TableColumn<LinksItem>[] => [
  {
    key: 'icon',
    title: '图标',
    width: '44px', // 更窄
    render: (value, record, _index) => {
      const icon = record.icon;
      const iconType = record.iconType;
      const isEmoji = typeof icon === 'string' && icon.length <= 3 && /[\p{Emoji}]/u.test(icon);
      const isImage = typeof icon === 'string' && /^https?:\/\//.test(icon);
      return (
        <div className="w-10 h-10 flex items-center justify-center mx-auto">
          {iconType === 'emoji' || isEmoji ? (
            <span className="text-xl">{icon}</span>
          ) : iconType === 'image' || isImage ? (
            <img src={icon} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <span className="text-sm font-bold">{icon}</span>
          )}
        </div>
      );
    },
  },
  {
    key: 'title',
    title: '标题',
    width: '450px',
    render: (value, record, _index) => (
      <div>
        <div className="font-medium">{String(value)}</div>
        <div className="text-sm text-muted-foreground truncate max-w-[300px]">{record.url}</div>
      </div>
    ),
  },
  {
    key: 'category',
    title: '分类',
    width: '120px',
    render: (value, _record, _index) => (value ? getCategoryName(value as string) : '-'),
  },
  {
    key: 'tags',
    title: '标签',
    width: '350px',
    render: (value, _record, _index) => {
      const tags = value as string[];
      if (!tags?.length) return null;
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs px-2">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2">
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
    width: '100px',
    render: (value, _record, _index) =>
      (value as boolean) ? (
        <Badge variant="default" className="text-xs px-2">
          精选
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs px-2">
          普通
        </Badge>
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
    icon: RefreshCw,
    variant: 'outline' as const,
  },
];
