'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/feedback/dialog';
import { Button } from '@/components/ui/input/button';
import { cn } from '@/lib/utils';
import {
  Search,
  FileText,
  BookOpen,
  X,
  ArrowRight,
  Loader2,
  Wrench,
  ExternalLink,
} from 'lucide-react';

// 搜索结果类型
interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  type: 'doc' | 'blog' | 'navigation' | 'tool';
  icon: React.ReactNode;
  isExternal?: boolean;
}

// 搜索对话框属性
interface SearchDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

/**
 * 搜索对话框组件
 * 提供全站内容搜索功能
 */
export function SearchDialog({ open, onOpenChangeAction }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 工具数据 - 实际项目中应该从API获取
  const TOOLS = [
    {
      id: 'json-formatter',
      name: 'JSON 格式化',
      description: '格式化和验证JSON数据',
      path: '/tools/json-formatter',
      tags: ['JSON', '格式化', '验证'],
    },
    {
      id: 'base64-encoder',
      name: 'Base64 编解码',
      description: 'Base64编码和解码工具',
      path: '/tools/base64-encoder',
      tags: ['Base64', '编码', '解码'],
    },
    {
      id: 'url-encoder',
      name: 'URL 编解码',
      description: 'URL编码和解码工具',
      path: '/tools/url-encoder',
      tags: ['URL', '编码', '解码'],
    },
    {
      id: 'password-generator',
      name: '密码生成器',
      description: '生成安全的随机密码',
      path: '/tools/password-generator',
      tags: ['密码', '生成器', '安全'],
    },
    {
      id: 'uuid-generator',
      name: 'UUID 生成器',
      description: '生成各种版本的UUID',
      path: '/tools/uuid-generator',
      tags: ['UUID', '生成器', '唯一标识'],
    },
    {
      id: 'hash-generator',
      name: '哈希生成器',
      description: '生成MD5、SHA等哈希值',
      path: '/tools/hash-generator',
      tags: ['哈希', 'MD5', 'SHA'],
    },
    {
      id: 'regex-tester',
      name: '正则表达式测试',
      description: '测试和验证正则表达式',
      path: '/tools/regex-tester',
      tags: ['正则', '测试', '验证'],
    },
    {
      id: 'timestamp-converter',
      name: '时间戳转换',
      description: '时间戳与日期时间相互转换',
      path: '/tools/timestamp-converter',
      tags: ['时间戳', '转换', '日期'],
    },
    {
      id: 'qr-generator',
      name: '二维码生成器',
      description: '生成各种类型的二维码',
      path: '/tools/qr-generator',
      tags: ['二维码', '生成器', 'QR'],
    },
    {
      id: 'color-picker',
      name: '颜色选择器',
      description: '选择和转换颜色格式',
      path: '/tools/color-picker',
      tags: ['颜色', '选择器', '转换'],
    },
  ];

  // 网址导航数据 - 实际项目中应该从API获取
  const NAVIGATION_SITES = [
    {
      name: 'GitHub',
      description: '全球最大的代码托管平台',
      url: 'https://github.com',
      category: '开发工具',
    },
    {
      name: 'Stack Overflow',
      description: '程序员问答社区',
      url: 'https://stackoverflow.com',
      category: '开发工具',
    },
    {
      name: 'MDN Web Docs',
      description: 'Web开发文档和教程',
      url: 'https://developer.mozilla.org',
      category: '文档',
    },
    {
      name: 'Can I Use',
      description: '浏览器兼容性查询',
      url: 'https://caniuse.com',
      category: '开发工具',
    },
    {
      name: 'CodePen',
      description: '在线代码编辑器',
      url: 'https://codepen.io',
      category: '开发工具',
    },
    {
      name: 'Figma',
      description: '在线设计协作工具',
      url: 'https://figma.com',
      category: '设计工具',
    },
    {
      name: 'Dribbble',
      description: '设计师作品展示平台',
      url: 'https://dribbble.com',
      category: '设计工具',
    },
    {
      name: 'Unsplash',
      description: '免费高质量图片库',
      url: 'https://unsplash.com',
      category: '素材',
    },
  ];

  // 搜索函数
  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // 搜索工具
    TOOLS.forEach(tool => {
      if (
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          title: tool.name,
          path: tool.path,
          excerpt: tool.description,
          type: 'tool',
          icon: <Wrench className="h-4 w-4" />,
        });
      }
    });

    // 搜索网址导航
    NAVIGATION_SITES.forEach(site => {
      if (
        site.name.toLowerCase().includes(lowerQuery) ||
        site.description.toLowerCase().includes(lowerQuery) ||
        site.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          title: site.name,
          path: site.url,
          excerpt: `${site.description} - ${site.category}`,
          type: 'navigation',
          icon: <ExternalLink className="h-4 w-4" />,
          isExternal: true,
        });
      }
    });

    // 添加一些模拟的文档和博客结果
    if (results.length < 8) {
      const mockResults = [
        {
          title: '快速开始指南',
          path: '/docs/getting-started',
          excerpt: `包含了${query}相关的入门指南和基础概念介绍...`,
          type: 'doc' as const,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          title: `关于${query}的最新博客`,
          path: '/blog/latest-updates',
          excerpt: `探讨了${query}的最新发展和应用场景...`,
          type: 'blog' as const,
          icon: <FileText className="h-4 w-4" />,
        },
      ];

      results.push(...mockResults.slice(0, 8 - results.length));
    }

    return results.slice(0, 8); // 限制结果数量
  };

  // 处理搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      const searchResults = performSearch(searchQuery);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);
  };

  // 当搜索框打开时自动聚焦
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 当搜索查询变化时执行搜索
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          const result = results[selectedIndex];
          if (result.isExternal) {
            window.open(result.path, '_blank');
          } else {
            router.push(result.path);
          }
          onOpenChangeAction(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChangeAction(false);
        break;
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border dark:border-gray-700 shadow-lg [&>button]:hidden">
        <DialogTitle className="sr-only">站内搜索</DialogTitle>
        <div className="flex items-center border-b p-4">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索工具、网址导航、文档..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" onClick={clearSearch} className="h-6 w-6 ml-2">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 搜索结果区域 */}
        <div className="max-h-[50vh]">
          <div className="max-h-[50vh]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => {
                  const handleClick = () => {
                    if (result.isExternal) {
                      window.open(result.path, '_blank');
                    } else {
                      router.push(result.path);
                    }
                    onOpenChangeAction(false);
                  };

                  return (
                    <div
                      key={index}
                      onClick={handleClick}
                      className={cn(
                        'flex items-start gap-2 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer',
                        selectedIndex === index && 'bg-accent'
                      )}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex-shrink-0 mt-1 text-muted-foreground">{result.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium mb-1 truncate flex items-center gap-1">
                          {result.title}
                          {result.isExternal && <ExternalLink className="h-3 w-3" />}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.excerpt}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1 capitalize">
                          {result.type === 'tool' && '工具'}
                          {result.type === 'navigation' && '网址导航'}
                          {result.type === 'doc' && '文档'}
                          {result.type === 'blog' && '博客'}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                    </div>
                  );
                })}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">没有找到与 "{searchQuery}" 相关的结果</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">输入关键词开始搜索</p>
              </div>
            )}
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>导航:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>选择:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>关闭:</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}