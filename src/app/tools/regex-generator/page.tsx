'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Wand2, TestTube } from 'lucide-react';
import Link from 'next/link';

interface RegexPattern {
  name: string;
  description: string;
  pattern: string;
  flags: string;
  examples: string[];
}

export default function RegexGeneratorPage() {
  const [selectedCategory, setSelectedCategory] = useState('common');
  const [customPattern, setCustomPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [testResults, setTestResults] = useState<{ matches: string[]; isValid: boolean } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 预定义的正则表达式模式
  const regexPatterns: { [key: string]: RegexPattern[] } = {
    common: [
      {
        name: '邮箱地址',
        description: '匹配标准邮箱地址格式',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        flags: 'i',
        examples: ['user@example.com', 'test.email+tag@domain.co.uk']
      },
      {
        name: '手机号码',
        description: '匹配中国大陆手机号码',
        pattern: '^1[3-9]\\d{9}$',
        flags: '',
        examples: ['13812345678', '15987654321', '18666888999']
      },
      {
        name: 'URL地址',
        description: '匹配HTTP/HTTPS网址',
        pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
        flags: 'i',
        examples: ['https://www.example.com', 'http://test.org/path?param=value']
      },
      {
        name: 'IP地址',
        description: '匹配IPv4地址',
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        flags: '',
        examples: ['192.168.1.1', '10.0.0.1', '255.255.255.255']
      }
    ],
    validation: [
      {
        name: '强密码',
        description: '至少8位，包含大小写字母、数字和特殊字符',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        flags: '',
        examples: ['MyPass123!', 'SecureP@ssw0rd']
      },
      {
        name: '身份证号',
        description: '匹配18位身份证号码',
        pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
        flags: '',
        examples: ['110101199001011234', '320102198506152X']
      },
      {
        name: '银行卡号',
        description: '匹配银行卡号（13-19位数字）',
        pattern: '^[1-9]\\d{12,18}$',
        flags: '',
        examples: ['6222021234567890', '4367421234567890123']
      },
      {
        name: '中文姓名',
        description: '匹配中文姓名（2-4个汉字）',
        pattern: '^[\\u4e00-\\u9fa5]{2,4}$',
        flags: '',
        examples: ['张三', '李小明', '欧阳修']
      }
    ],
    format: [
      {
        name: '日期格式',
        description: '匹配YYYY-MM-DD格式日期',
        pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
        flags: '',
        examples: ['2023-12-25', '2024-01-01', '2022-06-15']
      },
      {
        name: '时间格式',
        description: '匹配HH:MM:SS格式时间',
        pattern: '^([01]?\\d|2[0-3]):[0-5]\\d:[0-5]\\d$',
        flags: '',
        examples: ['14:30:25', '09:05:00', '23:59:59']
      },
      {
        name: '颜色代码',
        description: '匹配十六进制颜色代码',
        pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
        flags: '',
        examples: ['#FF0000', '#00ff00', '#123', '#ABCDEF']
      },
      {
        name: '版本号',
        description: '匹配语义化版本号',
        pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
        flags: '',
        examples: ['1.0.0', '2.1.3-beta.1', '1.2.3+build.1']
      }
    ],
    text: [
      {
        name: '提取数字',
        description: '提取文本中的所有数字',
        pattern: '\\d+',
        flags: 'g',
        examples: ['价格是100元', '电话：123-456-7890']
      },
      {
        name: '提取中文',
        description: '提取文本中的中文字符',
        pattern: '[\\u4e00-\\u9fa5]+',
        flags: 'g',
        examples: ['Hello世界', 'English中文Mixed']
      },
      {
        name: '提取英文单词',
        description: '提取英文单词',
        pattern: '[a-zA-Z]+',
        flags: 'g',
        examples: ['Hello World 123', 'test-case_example']
      },
      {
        name: '空白字符',
        description: '匹配空格、制表符、换行符',
        pattern: '\\s+',
        flags: 'g',
        examples: ['word1   word2', 'line1\nline2\tword']
      }
    ]
  };

  // 测试正则表达式
  const testRegex = (pattern: string, flags: string = '') => {
    if (!pattern || !testString) {
      setTestResults(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex) || [];
      setTestResults({
        matches: Array.from(matches),
        isValid: true
      });
    } catch (error) {
      setTestResults({
        matches: [],
        isValid: false
      });
    }
  };

  // 复制正则表达式
  const copyRegex = async (pattern: string, flags: string = '') => {
    const fullPattern = flags ? `/${pattern}/${flags}` : pattern;
    try {
      await navigator.clipboard.writeText(fullPattern);
      setCopied(pattern);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 使用预定义模式
  const usePattern = (pattern: RegexPattern) => {
    setCustomPattern(pattern.pattern);
    setTestString(pattern.examples[0] || '');
    testRegex(pattern.pattern, pattern.flags);
  };

  // 实时测试自定义模式
  React.useEffect(() => {
    if (customPattern) {
      testRegex(customPattern);
    }
  }, [customPattern, testString]);

  const categories = [
    { key: 'common', name: '常用模式' },
    { key: 'validation', name: '验证模式' },
    { key: 'format', name: '格式模式' },
    { key: 'text', name: '文本处理' },
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
          <Wand2 className="h-8 w-8" />
          正则表达式生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          快速生成常用正则表达式，支持实时测试和验证
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模式库 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>正则表达式模式库</CardTitle>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {regexPatterns[selectedCategory]?.map((pattern, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{pattern.name}</h3>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => usePattern(pattern)}
                          variant="outline"
                          size="sm"
                        >
                          使用
                        </Button>
                        <Button
                          onClick={() => copyRegex(pattern.pattern, pattern.flags)}
                          variant="ghost"
                          size="sm"
                        >
                          {copied === pattern.pattern ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-mono text-sm bg-background p-2 rounded border mb-2">
                      {pattern.flags ? `/${pattern.pattern}/${pattern.flags}` : pattern.pattern}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <strong>示例：</strong> {pattern.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 测试区域 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                正则测试
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 自定义正则 */}
              <div>
                <label className="block text-sm font-medium mb-2">正则表达式</label>
                <textarea
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  placeholder="输入正则表达式..."
                  className="w-full h-20 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 测试文本 */}
              <div>
                <label className="block text-sm font-medium mb-2">测试文本</label>
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="输入要测试的文本..."
                  className="w-full h-20 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 测试结果 */}
              {testResults && (
                <div>
                  <label className="block text-sm font-medium mb-2">测试结果</label>
                  {!testResults.isValid ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      正则表达式语法错误
                    </div>
                  ) : testResults.matches.length === 0 ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                      没有匹配结果
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm text-green-700 mb-2">
                        找到 {testResults.matches.length} 个匹配
                      </div>
                      <div className="space-y-1">
                        {testResults.matches.map((match, index) => (
                          <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                            {match}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              {customPattern && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyRegex(customPattern)}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    {copied === customPattern ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === customPattern ? '已复制' : '复制'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 正则表达式语法参考 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>正则表达式语法参考</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">基本字符</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">.</code>
                  <span>匹配任意字符</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">\d</code>
                  <span>匹配数字</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">\w</code>
                  <span>匹配字母数字下划线</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">\s</code>
                  <span>匹配空白字符</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">量词</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">*</code>
                  <span>0次或多次</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">+</code>
                  <span>1次或多次</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">?</code>
                  <span>0次或1次</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">{`{n,m}`}</code>
                  <span>n到m次</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">位置</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">^</code>
                  <span>行首</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">$</code>
                  <span>行尾</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">\b</code>
                  <span>单词边界</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">(?=...)</code>
                  <span>正向先行断言</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">字符类</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">[abc]</code>
                  <span>匹配a、b或c</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">[a-z]</code>
                  <span>匹配小写字母</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">[^abc]</code>
                  <span>不匹配a、b、c</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">[0-9]</code>
                  <span>匹配数字</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">分组</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">(abc)</code>
                  <span>捕获分组</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">(?:abc)</code>
                  <span>非捕获分组</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">a|b</code>
                  <span>匹配a或b</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">\1</code>
                  <span>反向引用</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">修饰符</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">i</code>
                  <span>忽略大小写</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">g</code>
                  <span>全局匹配</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">m</code>
                  <span>多行模式</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-1 rounded">s</code>
                  <span>单行模式</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
