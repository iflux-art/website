"use client"

import * as React from "react";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motion, AnimatePresence } from "framer-motion";
import { pulse } from "@/lib/animations";
import { useTranslations } from "@/hooks/use-translations";
import { useSearchParams } from 'next/navigation';
import { SEARCH_ITEMS, SEARCH_CATEGORIES } from "@/lib/constants";

/**
 * 搜索组件，点击弹出搜索框和推荐内容列表
 * 样式与语言切换和主题切换按钮保持一致
 */
export function SearchDialog() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'zh';
  const t = useTranslations();
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
        <Button
          variant="ghost"
          size="icon"
          title={t('search.title')}
          onClick={() => setOpen(true)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={pulse.animate}
            >
              <Search className="h-[1.1rem] w-[1.1rem]" />
            </motion.div>
          </AnimatePresence>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-[90vw] sm:max-w-[600px]">
        <DialogTitle className="sr-only">{t('search.title')}</DialogTitle>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder={t('search.placeholder')} 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{t('search.empty')}</CommandEmpty>
            {SEARCH_CATEGORIES.map((category) => (
              <CommandGroup key={category.id} heading={t(`search.categories.${category.id}`)}>
                {SEARCH_ITEMS.filter(
                  (item) => 
                    item.category === category.id && 
                    (search === "" || 
                     t(`search.items.${item.id}.title`).toLowerCase().includes(search.toLowerCase())
                    )
                ).map((item) => (
                  <CommandItem
                    key={item.id}
                    value={t(`search.items.${item.id}.title`)}
                    onSelect={() => {
                      window.location.href = `/${lang}${item.href}`;
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <span className="mr-2 text-muted-foreground">
                          {React.createElement(item.icon, { size: 16 })}
                        </span>
                      )}
                      <span>{t(`search.items.${item.id}.title`)}</span>
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
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}