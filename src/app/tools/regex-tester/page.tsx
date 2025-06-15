'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  FileDown,
  ArrowLeft,
} from 'lucide-react';
import { ToolLayout } from '@/components/features/tools/tool-layout';
import { ToolActions } from '@/components/features/tools/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);
      setError('');

      if (!testString) {
        setMatches([]);
        return;
      }

      const allMatches: RegExpMatchArray[] = [];
      let match;

      if (flags.includes('g')) {
        // 全局匹配
        const globalRegex = new RegExp(pattern, flags);
        while ((match = globalRegex.exec(testString)) !== null) {
          allMatches.push(match);
          if (match.index === globalRegex.lastIndex) {
            break; // 避免无限循环
          }
        }
      } else {
        // 单次匹配
        match = regex.exec(testString);
        if (match) {
          allMatches.push(match);
        }
      }

      setMatches(allMatches);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : '正则表达式语法错误');
      setMatches([]);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const loadExample = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    setFlags('gi');
    setTestString('联系我们：admin@example.com 或 support@test.org\n技术支持：tech@company.net');
  };

  const clearAll = () => {
    setPattern('');
    setFlags('g');
    setTestString('');
    setMatches([]);
    setError('');
  };

  const commonPatterns = [
    {
      name: '邮箱地址',
      pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      flags: 'gi',
      example: 'user@example.com, admin@test.org',
    },
    {
      name: '手机号码',
      pattern: '1[3-9]\\d{9}',
      flags: 'g',
      example: '13812345678, 15987654321',
    },
    {
      name: 'URL 链接',
      pattern:
        'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?',
      flags: 'gi',
      example: 'https://www.example.com, http://test.org/path',
    },
    {
      name: 'IPv4 地址',
      pattern:
        '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: 'g',
      example: '192.168.1.1, 10.0.0.1, 255.255.255.255',
    },
    {
      name: '中文字符',
      pattern: '[\\u4e00-\\u9fa5]+',
      flags: 'g',
      example: '这是中文字符，包含汉字',
    },
    {
      name: '日期格式',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      flags: 'g',
      example: '2024-01-15, 2023-12-31',
    },
  ];

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (matches.length === 0) return text;

    let result = text;
    let offset = 0;

    matches.forEach((match, _index) => {
      if (match.index !== undefined) {
        const start = match.index + offset;
        const end = start + match[0].length;
        const highlighted = `<mark class="bg-yellow-200 dark:bg-yellow-800">${match[0]}</mark>`;
        result = result.slice(0, start) + highlighted + result.slice(end);
        offset += highlighted.length - match[0].length;
      }
    });

    return result;
  };

  const actions = [
    {
      label: '加载示例',
      onClick: loadExample,
      icon: FileDown,
      variant: 'outline' as const,
    },
    {
      label: '复制匹配项',
      onClick: () => copyToClipboard(matches.map(m => m[0]).join('\n')),
      icon: copied ? Check : Copy,
      variant: 'outline' as const,
      disabled: matches.length === 0,
    },
    {
      label: '清空',
      onClick: clearAll,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">正则表达式语法</h4>
        <ul className="text-sm text-muted-foreground dark:text-slate-400 space-y-1">
          <li>
            • <strong>.</strong> - 匹配任意字符（除换行符）
          </li>
          <li>
            • <strong>*</strong> - 匹配前面的字符0次或多次
          </li>
          <li>
            • <strong>+</strong> - 匹配前面的字符1次或多次
          </li>
          <li>
            • <strong>?</strong> - 匹配前面的字符0次或1次
          </li>
          <li>
            • <strong>^</strong> - 匹配字符串开始
          </li>
          <li>
            • <strong>$</strong> - 匹配字符串结束
          </li>
          <li>
            • <strong>[]</strong> - 字符类，匹配方括号内的任意字符
          </li>
          <li>
            • <strong>()</strong> - 分组，用于捕获匹配的子字符串
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">标志位说明</h4>
        <ul className="text-sm text-muted-foreground dark:text-slate-400 space-y-1">
          <li>
            • <strong>g</strong> - 全局匹配，查找所有匹配项
          </li>
          <li>
            • <strong>i</strong> - 忽略大小写
          </li>
          <li>
            • <strong>m</strong> - 多行模式，^和$匹配每行的开始和结束
          </li>
          <li>
            • <strong>s</strong> - 单行模式，.匹配换行符
          </li>
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
            <h1 className="text-3xl font-bold tracking-tight">正则表达式工具</h1>
            <p className="text-muted-foreground">
              强大的正则表达式测试工具，支持实时匹配、模式验证、语法高亮、常用模式库
            </p>
          </div>
        </div>
      </div>
      <ToolLayout
        title="正则表达式测试器"
        description="测试和验证正则表达式，查看匹配结果和分组信息"
        icon={Search}
        actions={<ToolActions actions={actions} />}
        helpContent={helpContent}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 正则表达式输入 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 正则表达式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  正则表达式
                  {pattern &&
                    (isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ))}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={pattern}
                    onChange={e => setPattern(e.target.value)}
                    placeholder="输入正则表达式..."
                    className="w-full p-4 font-mono text-sm rounded-md border bg-background dark:bg-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {error && (
                    <div className="mt-2 text-sm text-destructive dark:text-red-400 p-2 rounded">
                      {error}
                    </div>
                  )}
                </div>

                {/* 标志位 */}
                <div>
                  <label className="block text-sm font-medium mb-2">标志位</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { flag: 'g', name: '全局匹配', desc: '查找所有匹配项' },
                      { flag: 'i', name: '忽略大小写', desc: '不区分大小写' },
                      { flag: 'm', name: '多行模式', desc: '^和$匹配每行的开始和结束' },
                      { flag: 's', name: '单行模式', desc: '.匹配换行符' },
                    ].map(({ flag, name, desc }) => (
                      <label
                        key={flag}
                        className="flex items-center space-x-2 text-sm text-gray-900 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={flags.includes(flag)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFlags(flags + flag);
                            } else {
                              setFlags(flags.replace(flag, ''));
                            }
                          }}
                          className="rounded"
                        />
                        <span title={desc}>
                          {name} ({flag})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 测试字符串 */}
            <Card>
              <CardHeader>
                <CardTitle>测试字符串</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={testString}
                  onChange={e => setTestString(e.target.value)}
                  placeholder="输入要测试的字符串..."
                  className="w-full min-h-[200px] p-4 font-mono text-sm rounded-md border bg-background dark:bg-slate-900 dark:text-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>

            {/* 匹配结果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  匹配结果 ({matches.length} 个匹配)
                  {matches.length > 0 && (
                    <Button
                      onClick={() => copyToClipboard(matches.map(m => m[0]).join('\n'))}
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
                          复制匹配项
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {pattern && testString ? '没有找到匹配项' : '请输入正则表达式和测试字符串'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 高亮显示 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">高亮显示</h4>
                      <div
                        className="p-3 border border-border rounded-lg bg-muted/50 text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(testString, matches),
                        }}
                      />
                    </div>

                    {/* 匹配详情 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">匹配详情</h4>
                      <div className="space-y-2 p-4 rounded-lg border bg-background dark:bg-slate-900 max-h-48 overflow-y-auto">
                        {matches.map((match, index) => (
                          <div key={index} className="p-2 border border-border rounded text-sm">
                            <div className="font-mono font-medium">{match[0]}</div>
                            <div className="text-muted-foreground dark:text-slate-400 text-xs">
                              位置: {match.index} - {(match.index || 0) + match[0].length - 1}
                              {match.length > 1 && (
                                <span className="ml-2">
                                  分组:{' '}
                                  {match
                                    .slice(1)
                                    .map((group, i) => `$${i + 1}="${group}"`)
                                    .join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 常用模式 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>常用正则模式</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonPatterns.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setPattern(item.pattern);
                        setFlags(item.flags);
                        setTestString(item.example);
                      }}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="font-mono text-xs text-muted-foreground dark:text-slate-400 mt-1 break-all">
                        {item.pattern}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                        示例: {item.example}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ToolLayout>
    </div>
  );
}
