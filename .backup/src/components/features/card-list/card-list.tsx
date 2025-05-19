/**
 * 卡片列表组件
 * 展示性能优化最佳实践：React.memo、useMemo、useCallback
 * 同时确保可访问性符合WCAG 2.1标准
 */
import React, { useState, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card/card";

// 从集中管理的类型定义中导入类型
import { CardProps } from "@/types";

interface CardItemProps extends CardProps {
  id: string;
  title: string;
  description: string;
  onClick?: (id: string) => void;
}

// 使用React.memo优化卡片项组件，避免不必要的重渲染
const CardItem = React.memo(
  ({ id, title, description, onClick, className }: CardItemProps) => {
    // 使用IntersectionObserver实现懒加载
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    // 使用useCallback优化事件处理函数
    const handleClick = useCallback(() => {
      if (onClick) onClick(id);
    }, [id, onClick]);

    return (
      <div
        ref={ref}
        className={cn(
          "transition-opacity duration-500",
          inView ? "opacity-100" : "opacity-0",
          className
        )}
      >
        {inView && (
          <Card
            className="p-4 h-full"
            onClick={handleClick}
            // 添加可访问性属性
            tabIndex={0}
            role="button"
            aria-label={`卡片: ${title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </Card>
        )}
      </div>
    );
  }
);

// 确保组件名称在开发工具中显示
CardItem.displayName = "CardItem";

interface CardListProps {
  items: CardItemProps[];
  onCardClick?: (id: string) => void;
  className?: string;
  filter?: string;
}

export function CardList({
  items,
  onCardClick,
  className,
  filter = "",
}: CardListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 使用useMemo优化过滤逻辑，避免不必要的重新计算
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.description.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // 使用useCallback优化卡片点击处理函数
  const handleCardClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (onCardClick) onCardClick(id);
    },
    [onCardClick]
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
      // 添加可访问性属性
      role="region"
      aria-label="卡片列表"
    >
      {filteredItems.length === 0 ? (
        <div
          className="col-span-full text-center py-8"
          role="status"
          aria-live="polite"
        >
          没有找到匹配的卡片
        </div>
      ) : (
        filteredItems.map((item) => (
          <CardItem
            key={item.id}
            {...item}
            onClick={handleCardClick}
            className={cn(
              selectedId === item.id && "ring-2 ring-primary",
              "h-full"
            )}
          />
        ))
      )}
    </div>
  );
}
