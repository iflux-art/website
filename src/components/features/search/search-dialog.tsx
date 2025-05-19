"use client"

import * as React from "react";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SearchButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[90vw] sm:max-w-[600px]">
        <DialogTitle className="sr-only">搜索</DialogTitle>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="搜索内容..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>未找到相关内容</CommandEmpty>
            {SEARCH_CATEGORIES.map((category) => {
              // 过滤当前分类下的搜索结果
              const filteredItems = SEARCH_ITEMS.filter(
                (item) => 
                  item.category === category.id && 
                  (search === "" || 
                   item.title.toLowerCase().includes(search.toLowerCase())
                  )
              );
              
              // 如果该分类下没有匹配的结果，则不显示该分类
              if (filteredItems.length === 0) return null;
              
              return (
                <CommandGroup key={category.id} heading={category.labelKey}>
                  {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => {
                      window.location.href = item.url;
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <span className="mr-2 text-muted-foreground">
                          {React.createElement(item.icon, { size: 16 })}
                        </span>
                      )}
                      <span>{item.title}</span>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {item.shortcut && (
                        <kbd className="ml-auto">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}