'use client';

import React, { useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyProps {
  text: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

/**
 * 复制按钮组件
 * 用于复制文本内容到剪贴板
 */
export default function Copy({ text, className, iconClassName, children }: CopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-1 transition-colors',
        'text-muted-foreground hover:text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      title={copied ? '已复制!' : '复制到剪贴板'}
    >
      {children || (
        <>
          {copied ? (
            <Check className={cn('h-4 w-4', iconClassName)} />
          ) : (
            <CopyIcon className={cn('h-4 w-4', iconClassName)} />
          )}
          <span className="sr-only">{copied ? '已复制' : '复制'}</span>
        </>
      )}
    </button>
  );
}
