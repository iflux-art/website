'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, FileText, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function LoremGeneratorPage() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [language, setLanguage] = useState<'latin' | 'chinese'>('latin');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  // 拉丁文 Lorem Ipsum 词汇
  const latinWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
  ];

  // 中文占位词汇
  const chineseWords = [
    '这是', '一个', '示例', '文本', '用于', '测试', '和', '演示', '目的',
    '我们', '可以', '使用', '这些', '内容', '来', '填充', '页面', '布局',
    '设计', '开发', '过程', '中', '经常', '需要', '占位', '文字', '来',
    '展示', '效果', '这样', '能够', '更好', '地', '预览', '最终', '结果',
    '文档', '编写', '网站', '建设', '应用', '程序', '界面', '设计',
    '用户', '体验', '产品', '功能', '系统', '平台', '服务', '解决',
    '方案', '技术', '创新', '数据', '分析', '管理', '优化', '提升'
  ];

  const getRandomWord = (words: string[]): string => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const generateWords = (wordCount: number): string => {
    const words = language === 'latin' ? latinWords : chineseWords;
    const result: string[] = [];
    
    if (startWithLorem && language === 'latin') {
      result.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      wordCount -= 5;
    }
    
    for (let i = 0; i < wordCount; i++) {
      result.push(getRandomWord(words));
    }
    
    return result.join(' ');
  };

  const generateSentences = (sentenceCount: number): string => {
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words per sentence
      let sentence = generateWords(wordCount);
      
      // 首字母大写
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      
      // 添加标点符号
      const punctuation = Math.random() < 0.1 ? '!' : Math.random() < 0.1 ? '?' : '.';
      sentence += punctuation;
      
      sentences.push(sentence);
    }
    
    return sentences.join(' ');
  };

  const generateParagraphs = (paragraphCount: number): string => {
    const paragraphs: string[] = [];
    
    for (let i = 0; i < paragraphCount; i++) {
      const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
      const paragraph = generateSentences(sentenceCount);
      paragraphs.push(paragraph);
    }
    
    return paragraphs.join('\n\n');
  };

  const generate = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        result = generateSentences(count);
        break;
      case 'paragraphs':
        result = generateParagraphs(count);
        break;
    }
    
    setOutput(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  // 初始生成
  React.useEffect(() => {
    generate();
  }, [type, count, language, startWithLorem]);

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
          Lorem 文本生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成占位文本，支持中文和拉丁文，用于设计和开发测试
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>生成设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 语言选择 */}
              <div>
                <label className="block text-sm font-medium mb-2">语言</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="latin"
                      checked={language === 'latin'}
                      onChange={(e) => setLanguage(e.target.value as 'latin')}
                      className="rounded"
                    />
                    <span className="text-sm">拉丁文 (Lorem Ipsum)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="chinese"
                      checked={language === 'chinese'}
                      onChange={(e) => setLanguage(e.target.value as 'chinese')}
                      className="rounded"
                    />
                    <span className="text-sm">中文</span>
                  </label>
                </div>
              </div>

              {/* 生成类型 */}
              <div>
                <label className="block text-sm font-medium mb-2">生成类型</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  <option value="words">单词</option>
                  <option value="sentences">句子</option>
                  <option value="paragraphs">段落</option>
                </select>
              </div>

              {/* 数量 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  数量: {count}
                </label>
                <input
                  type="range"
                  min="1"
                  max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>{type === 'words' ? 100 : type === 'sentences' ? 20 : 10}</span>
                </div>
              </div>

              {/* Lorem 开头选项 */}
              {language === 'latin' && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">以 "Lorem ipsum" 开头</span>
                  </label>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="space-y-2">
                <Button onClick={generate} className="w-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  重新生成
                </Button>
                {output && (
                  <>
                    <Button onClick={copyToClipboard} variant="outline" className="w-full flex items-center gap-2">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          复制文本
                        </>
                      )}
                    </Button>
                    <Button onClick={clearOutput} variant="outline" className="w-full">
                      清空
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>生成的文本</CardTitle>
            </CardHeader>
            <CardContent>
              {output ? (
                <div className="space-y-4">
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 text-sm resize-none"
                  />
                  
                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-medium">{output.split(' ').length}</div>
                      <div className="text-muted-foreground">单词</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-medium">{output.split(/[.!?]+/).filter(s => s.trim()).length}</div>
                      <div className="text-muted-foreground">句子</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-medium">{output.split('\n\n').length}</div>
                      <div className="text-muted-foreground">段落</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  点击"重新生成"按钮开始生成文本
                </div>
              )}
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
            <h4 className="font-medium mb-2">什么是 Lorem Ipsum？</h4>
            <p className="text-sm text-muted-foreground">
              Lorem Ipsum 是印刷和排版行业的标准占位文本，自16世纪以来一直被使用。它基于西塞罗的拉丁文著作，经过修改后成为无意义但类似自然语言的文本。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 网页设计和原型制作</li>
              <li>• 印刷品排版测试</li>
              <li>• 应用界面设计</li>
              <li>• 文档模板创建</li>
              <li>• 内容管理系统测试</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">优势</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 不会分散注意力到内容本身</li>
              <li>• 字母分布接近正常文本</li>
              <li>• 行业标准，广泛认知</li>
              <li>• 支持多种长度需求</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
