'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MDX_STYLE_CONFIG } from '../config';
import type { CodeBlockProps } from '../types';

/**
 * 代码语言映射
 */
const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
  md: 'markdown',
  mdx: 'markdown',
  // 添加更多语言映射...
};

/**
 * MDX 代码块渲染组件
 * - 支持语法高亮
 * - 支持代码复制
 * - 显示文件名
 * - 自适应宽度
 */
export const MDXCodeBlock = ({ children, className, filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // 提取语言信息
  const language = className?.replace(/language-/, '') || 'text';
  const displayLanguage = LANGUAGE_MAP[language] || language;

  // 提取代码内容
  const code = React.Children.toArray(children).join('\\n');

  // 复制代码到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <pre className={`${MDX_STYLE_CONFIG.codeBlock.pre} ${className || ''}`}>
      {/* 代码块头部 */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          {filename && <span className="text-sm text-muted-foreground">{filename}</span>}
          {!filename && <span className="text-sm text-muted-foreground">{displayLanguage}</span>}
        </div>
      )}

      {/* 代码内容 */}
      <code className={MDX_STYLE_CONFIG.codeBlock.code}>{children}</code>

      {/* 复制按钮 */}
      <button
        className={MDX_STYLE_CONFIG.codeBlock.copy}
        onClick={copyToClipboard}
        type="button"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </pre>
  );
};
