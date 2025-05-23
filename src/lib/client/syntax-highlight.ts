/**
 * 语法高亮工具
 * 
 * 提供代码语法高亮相关的功能
 */

'use client';

import { RefObject, useEffect, useState } from 'react';
import { highlight, languages } from 'prismjs';

// 导入 Prism 核心样式
import 'prismjs/themes/prism.css';

// 导入语言支持
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-dart';

/**
 * 支持的语言映射
 */
const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  css: 'css',
  scss: 'scss',
  json: 'json',
  md: 'markdown',
  mdx: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  py: 'python',
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  cs: 'csharp',
  'c#': 'csharp',
  csharp: 'csharp',
  go: 'go',
  golang: 'go',
  rs: 'rust',
  rust: 'rust',
  sql: 'sql',
  graphql: 'graphql',
  gql: 'graphql',
  docker: 'docker',
  dockerfile: 'docker',
  diff: 'diff',
  git: 'git',
  php: 'php',
  rb: 'ruby',
  ruby: 'ruby',
  swift: 'swift',
  kt: 'kotlin',
  kotlin: 'kotlin',
  dart: 'dart',
  plaintext: 'plaintext',
  text: 'plaintext',
  txt: 'plaintext',
};

/**
 * 获取语言别名
 * 
 * @param lang 语言标识符
 * @returns 标准化的语言标识符
 */
export function getLanguageAlias(lang: string): string {
  return languageMap[lang.toLowerCase()] || 'plaintext';
}

/**
 * 高亮代码
 * 
 * @param code 代码字符串
 * @param lang 语言标识符
 * @returns 高亮后的 HTML
 */
export function highlightCode(code: string, lang: string): string {
  const language = getLanguageAlias(lang);
  
  try {
    if (language === 'plaintext') {
      return code;
    }
    
    const grammar = languages[language];
    if (!grammar) {
      console.warn(`不支持的语言: ${language}，使用纯文本显示`);
      return code;
    }
    
    return highlight(code, grammar, language);
  } catch (error) {
    console.error('代码高亮失败:', error);
    return code;
  }
}

/**
 * 使用语法高亮钩子
 * 
 * @param code 代码字符串
 * @param language 语言标识符
 * @returns 高亮后的 HTML
 */
export function useSyntaxHighlighting(code: string, language: string): string {
  const [highlightedCode, setHighlightedCode] = useState<string>(code);
  
  useEffect(() => {
    setHighlightedCode(highlightCode(code, language));
  }, [code, language]);
  
  return highlightedCode;
}

/**
 * 代码行高亮选项
 */
export interface LineHighlightOptions {
  /**
   * 高亮的行号
   */
  highlightLines?: number[];
  
  /**
   * 添加行号
   */
  showLineNumbers?: boolean;
  
  /**
   * 起始行号
   */
  startLine?: number;
}

/**
 * 高亮代码行
 * 
 * @param code 代码字符串
 * @param options 高亮选项
 * @returns 带行号和高亮的代码 HTML
 */
export function highlightCodeWithLineNumbers(
  code: string,
  options: LineHighlightOptions = {}
): string {
  const { highlightLines = [], showLineNumbers = true, startLine = 1 } = options;
  
  const lines = code.split('\n');
  let result = '';
  
  lines.forEach((line, index) => {
    const lineNumber = startLine + index;
    const isHighlighted = highlightLines.includes(lineNumber);
    
    result += `<div class="code-line ${isHighlighted ? 'highlighted' : ''}">`;
    
    if (showLineNumbers) {
      result += `<span class="line-number">${lineNumber}</span>`;
    }
    
    result += `<span class="line-content">${line || ' '}</span>`;
    result += '</div>';
  });
  
  return result;
}
