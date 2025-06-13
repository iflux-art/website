'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  PlusCircle,
  SendHorizontal,
  BotMessageSquare,
  Sparkles,
  FileText,
  Wrench,
  User,
  Copy,
  Globe,
  HardDrive,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AI_MODELS, type AIModel } from '@/lib/ai-models';
import { TOOLS, NAVIGATION_SITES } from './constants';

// 搜索引擎配置
const SEARCH_ENGINES = [
  { id: 'local', name: '本地搜索', icon: 'HardDrive', url: '' },
  { id: 'google', name: 'Google', icon: 'Globe', url: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', icon: 'Globe', url: 'https://www.bing.com/search?q=' },
  { id: 'baidu', name: '百度', icon: 'Globe', url: 'https://www.baidu.com/s?wd=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'Globe', url: 'https://duckduckgo.com/?q=' },
  { id: 'yandex', name: 'Yandex', icon: 'Globe', url: 'https://yandex.com/search/?text=' },
] as const;

type SearchEngine = (typeof SEARCH_ENGINES)[number];

interface Message {
  id: string;
  type: 'user' | 'ai' | 'local' | 'web' | 'hybrid';
  content: string;
  timestamp: Date;
  results?: SearchResult[];
  aiResponse?: string;
  searchMode?: 'ai' | 'local' | 'web';
}

interface SearchResult {
  title: string;
  description: string;
  url: string;
  type: 'doc' | 'tool' | 'blog' | 'web';
  highlights?: {
    title?: string;
    content?: string[];
  };
}

interface SearchBoxProps {
  className?: string;
  onSearchModeChange?: (isSearchMode: boolean) => void;
}

/**
 * 搜索框组件
 * 支持AI对话和本地搜索功能
 */
export function SearchBox({ className, onSearchModeChange }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [showSearchEngineSelector, setShowSearchEngineSelector] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const [searchBoxAtBottom, setSearchBoxAtBottom] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const searchEngineSelectorRef = useRef<HTMLDivElement>(null);

  // 模拟联网搜索数据
  const mockWebResults: SearchResult[] = [
    {
      title: 'React 官方文档',
      description: 'React 是一个用于构建用户界面的 JavaScript 库',
      url: 'https://react.dev',
      type: 'doc',
    },
    {
      title: 'Next.js 官方网站',
      description: 'Next.js 是一个用于生产环境的 React 框架',
      url: 'https://nextjs.org',
      type: 'doc',
    },
    {
      title: 'MDN Web 文档',
      description: 'MDN Web 文档提供开放网络技术信息',
      url: 'https://developer.mozilla.org',
      type: 'doc',
    },
  ];

  // 自动调整文本区域高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '56px';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= 120 ? 'auto' : 'hidden';
  };

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 计算选择器位置 - 紧贴搜索框下边框
  const calculateDropdownPosition = () => {
    const searchBoxElement = document.querySelector('[data-search-box]') as HTMLElement;
    if (!searchBoxElement) return { top: 0, left: 0, width: 0, maxHeight: 0 };

    const rect = searchBoxElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const footerHeight = 60; // 假设页脚高度
    const topMargin = 4; // 上边距较小
    const bottomMargin = 16; // 下边距

    // 计算最大高度，确保不超出视窗
    const maxHeight = viewportHeight - rect.bottom - footerHeight - topMargin - bottomMargin;

    return {
      top: rect.bottom + topMargin,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(200, maxHeight), // 最小高度200px
    };
  };

  // 点击外部关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchBox = document.querySelector('[data-search-box]');
      const dropdown = document.querySelector('[data-dropdown]');

      // 如果点击的是搜索框或下拉菜单内部，不关闭
      if (searchBox?.contains(target) || dropdown?.contains(target)) {
        return;
      }

      // 关闭所有选择器
      setShowModelSelector(false);
      setShowSearchEngineSelector(false);
      setDropdownPosition(null);
    };

    if (showModelSelector || showSearchEngineSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModelSelector, showSearchEngineSelector]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSend();
      }
    }
  };

  // 通知父组件搜索模式变化
  useEffect(() => {
    onSearchModeChange?.(messages.length > 0);
  }, [messages.length, onSearchModeChange]);

  // 本地搜索功能 - 搜索真实的content目录内容
  const performLocalSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
      if (!response.ok) {
        throw new Error('Search API failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Local search error:', error);

      // 降级到静态搜索
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
            description: tool.description,
            url: tool.path,
            type: 'tool',
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
            description: `${site.description} - ${site.category}`,
            url: site.url,
            type: 'web',
          });
        }
      });

      return results.slice(0, 8);
    }
  };

  // 联网搜索功能
  const performWebSearch = async (query: string): Promise<SearchResult[]> => {
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟不同搜索引擎的结果
    const engineSpecificResults = {
      google: [
        {
          title: `Google: ${query} - 搜索结果`,
          description: `来自Google的${query}相关信息`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
        {
          title: `${query} - 维基百科`,
          description: `维基百科关于${query}的详细介绍`,
          url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
      ],
      bing: [
        {
          title: `Bing: ${query} - 搜索结果`,
          description: `来自Bing的${query}相关信息`,
          url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
        {
          title: `${query} - 必应百科`,
          description: `必应百科关于${query}的详细介绍`,
          url: `https://www.bing.com/knows/search?q=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
      ],
      baidu: [
        {
          title: `百度: ${query} - 搜索结果`,
          description: `来自百度的${query}相关信息`,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
        {
          title: `${query} - 百度百科`,
          description: `百度百科关于${query}的详细介绍`,
          url: `https://baike.baidu.com/item/${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
      ],
      duckduckgo: [
        {
          title: `DuckDuckGo: ${query} - 搜索结果`,
          description: `来自DuckDuckGo的${query}相关信息`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
      ],
      yandex: [
        {
          title: `Yandex: ${query} - 搜索结果`,
          description: `来自Yandex的${query}相关信息`,
          url: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
          type: 'web' as const,
        },
      ],
    };

    return (
      engineSpecificResults[selectedSearchEngine.id as keyof typeof engineSpecificResults] ||
      mockWebResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // AI对话功能 - 接入DeepSeek API
  const performAIChat = async (
    query: string,
    mode: 'ai' | 'local' | 'web' = 'ai',
    results?: SearchResult[]
  ): Promise<string> => {
    try {
      // 构建对话历史，转换为API需要的格式
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // 添加当前用户消息
      conversationHistory.push({
        role: 'user',
        content: query,
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          searchMode: mode,
          searchResults: results,
          modelId: selectedModel.id,
          messages: conversationHistory, // 传递完整的对话历史
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // 如果是演示模式，在控制台显示提示
      if (data.isDemo) {
        console.log('🤖 当前为演示模式:', data.message);
      }

      return data.response || '抱歉，我无法生成回复。';
    } catch (error) {
      console.error('AI对话错误:', error);
      return `抱歉，AI服务暂时不可用。错误信息：${
        error instanceof Error ? error.message : '未知错误'
      }`;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      searchMode: 'ai', // 默认为AI模式
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsExpanded(true);
    setSearchBoxAtBottom(true);

    // 重置文本区域高度
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }

    try {
      // 如果选择的是"无"模型，只执行搜索
      if (selectedModel.id === 'none') {
        // 根据选择的搜索引擎执行搜索
        let searchResults: SearchResult[] = [];

        if (selectedSearchEngine.id === 'local') {
          searchResults = await performLocalSearch(userMessage.content);
        } else {
          searchResults = await performWebSearch(userMessage.content);
        }

        // 添加搜索结果消息
        const searchMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: selectedSearchEngine.id === 'local' ? 'local' : 'web',
          content: `找到 ${searchResults.length} 个相关结果`,
          timestamp: new Date(),
          results: searchResults,
          searchMode: selectedSearchEngine.id === 'local' ? 'local' : 'web',
        };

        setMessages(prev => [...prev, searchMessage]);
      } else {
        // AI对话逻辑
        const aiResponse = await performAIChat(userMessage.content, 'ai');

        // 添加AI回复消息
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          searchMode: 'ai',
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('处理请求时出错:', error);
      const errorMessage = error instanceof Error ? error.message : '处理请求时出现未知错误';

      // 添加错误消息到聊天记录
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `❌ 抱歉，处理您的请求时出现了错误：${errorMessage}`,
        timestamp: new Date(),
        searchMode: 'ai',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInputValue('');
    setIsExpanded(false);
    setSearchBoxAtBottom(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={cn(
        'w-full max-w-3xl mx-auto',
        searchBoxAtBottom ? 'flex flex-col h-[80vh]' : 'relative'
      )}
    >
      {/* 内容区域 - 在搜索框上方显示问答内容 */}
      {isExpanded && messages.length > 0 && (
        <div
          className={cn(
            searchBoxAtBottom
              ? 'flex-1 overflow-y-auto scrollbar-hide mb-4'
              : 'mb-4 max-h-[60vh] overflow-y-auto scrollbar-hide'
          )}
        >
          <div className="p-4 space-y-4">
            {/* 消息列表 */}
            {messages.map(message => (
              <div key={message.id} className="space-y-2">
                {/* 用户消息 - 右侧对齐 */}
                {message.type === 'user' && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8"></div>
                    <div className="flex-1 flex justify-end pr-0">
                      <div className="w-fit max-w-[100%] bg-background border rounded-lg p-3">
                        <p className="text-sm">{message.content}</p>
                        {message.searchMode !== 'ai' && (
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                            {message.searchMode === 'local' && <HardDrive className="h-3 w-3" />}
                            {message.searchMode === 'web' && <Globe className="h-3 w-3" />}
                            <span>{message.searchMode === 'local' ? '本地搜索' : '联网搜索'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* AI回复 - 左侧对齐 */}
                {message.type === 'ai' && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center">
                      {selectedModel.id !== 'none' ? (
                        <BotMessageSquare className="h-4 w-4" />
                      ) : (
                        <HardDrive className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 pl-0">
                      <div className="w-fit max-w-[100%] bg-background border rounded-lg p-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8"></div>
                  </div>
                )}

                {/* 搜索结果 */}
                {(message.type === 'local' || message.type === 'web') && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center">
                      {message.type === 'local' ? (
                        <HardDrive className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="w-fit max-w-[calc(100%-4rem)] bg-background border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                        {message.results && message.results.length > 0 && (
                          <div className="space-y-2">
                            {message.results.map((result, index) => (
                              <a
                                key={index}
                                href={result.url}
                                target={result.type === 'web' ? '_blank' : '_self'}
                                rel={result.type === 'web' ? 'noopener noreferrer' : undefined}
                                className="block p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {result.type === 'doc' && (
                                      <FileText className="h-4 w-4 text-blue-500" />
                                    )}
                                    {result.type === 'tool' && (
                                      <Wrench className="h-4 w-4 text-green-500" />
                                    )}
                                    {result.type === 'blog' && (
                                      <Sparkles className="h-4 w-4 text-purple-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4
                                      className="text-sm font-medium group-hover:text-primary transition-colors"
                                      dangerouslySetInnerHTML={{
                                        __html: result.highlights?.title || result.title,
                                      }}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {result.description}
                                    </p>
                                    {result.highlights?.content &&
                                      result.highlights.content.length > 0 && (
                                        <div className="mt-1 space-y-1">
                                          {result.highlights.content
                                            .slice(0, 2)
                                            .map((highlight, idx) => (
                                              <p
                                                key={idx}
                                                className="text-xs text-muted-foreground/80 line-clamp-1"
                                                dangerouslySetInnerHTML={{ __html: highlight }}
                                              />
                                            ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 混合搜索结果（AI + 本地/联网搜索） - 左侧对齐 */}
                {message.type === 'hybrid' && (
                  <div className="space-y-4">
                    {/* AI回答部分 */}
                    {message.aiResponse && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center">
                          <BotMessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1 w-fit max-w-[calc(100%-4rem)] bg-background border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">AI 解答</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.aiResponse}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.aiResponse!)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* 搜索结果部分 */}
                    {message.results && message.results.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          {message.searchMode === 'local' ? (
                            <HardDrive className="h-4 w-4 text-white" />
                          ) : (
                            <Globe className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="w-fit max-w-[calc(100%-4rem)] bg-background border rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {message.searchMode === 'local' ? '本地内容' : '网络内容'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({message.results.length} 个结果)
                              </span>
                            </div>
                            <div className="space-y-2">
                              {message.results.map((result, index) => (
                                <a
                                  key={index}
                                  href={result.url}
                                  target={result.type === 'web' ? '_blank' : '_self'}
                                  rel={result.type === 'web' ? 'noopener noreferrer' : undefined}
                                  className="block p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {result.type === 'doc' && (
                                        <FileText className="h-4 w-4 text-blue-500" />
                                      )}
                                      {result.type === 'tool' && (
                                        <Wrench className="h-4 w-4 text-green-500" />
                                      )}
                                      {result.type === 'blog' && (
                                        <Sparkles className="h-4 w-4 text-purple-500" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className="text-sm font-medium group-hover:text-primary transition-colors"
                                        dangerouslySetInnerHTML={{
                                          __html: result.highlights?.title || result.title,
                                        }}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {result.description}
                                      </p>
                                      {result.highlights?.content &&
                                        result.highlights.content.length > 0 && (
                                          <div className="mt-1 space-y-1">
                                            {result.highlights.content
                                              .slice(0, 2)
                                              .map((highlight, idx) => (
                                                <p
                                                  key={idx}
                                                  className="text-xs text-muted-foreground/80 line-clamp-1"
                                                  dangerouslySetInnerHTML={{ __html: highlight }}
                                                />
                                              ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-card border rounded-full flex items-center justify-center">
                  {selectedModel.id !== 'none' ? (
                    <BotMessageSquare className="h-4 w-4" />
                  ) : selectedSearchEngine.id === 'local' ? (
                    <HardDrive className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="w-fit max-w-[calc(100%-4rem)] bg-background border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedModel.id === 'none'
                          ? `正在${selectedSearchEngine.name}搜索...`
                          : '正在处理您的请求...'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* 搜索框容器 */}
      <div
        data-search-box
        className={cn(
          'rounded-lg border bg-background/90 backdrop-blur-sm shadow transition-all duration-300 relative z-10',
          isFocused ? 'shadow-md ring-1 ring-primary/30' : 'hover:shadow-md',
          className
        )}
      >
        {/* 输入框区域 */}
        <div className="flex items-center relative">
          <textarea
            ref={textareaRef}
            className={cn(
              'flex w-full resize-none bg-transparent py-5 text-base placeholder:text-muted-foreground/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-hide',
              'px-4',
              'h-[56px]'
            )}
            placeholder="有什么我能帮你的吗?"
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            style={{ maxHeight: '200px' }}
          />
        </div>

        {/* 下面一行：功能图标 */}
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* 左侧按钮组 - 搜索引擎、大模型、开启新对话 */}
          <div className="flex items-center gap-1.5">
            {/* 搜索引擎选择器 */}
            <div className="relative" ref={searchEngineSelectorRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const isShowing = !showSearchEngineSelector;
                  // 关闭模型选择器
                  setShowModelSelector(false);
                  setShowSearchEngineSelector(isShowing);
                  if (isShowing) {
                    const position = calculateDropdownPosition();
                    setDropdownPosition(position);
                  } else {
                    setDropdownPosition(null);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 h-8"
              >
                <span className="hidden sm:inline">{selectedSearchEngine.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* 模型选择器 */}
            <div className="relative" ref={modelSelectorRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const isShowing = !showModelSelector;
                  // 关闭搜索引擎选择器
                  setShowSearchEngineSelector(false);
                  setShowModelSelector(isShowing);
                  if (isShowing) {
                    const position = calculateDropdownPosition();
                    setDropdownPosition(position);
                  } else {
                    setDropdownPosition(null);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 h-8"
              >
                <span className="hidden sm:inline">{selectedModel.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* 开启新对话按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 h-8"
              onClick={handleClear}
              aria-label="开启新对话"
              title="开启新对话"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* 右侧发送按钮 */}
          <div className="flex items-center">
            <Button
              size="sm"
              className={cn(
                'rounded-md transition-colors px-4 py-2 h-8 font-medium shadow-sm',
                'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow'
              )}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label="发送"
            >
              <SendHorizontal className="h-4 w-4 mr-1.5" />
              <span>发送</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 使用 Portal 渲染下拉菜单，避免被父容器的 overflow 限制 */}
      {typeof window !== 'undefined' && (
        <>
          {/* 模型选择下拉菜单 */}
          {showModelSelector &&
            dropdownPosition &&
            createPortal(
              <div
                data-dropdown
                className="fixed bg-background border rounded-lg shadow-lg z-[9999]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  maxHeight: dropdownPosition.maxHeight,
                }}
              >
                <div
                  className="p-2 space-y-1 overflow-y-auto scrollbar-hide"
                  style={{ maxHeight: dropdownPosition.maxHeight - 16 }}
                >
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    选择AI模型
                  </div>
                  {AI_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelSelector(false);
                        setDropdownPosition(null);
                      }}
                      className={cn(
                        'w-full text-left px-2 py-2 rounded-md text-sm transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        selectedModel.id === model.id && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>,
              document.body
            )}

          {/* 搜索引擎选择下拉菜单 */}
          {showSearchEngineSelector &&
            dropdownPosition &&
            createPortal(
              <div
                data-dropdown
                className="fixed bg-background border rounded-lg shadow-lg z-[9999]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  maxHeight: dropdownPosition.maxHeight,
                }}
              >
                <div
                  className="p-2 space-y-1 overflow-y-auto scrollbar-hide"
                  style={{ maxHeight: dropdownPosition.maxHeight - 16 }}
                >
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    选择搜索引擎
                  </div>
                  {SEARCH_ENGINES.map(engine => (
                    <button
                      key={engine.id}
                      onClick={() => {
                        setSelectedSearchEngine(engine);
                        setShowSearchEngineSelector(false);
                        setDropdownPosition(null);
                      }}
                      className={cn(
                        'w-full text-left px-2 py-2 rounded-md text-sm transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        selectedSearchEngine.id === engine.id && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <span className="font-medium">{engine.name}</span>
                    </button>
                  ))}
                </div>
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  );
}
