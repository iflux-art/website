'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Shuffle, Dices } from 'lucide-react';
import Link from 'next/link';

export default function RandomGeneratorPage() {
  const [type, setType] = useState<'number' | 'string' | 'list' | 'color'>('number');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // 数字生成设置
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);
  const [numberCount, setNumberCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);

  // 字符串生成设置
  const [stringLength, setStringLength] = useState(8);
  const [stringCount, setStringCount] = useState(1);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  // 列表设置
  const [listItems, setListItems] = useState('');
  const [listCount, setListCount] = useState(1);

  // 颜色设置
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [colorCount, setColorCount] = useState(1);

  // 生成随机数字
  const generateNumbers = () => {
    const numbers: number[] = [];
    const range = numberMax - numberMin + 1;

    if (!allowDuplicates && numberCount > range) {
      alert('不允许重复时，生成数量不能超过数字范围');
      return;
    }

    const used = new Set<number>();

    for (let i = 0; i < numberCount; i++) {
      let num: number;
      do {
        num = Math.floor(Math.random() * range) + numberMin;
      } while (!allowDuplicates && used.has(num));

      numbers.push(num);
      if (!allowDuplicates) used.add(num);
    }

    setResults(numbers.map(n => n.toString()));
  };

  // 生成随机字符串
  const generateStrings = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      alert('请至少选择一种字符类型');
      return;
    }

    const strings: string[] = [];
    for (let i = 0; i < stringCount; i++) {
      let result = '';
      for (let j = 0; j < stringLength; j++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      strings.push(result);
    }

    setResults(strings);
  };

  // 随机选择列表项
  const generateFromList = () => {
    const items = listItems.split('\n').filter(item => item.trim() !== '');
    if (items.length === 0) {
      alert('请输入列表项');
      return;
    }

    const selected: string[] = [];
    const used = new Set<number>();

    for (let i = 0; i < Math.min(listCount, items.length); i++) {
      let index: number;
      do {
        index = Math.floor(Math.random() * items.length);
      } while (used.has(index) && used.size < items.length);

      selected.push(items[index]);
      used.add(index);
    }

    setResults(selected);
  };

  // 生成随机颜色
  const generateColors = () => {
    const colors: string[] = [];

    for (let i = 0; i < colorCount; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      let color: string;
      switch (colorFormat) {
        case 'hex':
          color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
            .toString(16)
            .padStart(2, '0')}`;
          break;
        case 'rgb':
          color = `rgb(${r}, ${g}, ${b})`;
          break;
        case 'hsl':
          const h = Math.floor(Math.random() * 360);
          const s = Math.floor(Math.random() * 101);
          const l = Math.floor(Math.random() * 101);
          color = `hsl(${h}, ${s}%, ${l}%)`;
          break;
        default:
          color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
            .toString(16)
            .padStart(2, '0')}`;
      }

      colors.push(color);
    }

    setResults(colors);
  };

  // 生成随机内容
  const generate = () => {
    switch (type) {
      case 'number':
        generateNumbers();
        break;
      case 'string':
        generateStrings();
        break;
      case 'list':
        generateFromList();
        break;
      case 'color':
        generateColors();
        break;
    }
  };

  // 复制结果
  const copyResult = async (result: string) => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(result);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制所有结果
  const copyAllResults = async () => {
    try {
      await navigator.clipboard.writeText(results.join('\n'));
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
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
          <Dices className="h-8 w-8" />
          随机生成器
        </h1>
        <p className="text-muted-foreground mt-2">生成随机数字、字符串、列表选择和颜色</p>
      </div>

      {/* 类型选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'number', name: '随机数字', icon: '🔢' },
            { key: 'string', name: '随机字符串', icon: '🔤' },
            { key: 'list', name: '列表选择', icon: '📝' },
            { key: 'color', name: '随机颜色', icon: '🎨' },
          ].map(item => (
            <Button
              key={item.key}
              variant={type === item.key ? 'default' : 'outline'}
              onClick={() => setType(item.key as any)}
              className="rounded-full flex items-center gap-2"
            >
              <span>{item.icon}</span>
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>生成设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 数字设置 */}
              {type === 'number' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">最小值</label>
                      <input
                        type="number"
                        value={numberMin}
                        onChange={e => setNumberMin(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">最大值</label>
                      <input
                        type="number"
                        value={numberMax}
                        onChange={e => setNumberMax(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">生成数量</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={numberCount}
                      onChange={e => setNumberCount(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={allowDuplicates}
                        onChange={e => setAllowDuplicates(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">允许重复</span>
                    </label>
                  </div>
                </>
              )}

              {/* 字符串设置 */}
              {type === 'string' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">字符串长度</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={stringLength}
                      onChange={e => setStringLength(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">生成数量</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={stringCount}
                      onChange={e => setStringCount(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">包含字符类型</h4>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={e => setIncludeUppercase(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">大写字母 (A-Z)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={e => setIncludeLowercase(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">小写字母 (a-z)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={e => setIncludeNumbers(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">数字 (0-9)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={e => setIncludeSymbols(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">特殊符号</span>
                    </label>
                  </div>
                </>
              )}

              {/* 列表设置 */}
              {type === 'list' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">列表项（每行一个）</label>
                    <textarea
                      value={listItems}
                      onChange={e => setListItems(e.target.value)}
                      placeholder="选项1&#10;选项2&#10;选项3"
                      className="w-full h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">选择数量</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={listCount}
                      onChange={e => setListCount(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </>
              )}

              {/* 颜色设置 */}
              {type === 'color' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">颜色格式</label>
                    <select
                      value={colorFormat}
                      onChange={e => setColorFormat(e.target.value as any)}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="hex">HEX (#RRGGBB)</option>
                      <option value="rgb">RGB (r, g, b)</option>
                      <option value="hsl">HSL (h, s%, l%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">生成数量</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={colorCount}
                      onChange={e => setColorCount(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </>
              )}

              {/* 生成按钮 */}
              <Button onClick={generate} className="w-full flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                生成
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                生成结果
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={copyAllResults}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied === 'all' ? (
                        <>
                          <Check className="h-4 w-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          复制全部
                        </>
                      )}
                    </Button>
                    <Button onClick={clearResults} variant="outline" size="sm">
                      清空
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  点击"生成"按钮开始生成随机内容
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {type === 'color' && (
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: result }}
                          />
                        )}
                        <span className="font-mono text-sm flex-1">{result}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyResult(result)}
                        className="flex items-center gap-2"
                      >
                        {copied === result ? (
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
