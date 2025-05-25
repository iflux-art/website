'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Clock, Hash, Type } from 'lucide-react';
import Link from 'next/link';

export default function TextCounterPage() {
  const [text, setText] = useState('');
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
    const words = inputText.trim() === '' ? 0 : 
      inputText
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;
    
    // 句子数（按句号、问号、感叹号分割）
    const sentences = inputText.trim() === '' ? 0 :
      inputText
        .split(/[.!?。！？]+/)
        .filter(sentence => sentence.trim().length > 0).length;
    
    // 段落数（按换行符分割）
    const paragraphs = inputText.trim() === '' ? 0 :
      inputText
        .split(/\n\s*\n/)
        .filter(paragraph => paragraph.trim().length > 0).length;
    
    // 阅读时间（假设每分钟阅读200个中文字符或250个英文单词）
    const chineseChars = (inputText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = words - chineseChars;
    const readingTime = Math.ceil((chineseChars / 200 + englishWords / 250));
    
    // 演讲时间（假设每分钟演讲150个中文字符或180个英文单词）
    const speakingTime = Math.ceil((chineseChars / 150 + englishWords / 180));
    
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
          <FileText className="h-8 w-8" />
          文字统计工具
        </h1>
        <p className="text-muted-foreground mt-2">
          统计文本字数、段落数、阅读时间等详细信息
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearText} variant="outline">
          清空文本
        </Button>
      </div>

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
                onChange={(e) => setText(e.target.value)}
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
                <span className="font-mono font-medium">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">字符数（不含空格）</span>
                <span className="font-mono font-medium">{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">单词数</span>
                <span className="font-mono font-medium">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">句子数</span>
                <span className="font-mono font-medium">{stats.sentences.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">段落数</span>
                <span className="font-mono font-medium">{stats.paragraphs.toLocaleString()}</span>
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
                  {stats.paragraphs > 0 ? Math.round(stats.sentences / stats.paragraphs) : 0} 句
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">字符密度</span>
                <span className="font-mono font-medium">
                  {stats.words > 0 ? Math.round(stats.charactersNoSpaces / stats.words) : 0} 字符/词
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">统计说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>字符数</strong>：包含所有字符，包括空格、标点符号等</li>
              <li>• <strong>单词数</strong>：按空格分割的词语数量，支持中英文混合</li>
              <li>• <strong>句子数</strong>：按句号、问号、感叹号等标点符号分割</li>
              <li>• <strong>段落数</strong>：按空行分割的段落数量</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">时间估算</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>阅读时间</strong>：基于平均阅读速度（中文200字/分钟，英文250词/分钟）</li>
              <li>• <strong>演讲时间</strong>：基于平均演讲速度（中文150字/分钟，英文180词/分钟）</li>
              <li>• 实际时间可能因个人习惯和文本复杂度而有所差异</li>
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
        </CardContent>
      </Card>
    </div>
  );
}
