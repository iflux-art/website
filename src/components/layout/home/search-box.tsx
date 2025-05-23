'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircle,
  Mic,
  SendHorizontal,
  Image,
  Paperclip,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  className?: string;
}

/**
 * 搜索框组件
 * 两行设计，上面是输入框，下面是功能图标
 */
export function SearchBox({ className }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本区域高度的函数
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = '56px';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
    
    // 只有当内容超过最大高度时才显示滚动条
    textarea.style.overflowY = newHeight >= 200 ? 'auto' : 'hidden';
  };

  // 在组件挂载和 inputValue 变化时调整高度
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // 高度调整由 useEffect 处理
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      // 这里可以添加发送消息的逻辑
      console.log('发送消息:', inputValue);
      setInputValue('');
      
      // 确保文本区域高度重置
      if (textareaRef.current) {
        textareaRef.current.style.height = '56px';
      }
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-3xl mx-auto relative rounded-lg border bg-background/90 backdrop-blur-sm shadow transition-all overflow-hidden',
        isFocused ? 'shadow-md ring-1 ring-primary/30' : 'hover:shadow-md',
        className
      )}
    >
      {/* 上面一行：文本输入区域 */}
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
          style={{ maxHeight: '200px' }}
        />
      </div>

      {/* 下面一行：功能图标 - 去掉中间横线 */}
      <div className="flex items-center justify-between px-3 py-2.5">
        {/* 左侧功能图标 */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="添加"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="上传文件"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="上传图片"
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="语音输入"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>

        {/* 右侧发送按钮 - 高亮显示 */}
        <div className="flex items-center">
          <Button
            size="sm"
            className={cn(
              'rounded-md transition-colors px-4 py-2 h-9 font-medium shadow-sm',
              'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow'
            )}
            onClick={handleSend}
            aria-label="发送"
          >
            <SendHorizontal className="h-4 w-4 mr-1.5" />
            <span>发送</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
