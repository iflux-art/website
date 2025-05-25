'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, GitCompare, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function TextDiffPage() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [compareMode, setCompareMode] = useState<'char' | 'word' | 'line'>('line');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [copied, setCopied] = useState(false);

  // 简单的文本差异算法
  const computeDiff = useMemo(() => {
    if (!text1 && !text2) return { diff1: [], diff2: [], stats: { added: 0, removed: 0, unchanged: 0 } };

    let content1 = text1;
    let content2 = text2;

    // 预处理
    if (ignoreCase) {
      content1 = content1.toLowerCase();
      content2 = content2.toLowerCase();
    }

    if (ignoreWhitespace) {
      content1 = content1.replace(/\s+/g, ' ').trim();
      content2 = content2.replace(/\s+/g, ' ').trim();
    }

    // 分割文本
    let items1: string[];
    let items2: string[];

    switch (compareMode) {
      case 'char':
        items1 = content1.split('');
        items2 = content2.split('');
        break;
      case 'word':
        items1 = content1.split(/\s+/).filter(w => w);
        items2 = content2.split(/\s+/).filter(w => w);
        break;
      case 'line':
        items1 = content1.split('\n');
        items2 = content2.split('\n');
        break;
      default:
        items1 = content1.split('\n');
        items2 = content2.split('\n');
    }

    // 简单的 LCS (最长公共子序列) 算法
    const lcs = (a: string[], b: string[]) => {
      const m = a.length;
      const n = b.length;
      const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }

      // 回溯构建差异
      const diff1: Array<{ type: 'add' | 'remove' | 'equal'; content: string }> = [];
      const diff2: Array<{ type: 'add' | 'remove' | 'equal'; content: string }> = [];
      
      let i = m, j = n;
      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          diff1.unshift({ type: 'equal', content: a[i - 1] });
          diff2.unshift({ type: 'equal', content: b[j - 1] });
          i--;
          j--;
        } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
          diff1.unshift({ type: 'remove', content: a[i - 1] });
          diff2.unshift({ type: 'remove', content: '' });
          i--;
        } else {
          diff1.unshift({ type: 'add', content: '' });
          diff2.unshift({ type: 'add', content: b[j - 1] });
          j--;
        }
      }

      return { diff1, diff2 };
    };

    const { diff1, diff2 } = lcs(items1, items2);

    // 统计
    const stats = {
      added: diff2.filter(d => d.type === 'add').length,
      removed: diff1.filter(d => d.type === 'remove').length,
      unchanged: diff1.filter(d => d.type === 'equal').length,
    };

    return { diff1, diff2, stats };
  }, [text1, text2, compareMode, ignoreCase, ignoreWhitespace]);

  // 渲染差异
  const renderDiff = (diff: Array<{ type: 'add' | 'remove' | 'equal'; content: string }>, isLeft: boolean) => {
    return diff.map((item, index) => {
      if (item.content === '' && item.type !== 'equal') return null;
      
      let className = 'inline';
      let bgColor = '';
      
      if (item.type === 'add' && !isLeft) {
        bgColor = 'bg-green-100 dark:bg-green-900';
      } else if (item.type === 'remove' && isLeft) {
        bgColor = 'bg-red-100 dark:bg-red-900';
      } else if (item.type === 'equal') {
        bgColor = '';
      } else {
        return null;
      }

      const separator = compareMode === 'line' ? '\n' : compareMode === 'word' ? ' ' : '';
      
      return (
        <span key={index} className={`${className} ${bgColor}`}>
          {item.content}{separator}
        </span>
      );
    });
  };

  // 复制差异报告
  const copyDiffReport = async () => {
    const report = `文本比较报告
================

比较模式: ${compareMode === 'char' ? '字符' : compareMode === 'word' ? '单词' : '行'}
忽略大小写: ${ignoreCase ? '是' : '否'}
忽略空白字符: ${ignoreWhitespace ? '是' : '否'}

统计信息:
- 新增: ${computeDiff.stats.added}
- 删除: ${computeDiff.stats.removed}
- 未变更: ${computeDiff.stats.unchanged}

原文本:
${text1}

新文本:
${text2}`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 交换文本
  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  // 清空
  const clearAll = () => {
    setText1('');
    setText2('');
  };

  // 加载示例
  const loadExample = () => {
    setText1(`Hello World
This is the first line
This line will be removed
Common line
Another common line`);
    
    setText2(`Hello World!
This is the first line
This line is new
Common line
Another common line
This is an added line`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitCompare className="h-8 w-8" />
          文本比较工具
        </h1>
        <p className="text-muted-foreground mt-2">
          比较两段文本的差异，支持字符、单词、行级别比较
        </p>
      </div>

      {/* 设置选项 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>比较设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">比较模式</label>
              <select
                value={compareMode}
                onChange={(e) => setCompareMode(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="line">按行比较</option>
                <option value="word">按单词比较</option>
                <option value="char">按字符比较</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">忽略大小写</span>
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">忽略空白字符</span>
              </label>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={swapTexts} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                交换
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
        <Button
          onClick={copyDiffReport}
          variant="outline"
          className="flex items-center gap-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          复制比较报告
        </Button>
      </div>

      {/* 统计信息 */}
      {(text1 || text2) && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{computeDiff.stats.added}</div>
                <div className="text-sm text-muted-foreground">新增</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{computeDiff.stats.removed}</div>
                <div className="text-sm text-muted-foreground">删除</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{computeDiff.stats.unchanged}</div>
                <div className="text-sm text-muted-foreground">未变更</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 文本输入和比较结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 原文本 */}
        <Card>
          <CardHeader>
            <CardTitle>原文本</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="输入原文本..."
              className="w-full h-64 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            />
            
            {/* 差异显示 */}
            <div className="border border-border rounded-lg p-3 bg-muted/50 h-64 overflow-y-auto">
              <div className="font-mono text-sm whitespace-pre-wrap">
                {renderDiff(computeDiff.diff1, true)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 新文本 */}
        <Card>
          <CardHeader>
            <CardTitle>新文本</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="输入新文本..."
              className="w-full h-64 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            />
            
            {/* 差异显示 */}
            <div className="border border-border rounded-lg p-3 bg-muted/50 h-64 overflow-y-auto">
              <div className="font-mono text-sm whitespace-pre-wrap">
                {renderDiff(computeDiff.diff2, false)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">比较模式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>按行比较</strong>：逐行比较文本差异，适合代码和文档</li>
              <li>• <strong>按单词比较</strong>：逐词比较，适合文章内容比较</li>
              <li>• <strong>按字符比较</strong>：逐字符比较，最精确的比较方式</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">颜色说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <span className="bg-red-100 dark:bg-red-900 px-1 rounded">红色背景</span>：删除的内容</li>
              <li>• <span className="bg-green-100 dark:bg-green-900 px-1 rounded">绿色背景</span>：新增的内容</li>
              <li>• 无背景色：未变更的内容</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 实时比较，输入即时显示差异</li>
              <li>• 支持忽略大小写和空白字符</li>
              <li>• 提供详细的统计信息</li>
              <li>• 可以交换文本位置</li>
              <li>• 支持复制比较报告</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 代码版本比较</li>
              <li>• 文档修订对比</li>
              <li>• 配置文件差异检查</li>
              <li>• 文章内容变更追踪</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
