"use client"

import * as React from "react";
import Link from "next/link";
import { Search } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

import { SEARCH_ITEMS, SEARCH_CATEGORIES } from "@/lib/constants";

/**
 * 搜索图标按钮组件
 * 样式与语言切换和主题切换按钮保持一致
 */
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="搜索"
      onClick={onClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Search className="h-[1.1rem] w-[1.1rem]" />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

/**
 * 搜索对话框组件
 * 点击搜索按钮后弹出的搜索框和推荐内容列表
 */
export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // 键盘快捷键打开搜索框
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 处理搜索项点击
  const handleItemClick = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  // 过滤搜索结果
  const getFilteredItems = () => {
    if (!search.trim()) {
      // 如果没有搜索词，返回所有项目
      return SEARCH_ITEMS;
    }

    // 否则过滤匹配的项目
    const searchTerm = search.toLowerCase().trim();

    // 添加调试信息
    console.log('搜索词:', searchTerm);
    console.log('所有项目:', SEARCH_ITEMS);

    const filtered = SEARCH_ITEMS.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const titleEnMatch = item.titleEn?.toLowerCase().includes(searchTerm);
      const match = titleMatch || titleEnMatch;

      // 调试每个项目的匹配情况
      console.log(`项目 "${item.title}" 匹配: ${match}`);

      return match;
    });

    // 调试过滤后的结果
    console.log('过滤后的项目:', filtered);

    return filtered;
  };

  // 按分类组织搜索结果
  const getGroupedItems = () => {
    const filteredItems = getFilteredItems();
    const groupedItems: Record<string, typeof SEARCH_ITEMS> = {};

    // 初始化分类
    SEARCH_CATEGORIES.forEach(category => {
      groupedItems[category.id] = [];
    });

    // 按分类分组
    filteredItems.forEach(item => {
      if (groupedItems[item.category]) {
        groupedItems[item.category].push(item);
      }
    });

    return groupedItems;
  };

  const groupedItems = getGroupedItems();
  const hasResults = Object.values(groupedItems).some(group => group.length > 0);

  // 调试分组和结果状态
  console.log('分组后的项目:', groupedItems);
  console.log('是否有结果:', hasResults);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SearchButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[90vw] sm:max-w-[600px]">
        <DialogTitle className="sr-only">搜索</DialogTitle>
        <div className="rounded-lg border shadow-md bg-background">
          {/* 搜索输入框 */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="搜索内容..."
              value={search}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('输入值变化:', newValue);
                setSearch(newValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 如果按下回车键，尝试导航到第一个结果
                  const allItems = Object.values(groupedItems).flat();
                  if (allItems.length > 0) {
                    handleItemClick(allItems[0].url);
                  }
                }
              }}
              autoFocus
            />
          </div>

          {/* 搜索结果列表 */}
          <div className="max-h-[300px] overflow-y-auto p-2">
            {/* 显示所有搜索项目，无论是否有搜索词 */}
            {SEARCH_CATEGORIES.map(category => {
              const items = groupedItems[category.id] || [];

              // 如果该分类下没有项目，则不显示该分类
              if (items.length === 0) {
                return null;
              }

              return (
                <div key={category.id} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category.labelKey}
                  </div>
                  <div>
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleItemClick(item.url)}
                      >
                        <div className="flex items-center">
                          {item.icon && (
                            <span className="mr-2 text-muted-foreground">
                              {typeof item.icon === 'function'
                                ? React.createElement(item.icon, { size: 16 })
                                : item.icon}
                            </span>
                          )}
                          <span>{item.title}</span>
                        </div>
                        {item.shortcut && (
                          <kbd className="ml-auto text-xs text-muted-foreground">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 如果没有任何结果，显示提示信息 */}
            {!hasResults && (
              <div className="py-6 text-center text-sm">未找到相关内容</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}