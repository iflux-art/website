'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import Link from 'next/link';

export default function TextSortPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortType, setSortType] = useState<'alphabetical' | 'numerical' | 'length' | 'random'>('alphabetical');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [copied, setCopied] = useState(false);

  // 排序函数
  const sortLines = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let lines = input.split('\n');

    // 移除空行
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }

    // 移除重复行
    if (removeDuplicates) {
      lines = [...new Set(lines)];
    }

    // 排序
    switch (sortType) {
      case 'alphabetical':
        lines.sort((a, b) => {
          const strA = caseSensitive ? a : a.toLowerCase();
          const strB = caseSensitive ? b : b.toLowerCase();
          return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
        break;

      case 'numerical':
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        });
        break;

      case 'length':
        lines.sort((a, b) => {
          const diff = a.length - b.length;
          return sortOrder === 'asc' ? diff : -diff;
        });
        break;

      case 'random':
        // Fisher-Yates 洗牌算法
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }

    setOutput(lines.join('\n'));
  };

  // 复制结果
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 交换输入输出
  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  // 清空
  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  // 加载示例
  const loadExample = () => {
    setInput(`苹果
香蕉
橙子
葡萄
西瓜
草莓
柠檬
桃子
梨子
樱桃`);
  };

  // 实时排序
  React.useEffect(() => {
    sortLines();
  }, [input, sortType, sortOrder, caseSensitive, removeDuplicates, removeEmpty]);

  const sortTypes = [
    { value: 'alphabetical', name: '字母顺序', icon: SortAsc },
    { value: 'numerical', name: '数字大小', icon: SortAsc },
    { value: 'length', name: '长度', icon: SortAsc },
    { value: 'random', name: '随机排序', icon: ArrowUpDown },
  ];

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
          <SortAsc className="h-8 w-8" />
          文本排序工具
        </h1>
        <p className="text-muted-foreground mt-2">
          对文本行进行多种方式的排序，支持去重和过滤
        </p>
      </div>

      {/* 设置面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>排序设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 排序类型 */}
            <div>
              <label className="block text-sm font-medium mb-2">排序类型</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {sortTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 排序顺序 */}
            {sortType !== 'random' && (
              <div>
                <label className="block text-sm font-medium mb-2">排序顺序</label>
                <div className="flex gap-1">
                  <Button
                    variant={sortOrder === 'asc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('asc')}
                    className="flex-1 flex items-center gap-1"
                  >
                    <SortAsc className="h-3 w-3" />
                    升序
                  </Button>
                  <Button
                    variant={sortOrder === 'desc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('desc')}
                    className="flex-1 flex items-center gap-1"
                  >
                    <SortDesc className="h-3 w-3" />
                    降序
                  </Button>
                </div>
              </div>
            )}

            {/* 选项设置 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">选项</label>
              <div className="space-y-1">
                {sortType === 'alphabetical' && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">区分大小写</span>
                  </label>
                )}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">移除重复行</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={removeEmpty}
                    onChange={(e) => setRemoveEmpty(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">移除空行</span>
                </label>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={swapInputOutput}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!output}
              >
                <ArrowUpDown className="h-4 w-4" />
                交换
              </Button>
              <Button onClick={sortLines} className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                排序
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
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>原始文本</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要排序的文本，每行一个项目..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            {/* 统计信息 */}
            {input && (
              <div className="mt-2 text-xs text-muted-foreground">
                总行数: {input.split('\n').length} | 
                非空行: {input.split('\n').filter(line => line.trim() !== '').length}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              排序结果
              {output && (
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      复制
                    </>
                  )}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={output}
              readOnly
              placeholder="排序后的文本将显示在这里..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
            
            {/* 统计信息 */}
            {output && (
              <div className="mt-2 text-xs text-muted-foreground">
                结果行数: {output.split('\n').length}
              </div>
            )}
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
            <h4 className="font-medium mb-2">排序类型说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>字母顺序</strong>：按照字母表顺序排序，支持中文拼音排序</li>
              <li>• <strong>数字大小</strong>：将每行作为数字进行大小比较排序</li>
              <li>• <strong>长度</strong>：按照每行文本的字符长度排序</li>
              <li>• <strong>随机排序</strong>：随机打乱行的顺序</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 实时排序，输入即时显示结果</li>
              <li>• 支持升序和降序排列</li>
              <li>• 可选择是否区分大小写</li>
              <li>• 自动移除重复行和空行</li>
              <li>• 支持中文和多语言文本</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 整理名单和清单</li>
              <li>• 数据预处理和清理</li>
              <li>• 文本内容去重</li>
              <li>• 随机排列和抽签</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 数字排序时，非数字内容将被视为0</li>
              <li>• 中文排序按照拼音顺序进行</li>
              <li>• 随机排序每次结果都不同</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
