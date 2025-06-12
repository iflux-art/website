'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Hash,
  Type,
  Copy,
  Check,
  ArrowUpDown,
  Shuffle,
  RotateCcw,
  FileDown,
  ArrowLeft,
} from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { ToolActions } from '@/components/features/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/card';
import { Button } from '@/components/ui/input/button';
import Link from 'next/link';

export default function TextCounterPage() {
  const [activeTab, setActiveTab] = useState('counter');
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  const calculateStats = (inputText: string) => {
    // 字符数（包含空格）
    const characters = inputText.length;

    // 字符数（不包含空格）
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;

    // 单词数（中英文混合计算）
    const words =
      inputText.trim() === ''
        ? 0
        : inputText
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0).length;

    // 句子数（按句号、问号、感叹号分割）
    const sentences =
      inputText.trim() === ''
        ? 0
        : inputText.split(/[.!?。！？]+/).filter(sentence => sentence.trim().length > 0).length;

    // 段落数（按换行符分割）
    const paragraphs =
      inputText.trim() === ''
        ? 0
        : inputText.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length;

    // 阅读时间（假设每分钟阅读200个中文字符或250个英文单词）
    const chineseChars = (inputText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = words - chineseChars;
    const readingTime = Math.ceil(chineseChars / 200 + englishWords / 250);

    // 演讲时间（假设每分钟演讲150个中文字符或180个英文单词）
    const speakingTime = Math.ceil(chineseChars / 150 + englishWords / 180);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime: Math.max(1, readingTime),
      speakingTime: Math.max(1, speakingTime),
    };
  };

  useEffect(() => {
    setStats(calculateStats(text));
  }, [text]);

  const clearText = () => {
    setText('');
  };

  const loadExample = () => {
    const example = `这是一个文字统计工具的示例文本。它可以帮助你统计文本的各种信息。

这个工具可以统计：
- 字符数（包含和不包含空格）
- 单词数
- 句子数
- 段落数
- 预估阅读时间
- 预估演讲时间

This is an example text for the text counter tool. It can help you count various information about your text.

The tool can count:
- Character count (with and without spaces)
- Word count
- Sentence count
- Paragraph count
- Estimated reading time
- Estimated speaking time

希望这个工具对你的写作有所帮助！`;
    setText(example);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} 分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} 小时 ${remainingMinutes} 分钟`;
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 文本转换策略对象
  const textTransforms = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    capitalize: (text: string) => text.replace(/\b\w/g, l => l.toUpperCase()),
    reverse: (text: string) => text.split('').reverse().join(''),
    removeSpaces: (text: string) => text.replace(/\s+/g, ''),
    removeLineBreaks: (text: string) => text.replace(/\n/g, ' ').replace(/\s+/g, ' '),
    sortLines: (text: string) => text.split('\n').sort().join('\n'),
    shuffleLines: (text: string) => {
      const lines = text.split('\n');
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join('\n');
    },
    removeDuplicateLines: (text: string) => [...new Set(text.split('\n'))].join('\n'),
  };

  // 文本转换功能
  const transformText = (type: keyof typeof textTransforms) => {
    const transformFn = textTransforms[type];
    if (transformFn) {
      setText(transformFn(text));
    }
  };

  // 文本比较
  const compareTexts = () => {
    const lines1 = text.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    const differences = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      if (line1 !== line2) {
        differences.push({
          line: i + 1,
          text1: line1,
          text2: line2,
        });
      }
    }
    return differences;
  };

  const actions = [
    {
      label: '加载示例',
      onClick: loadExample,
      icon: FileDown,
      variant: 'outline' as const,
    },
    {
      label: '清空',
      onClick: clearText,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>文字统计</strong>：统计字符数、单词数、句子数、段落数
          </li>
          <li>
            • <strong>时间估算</strong>：预估阅读时间和演讲时间
          </li>
          <li>
            • <strong>文本转换</strong>：大小写转换、排序、去重等
          </li>
          <li>
            • <strong>文本比较</strong>：逐行比较两个文本的差异
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">适用场景</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 写作时控制文章长度</li>
          <li>• 准备演讲稿时估算时间</li>
          <li>• 社交媒体发布时控制字数</li>
          <li>• 学术论文字数统计</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">统计说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 阅读时间：基于平均阅读速度（中文200字/分钟，英文250词/分钟）</li>
          <li>• 演讲时间：基于平均演讲速度（中文150字/分钟，英文180词/分钟）</li>
          <li>• 实际时间可能因个人习惯和文本复杂度而有所差异</li>
          <li>• 支持中英文混合文本统计</li>
          <li>• 自动识别句子和段落分隔符</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">文本统计工具</h1>
            <p className="text-muted-foreground">
              专业的文本分析工具，支持字数统计、字符分析、阅读时间估算、关键词提取
            </p>
          </div>
        </div>
      </div>
      <ToolLayout
        title="文本处理工具集"
        description="全面的文本处理工具，包括文字统计、文本比较、排序、大小写转换、格式化"
        icon={FileText}
        actions={<ToolActions actions={actions} />}
        helpContent={helpContent}
      >
        {/* 标签页 */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="flex border-b">
              {[
                { key: 'counter', name: '文字统计', icon: Type },
                { key: 'transform', name: '文本转换', icon: ArrowUpDown },
                { key: 'compare', name: '文本比较', icon: FileText },
                { key: 'format', name: '格式化', icon: Shuffle },
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 文字统计标签页 */}
        {activeTab === 'counter' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 文本输入区域 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>输入文本</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="在此输入要统计的文本..."
                      className="w-full h-96 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* 统计结果 */}
              <div className="space-y-4">
                {/* 基础统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      基础统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">字符数（含空格）</span>
                      <span className="font-mono font-medium">
                        {stats.characters.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">字符数（不含空格）</span>
                      <span className="font-mono font-medium">
                        {stats.charactersNoSpaces.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">单词数</span>
                      <span className="font-mono font-medium">{stats.words.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">句子数</span>
                      <span className="font-mono font-medium">
                        {stats.sentences.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">段落数</span>
                      <span className="font-mono font-medium">
                        {stats.paragraphs.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* 时间估算 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      时间估算
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">阅读时间</span>
                      <span className="font-medium">{formatTime(stats.readingTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">演讲时间</span>
                      <span className="font-medium">{formatTime(stats.speakingTime)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 详细分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      详细分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">平均句长</span>
                      <span className="font-mono font-medium">
                        {stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0} 词
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">平均段长</span>
                      <span className="font-mono font-medium">
                        {stats.paragraphs > 0 ? Math.round(stats.sentences / stats.paragraphs) : 0}{' '}
                        句
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">字符密度</span>
                      <span className="font-mono font-medium">
                        {stats.words > 0 ? Math.round(stats.charactersNoSpaces / stats.words) : 0}{' '}
                        字符/词
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* 文本转换标签页 */}
        {activeTab === 'transform' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>文本转换</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">输入文本</label>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="在此输入要转换的文本..."
                    className="w-full h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Button onClick={() => transformText('uppercase')} variant="outline" size="sm">
                    转大写
                  </Button>
                  <Button onClick={() => transformText('lowercase')} variant="outline" size="sm">
                    转小写
                  </Button>
                  <Button onClick={() => transformText('capitalize')} variant="outline" size="sm">
                    首字母大写
                  </Button>
                  <Button onClick={() => transformText('reverse')} variant="outline" size="sm">
                    反转文本
                  </Button>
                  <Button onClick={() => transformText('removeSpaces')} variant="outline" size="sm">
                    移除空格
                  </Button>
                  <Button
                    onClick={() => transformText('removeLineBreaks')}
                    variant="outline"
                    size="sm"
                  >
                    移除换行
                  </Button>
                  <Button onClick={() => transformText('sortLines')} variant="outline" size="sm">
                    行排序
                  </Button>
                  <Button onClick={() => transformText('shuffleLines')} variant="outline" size="sm">
                    行随机
                  </Button>
                  <Button
                    onClick={() => transformText('removeDuplicateLines')}
                    variant="outline"
                    size="sm"
                  >
                    去重复行
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(text, 'transform')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {copied === 'transform' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    复制结果
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">转换结果</label>
                  <textarea
                    value={text}
                    readOnly
                    className="w-full h-32 p-3 border border-border rounded-lg bg-muted/50 text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 文本比较标签页 */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>文本1</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="输入第一个文本..."
                    className="w-full h-64 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>文本2</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={text2}
                    onChange={e => setText2(e.target.value)}
                    placeholder="输入第二个文本..."
                    className="w-full h-64 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>比较结果</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const differences = compareTexts();
                  if (differences.length === 0) {
                    return (
                      <p className="text-muted-foreground">两个文本相同或请输入文本进行比较</p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        发现 {differences.length} 处差异：
                      </p>
                      {differences.slice(0, 10).map((diff, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg">
                          <div className="text-sm font-medium mb-2">第 {diff.line} 行</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-red-50 dark:bg-red-950 rounded">
                              <div className="text-red-600 dark:text-red-400 font-medium mb-1">
                                文本1:
                              </div>
                              <div>{diff.text1 || '(空行)'}</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                              <div className="text-green-600 dark:text-green-400 font-medium mb-1">
                                文本2:
                              </div>
                              <div>{diff.text2 || '(空行)'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {differences.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ... 还有 {differences.length - 10} 处差异
                        </p>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 格式化标签页 */}
        {activeTab === 'format' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>文本格式化</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">输入文本</label>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="在此输入要格式化的文本..."
                    className="w-full h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button onClick={() => setText(text.trim())} variant="outline" size="sm">
                    去除首尾空格
                  </Button>
                  <Button
                    onClick={() => setText(text.replace(/\s+/g, ' '))}
                    variant="outline"
                    size="sm"
                  >
                    合并空格
                  </Button>
                  <Button
                    onClick={() => setText(text.replace(/\n\s*\n/g, '\n\n'))}
                    variant="outline"
                    size="sm"
                  >
                    规范段落
                  </Button>
                  <Button
                    onClick={() => setText(text.replace(/[^\w\s\u4e00-\u9fa5]/g, ''))}
                    variant="outline"
                    size="sm"
                  >
                    移除标点
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">格式化结果</label>
                  <textarea
                    value={text}
                    readOnly
                    className="w-full h-32 p-3 border border-border rounded-lg bg-muted/50 text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ToolLayout>
    </div>
  );
}
