"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";

type DocItem = {
  title: string;
  href?: string;
  items?: DocItem[];
};

type DocMeta = {
  [key: string]: {
    title: string;
    items?: string[];
  };
};

interface DocsSidebarProps {
  lang: string;
  category: string;
  currentDoc?: string;
  meta?: DocMeta;
  allDocs?: {
    slug: string;
    title: string;
    path: string;
  }[];
}

export function DocsSidebar({ category, currentDoc, meta, allDocs = [] }: DocsSidebarProps) {
  const pathname = usePathname();
  const [items, setItems] = useState<DocItem[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // 初始化打开的分类
  useEffect(() => {
    if (currentDoc) {
      // 如果有当前文档，确保其所在分类是打开的
      const parts = currentDoc.split("/");
      if (parts.length > 1) {
        const parentKey = parts.slice(0, -1).join("/");
        setOpenCategories(prev => ({ ...prev, [parentKey]: true }));
      }
    }
  }, [currentDoc]);

  // 根据meta和allDocs构建侧边栏结构
  useEffect(() => {
    if (!meta && allDocs.length > 0) {
      // 如果没有meta配置，直接使用allDocs列表
      setItems(allDocs.map(doc => ({
        title: doc.title,
        href: doc.path
      })));
      return;
    }

    if (meta) {
      // 如果有meta配置，按照meta的结构组织文档
      const categoryMeta = meta[category];
      if (categoryMeta && categoryMeta.items) {
        const newItems: DocItem[] = [];

        categoryMeta.items.forEach(item => {
          if (typeof item === "string") {
            // 如果是字符串，查找对应的文档
            const doc = allDocs.find(d => d.slug === item);
            if (doc) {
              newItems.push({
                title: doc.title,
                href: doc.path
              });
            }
          } else if (typeof item === "object") {
            // 如果是对象，表示是一个子分类
            const key = Object.keys(item)[0];
            const subCategory = item[key];

            const subItems: DocItem[] = [];
            if (Array.isArray(subCategory)) {
              subCategory.forEach(subItem => {
                const doc = allDocs.find(d => d.slug === subItem);
                if (doc) {
                  subItems.push({
                    title: doc.title,
                    href: doc.path
                  });
                }
              });
            }

            if (subItems.length > 0) {
              newItems.push({
                title: key,
                items: subItems
              });
            }
          }
        });

        setItems(newItems);
      }
    }
  }, [meta, allDocs, category]);

  // 使用 onOpenChange 处理程序替代此函数

  const renderItems = (items: DocItem[], level = 0) => {
    return items.map((item, index) => {
      const isActive = item.href ? pathname === item.href : false;
      const hasChildren = item.items && item.items.length > 0;
      const isOpen = hasChildren ? openCategories[item.title] : false;
      const itemId = `${item.title}-${index}-${level}`;

      return (
        <li key={index} className={level > 0 ? "ml-3" : ""}>
          {hasChildren ? (
            <div>
              <Collapsible
                open={isOpen}
                onOpenChange={(open) => {
                  setOpenCategories(prev => ({
                    ...prev,
                    [item.title]: open
                  }));
                }}
              >
                <div className="flex items-center">
                  <CollapsibleTrigger
                    className="flex items-center py-2 px-2 w-full text-sm hover:bg-accent/50 rounded-md group transition-colors duration-200"
                    onMouseEnter={() => setIsHovering(itemId)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <span className="mr-2 flex items-center justify-center">
                      {isOpen ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </motion.div>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      )}
                    </span>
                    <Folder className="h-4 w-4 mr-1.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className={cn(
                      "font-medium transition-colors",
                      isHovering === itemId ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {item.title}
                    </span>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 space-y-1 pl-2 border-l border-border/50 ml-2.5 pt-1"
                  >
                    {renderItems(item.items || [], level + 1)}
                  </motion.ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <Link
              href={item.href || "#"}
              className={cn(
                "flex items-center py-2 px-2 rounded-md text-sm transition-all duration-200",
                isActive
                  ? "bg-accent/80 text-primary font-medium shadow-sm rounded-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              onMouseEnter={() => setIsHovering(itemId)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <FileText className="h-4 w-4 mr-2 shrink-0" />
              <span>{item.title}</span>
            </Link>
          )}
        </li>
      );
    });
  };

  return (
    <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2 -mr-2">
      <h3 className="font-medium text-lg mb-4 text-foreground px-2">
        {meta?.[category]?.title || category}
      </h3>
      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border/40 shadow-sm p-2">
        <ul className="space-y-1">
          {renderItems(items)}
        </ul>
      </div>
    </div>
  );
}