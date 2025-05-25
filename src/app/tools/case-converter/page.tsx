'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Type, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function CaseConverterPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({
    lowercase: '',
    uppercase: '',
    titleCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
    constantCase: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  const convertText = (text: string) => {
    // 小写
    const lowercase = text.toLowerCase();
    
    // 大写
    const uppercase = text.toUpperCase();
    
    // 标题格式（每个单词首字母大写）
    const titleCase = text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    
    // 驼峰命名（第一个单词小写，后续单词首字母大写）
    const camelCase = text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
    
    // 帕斯卡命名（所有单词首字母大写）
    const pascalCase = text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
    
    // 蛇形命名（下划线分隔，小写）
    const snakeCase = text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
    
    // 短横线命名（连字符分隔，小写）
    const kebabCase = text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
    
    // 常量命名（下划线分隔，大写）
    const constantCase = text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toUpperCase())
      .join('_');

    setResults({
      lowercase,
      uppercase,
      titleCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase,
    });
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    if (text.trim()) {
      convertText(text);
    } else {
      setResults({
        lowercase: '',
        uppercase: '',
        titleCase: '',
        camelCase: '',
        pascalCase: '',
        snakeCase: '',
        kebabCase: '',
        constantCase: '',
      });
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setResults({
      lowercase: '',
      uppercase: '',
      titleCase: '',
      camelCase: '',
      pascalCase: '',
      snakeCase: '',
      kebabCase: '',
      constantCase: '',
    });
  };

  const loadExample = () => {
    const example = 'Hello World Example Text';
    setInput(example);
    convertText(example);
  };

  const conversions = [
    {
      key: 'lowercase',
      name: '小写',
      description: '所有字母转为小写',
      example: 'hello world example text',
      value: results.lowercase,
    },
    {
      key: 'uppercase',
      name: '大写',
      description: '所有字母转为大写',
      example: 'HELLO WORLD EXAMPLE TEXT',
      value: results.uppercase,
    },
    {
      key: 'titleCase',
      name: '标题格式',
      description: '每个单词首字母大写',
      example: 'Hello World Example Text',
      value: results.titleCase,
    },
    {
      key: 'camelCase',
      name: '驼峰命名',
      description: '第一个单词小写，后续单词首字母大写',
      example: 'helloWorldExampleText',
      value: results.camelCase,
    },
    {
      key: 'pascalCase',
      name: '帕斯卡命名',
      description: '所有单词首字母大写，无分隔符',
      example: 'HelloWorldExampleText',
      value: results.pascalCase,
    },
    {
      key: 'snakeCase',
      name: '蛇形命名',
      description: '下划线分隔，小写字母',
      example: 'hello_world_example_text',
      value: results.snakeCase,
    },
    {
      key: 'kebabCase',
      name: '短横线命名',
      description: '连字符分隔，小写字母',
      example: 'hello-world-example-text',
      value: results.kebabCase,
    },
    {
      key: 'constantCase',
      name: '常量命名',
      description: '下划线分隔，大写字母',
      example: 'HELLO_WORLD_EXAMPLE_TEXT',
      value: results.constantCase,
    },
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
          <Type className="h-8 w-8" />
          大小写转换工具
        </h1>
        <p className="text-muted-foreground mt-2">
          转换文本为各种大小写格式，支持编程命名规范
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
      </div>

      {/* 输入区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>输入文本</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="在此输入要转换的文本..."
            className="w-full h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* 转换结果 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversions.map((conversion) => (
          <Card key={conversion.key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    {conversion.name}
                  </div>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    {conversion.description}
                  </p>
                </div>
                {conversion.value && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(conversion.value, conversion.key)}
                    className="flex items-center gap-2"
                  >
                    {copied === conversion.key ? (
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
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">示例</label>
                  <div className="p-2 bg-muted/50 rounded text-sm font-mono">
                    {conversion.example}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">结果</label>
                  <div className="p-2 border border-border rounded text-sm font-mono min-h-[2.5rem] bg-background">
                    {conversion.value || '请输入文本进行转换'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">命名规范说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>驼峰命名</strong>：JavaScript 变量名、函数名常用格式</li>
              <li>• <strong>帕斯卡命名</strong>：类名、构造函数常用格式</li>
              <li>• <strong>蛇形命名</strong>：Python、Ruby 变量名常用格式</li>
              <li>• <strong>短横线命名</strong>：CSS 类名、HTML 属性常用格式</li>
              <li>• <strong>常量命名</strong>：常量定义常用格式</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">适用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 编程时变量名格式转换</li>
              <li>• API 接口字段名格式统一</li>
              <li>• 数据库字段名转换</li>
              <li>• 文档标题格式化</li>
              <li>• 配置文件键名转换</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">转换规则</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 自动识别单词边界（空格、标点符号、大小写变化）</li>
              <li>• 保留原始单词，只改变格式</li>
              <li>• 移除或替换分隔符</li>
              <li>• 支持中英文混合文本</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
