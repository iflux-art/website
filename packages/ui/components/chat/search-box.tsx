"use client";

import React, { useState, useEffect, useRef } from "react";
// 内联 SearchBoxProps 类型定义
export interface SearchBoxProps {
  className?: string;
  onSearchModeChange?: (isAI: boolean) => void;
}
import {
  PlusCircle,
  SendHorizontal,
  BotMessageSquare,
  User,
} from "lucide-react";
import { Button } from "packages/ui/components/shared-ui/button";
import { cn } from "packages/utils";
import { AI_MODELS } from "packages/config/chat/ai-models";
import { useAIChat } from "./useAIChat";
import { ModelSelector } from "./ModelSelector";

/**
 * 搜索框组件
 * 支持AI对话和本地搜索功能
 */
export function SearchBox({ className, onSearchModeChange }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchBoxAtBottom, setSearchBoxAtBottom] = useState(false);

  const {
    selectedModelId,
    setSelectedModelId,
    messages,
    isLoading,
    handleSend,
    handleClear,
  } = useAIChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动调整文本区域高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "56px";
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= 120 ? "auto" : "hidden";
  };

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 点击外部关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchBox = document.querySelector("[data-search-box]");
      const dropdown = document.querySelector("[data-dropdown]");

      // 如果点击的是搜索框或下拉菜单内部，不关闭
      if (searchBox?.contains(target) || dropdown?.contains(target)) {
        return;
      }
    };

    // if (showModelSelector) { // 移除 showModelSelector 条件
    document.addEventListener("mousedown", handleClickOutside);
    // }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // 移除 showModelSelector 依赖

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendClick();
      }
    }
  };

  // 通知父组件搜索模式变化
  useEffect(() => {
    onSearchModeChange?.(messages.length > 0);
  }, [messages.length, onSearchModeChange]);

  const handleSendClick = async () => {
    if (!inputValue.trim()) return;
    setIsExpanded(true);
    setSearchBoxAtBottom(true);
    // 重置文本区域高度
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }
    await handleSend(inputValue);
    setInputValue("");
  };

  const handleClearClick = () => {
    handleClear();
    setInputValue("");
    setIsExpanded(false);
    setSearchBoxAtBottom(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl",
        searchBoxAtBottom ? "flex h-[80vh] flex-col" : "relative",
      )}
    >
      {/* 内容区域 - 在搜索框上方显示问答内容 */}
      {isExpanded && messages.length > 0 && (
        <div
          className={cn(
            searchBoxAtBottom
              ? "scrollbar-hide mb-4 flex-1 overflow-y-auto"
              : "scrollbar-hide mb-4 max-h-[60vh] overflow-y-auto",
          )}
        >
          <div className="space-y-4 p-4">
            {/* 消息列表 */}
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* 用户消息 - 右侧对齐 */}
                {message.type === "user" && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0"></div>
                    <div className="flex flex-1 justify-end pr-0">
                      <div className="w-fit max-w-[100%] rounded-lg border bg-background p-3">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* AI回复 - 左侧对齐 */}
                {message.type === "ai" && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card">
                      <BotMessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pl-0">
                      <div className="w-fit max-w-[100%] rounded-lg border bg-background p-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-8 flex-shrink-0"></div>
                  </div>
                )}
              </div>
            ))}

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="w-fit max-w-[calc(100%-4rem)] rounded-lg border bg-background p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {"正在处理您的请求..."}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-8 flex-shrink-0"></div>
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
          "relative z-10 rounded-lg border bg-background/90 shadow backdrop-blur-sm transition-all duration-300",
          isFocused ? "shadow-md ring-1 ring-primary/30" : "hover:shadow-md",
          className,
        )}
      >
        {/* 输入框区域 */}
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            className={cn(
              "scrollbar-hide flex w-full resize-none bg-transparent py-5 text-base placeholder:text-muted-foreground/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "px-4",
              "h-[56px]",
            )}
            placeholder="有什么我能帮你的吗?"
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            style={{ maxHeight: "200px" }}
          />
        </div>

        {/* 下面一行：功能图标 */}
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* 左侧按钮组 - 大模型、开启新对话 */}
          <div className="flex items-center gap-1.5">
            {/* 模型选择器 */}
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelect={setSelectedModelId}
              AI_MODELS={AI_MODELS}
            />

            {/* 开启新对话按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="flex h-8 items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground"
              onClick={handleClearClick}
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
                "h-8 rounded-md px-4 py-2 font-medium shadow-sm transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow",
              )}
              onClick={handleSendClick}
              disabled={!inputValue.trim() || isLoading}
              aria-label="发送"
            >
              <SendHorizontal className="mr-1.5 h-4 w-4" />
              <span>发送</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 使用 Portal 渲染下拉菜单，避免被父容器的 overflow 限制 */}
      {typeof window !== "undefined" && (
        <>
          {/* 移除 showModelSelector 和 setShowModelSelector 相关逻辑 */}
          {/* 移除 dropdownPosition 和 setDropdownPosition 相关逻辑 */}
          {/* 移除 modelSelectorRef */}
          {/* 移除 calculateDropdownPosition */}
        </>
      )}
    </div>
  );
}
