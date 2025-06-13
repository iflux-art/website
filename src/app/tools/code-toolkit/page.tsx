'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/cards/card';
import { ArrowLeft, Copy, Check, Code, Download, Upload } from 'lucide-react';
import Link from 'next/link';

export default function CodeToolkitPage() {
  const [activeTab, setActiveTab] = useState<'format' | 'minify' | 'convert' | 'encode'>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'html' | 'css' | 'json' | 'xml' | 'sql'>(
    'javascript'
  );
  const [indentSize, setIndentSize] = useState(2);
  const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 格式化JavaScript/TypeScript
  const formatJavaScript = (code: string): string => {
    try {
      // 简化的JavaScript格式化
      const formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s*\*\s*/g, ' * ')
        .replace(/\s*\/\s*/g, ' / ');

      return addIndentation(formatted);
    } catch {
      throw new Error('JavaScript格式化失败');
    }
  };

  // 格式化HTML
  const formatHTML = (code: string): string => {
    try {
      const formatted = code.replace(/></g, '>\n<').replace(/^\s+|\s+$/g, '');

      return addIndentation(formatted);
    } catch {
      throw new Error('HTML格式化失败');
    }
  };

  // 格式化CSS
  const formatCSS = (code: string): string => {
    try {
      const formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/:\s*/g, ': ')
        .replace(/,\s*/g, ',\n');

      return addIndentation(formatted);
    } catch {
      throw new Error('CSS格式化失败');
    }
  };

  // 格式化JSON
  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, indentType === 'spaces' ? indentSize : '\t');
    } catch {
      throw new Error('JSON格式错误，请检查语法');
    }
  };

  // 格式化XML
  const formatXML = (code: string): string => {
    try {
      const formatted = code.replace(/></g, '>\n<').replace(/^\s+|\s+$/g, '');

      return addIndentation(formatted);
    } catch {
      throw new Error('XML格式化失败');
    }
  };

  // 格式化SQL
  const formatSQL = (code: string): string => {
    try {
      const keywords = [
        'SELECT',
        'FROM',
        'WHERE',
        'JOIN',
        'INNER JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'ORDER BY',
        'GROUP BY',
        'HAVING',
        'INSERT',
        'UPDATE',
        'DELETE',
        'CREATE',
        'ALTER',
        'DROP',
      ];

      let formatted = code.toUpperCase();

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
      });

      formatted = formatted
        .replace(/,/g, ',\n')
        .replace(/\(/g, '(\n')
        .replace(/\)/g, '\n)')
        .replace(/^\s+|\s+$/g, '');

      return addIndentation(formatted);
    } catch {
      throw new Error('SQL格式化失败');
    }
  };

  // 添加缩进
  const addIndentation = (code: string): string => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indent = indentType === 'spaces' ? ' '.repeat(indentSize) : '\t';

    return lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        // 减少缩进
        if (trimmed.includes('}') || trimmed.includes('</') || trimmed.includes(')')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indent.repeat(indentLevel) + trimmed;

        // 增加缩进
        if (
          trimmed.includes('{') ||
          (trimmed.includes('<') && !trimmed.includes('</')) ||
          trimmed.includes('(')
        ) {
          indentLevel++;
        }

        return indentedLine;
      })
      .join('\n');
  };

  // 执行格式化
  const formatCode = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      let formatted = '';

      switch (language) {
        case 'javascript': {
          formatted = formatJavaScript(input);
          break;
        }
        case 'html': {
          formatted = formatHTML(input);
          break;
        }
        case 'css': {
          formatted = formatCSS(input);
          break;
        }
        case 'json': {
          formatted = formatJSON(input);
          break;
        }
        case 'xml': {
          formatted = formatXML(input);
          break;
        }
        case 'sql': {
          formatted = formatSQL(input);
          break;
        }
        default: {
          formatted = input;
        }
      }

      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '格式化失败');
      setOutput('');
    }
  };

  // 压缩代码
  const minifyCode = () => {
    if (!input.trim()) return;

    try {
      let minified = '';

      switch (language) {
        case 'javascript': {
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .trim();
          break;
        }
        case 'css': {
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/{\s*/g, '{')
            .replace(/}\s*/g, '}')
            .trim();
          break;
        }
        case 'json': {
          const parsed = JSON.parse(input);
          minified = JSON.stringify(parsed);
          break;
        }
        case 'html':
        case 'xml': {
          minified = input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
          break;
        }
        default: {
          minified = input.replace(/\s+/g, ' ').trim();
        }
      }

      setOutput(minified);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '压缩失败');
    }
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

  // 下载文件
  const downloadFile = () => {
    if (!output) return;

    const extensions: { [key: string]: string } = {
      javascript: 'js',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml',
      sql: 'sql',
    };

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 上传文件
  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // 清空
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  // 加载示例
  const loadExample = () => {
    const examples: { [key: string]: string } = {
      javascript: `function hello(name){if(name){console.log("Hello, "+name+"!");}else{console.log("Hello, World!");}}`,
      html: `<div><h1>Title</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`,
      css: `.container{display:flex;justify-content:center;align-items:center;}.button{background-color:#007bff;color:white;padding:10px 20px;border:none;border-radius:4px;}`,
      json: `{"name":"John","age":30,"city":"New York","hobbies":["reading","swimming","coding"]}`,
      xml: `<root><person><name>John</name><age>30</age><city>New York</city></person></root>`,
      sql: `select u.name,u.email,p.title from users u inner join posts p on u.id=p.user_id where u.active=1 order by p.created_at desc`,
    };

    setInput(examples[language] || '');
  };

  // 实时格式化
  React.useEffect(() => {
    if (input) {
      formatCode();
    }
  }, [input, language, indentSize, indentType]);

  const tabsData = [
    { key: 'format', name: '代码格式化', icon: Code },
    { key: 'minify', name: '代码压缩', icon: Code },
    { key: 'convert', name: 'JSON/CSV转换', icon: Code },
    { key: 'encode', name: 'HTML编解码', icon: Code },
  ] as const;

  const languages = [
    { value: 'javascript', name: 'JavaScript/TypeScript' },
    { value: 'html', name: 'HTML' },
    { value: 'css', name: 'CSS' },
    { value: 'json', name: 'JSON' },
    { value: 'xml', name: 'XML' },
    { value: 'sql', name: 'SQL' },
  ];

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
            <h1 className="text-3xl font-bold tracking-tight">代码工具箱</h1>
            <p className="text-muted-foreground">
              一站式代码处理工具，支持代码格式化、压缩、JSON/CSV转换、HTML编解码等功能
            </p>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabsData.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    activeTab === tab.key
                      ? 'px-4 py-2 rounded-md bg-primary text-primary-foreground dark:bg-slate-700'
                      : 'px-4 py-2 rounded-md hover:bg-accent dark:hover:bg-slate-800'
                  }
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 设置面板 */}
      {(activeTab === 'format' || activeTab === 'minify') && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{activeTab === 'format' ? '格式化设置' : '压缩设置'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  语言
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as typeof language)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'format' && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      缩进类型
                    </label>
                    <select
                      value={indentType}
                      onChange={e => setIndentType(e.target.value as typeof indentType)}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="spaces">空格</option>
                      <option value="tabs">制表符</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      缩进大小
                    </label>
                    <select
                      value={indentSize}
                      onChange={e => setIndentSize(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                      disabled={indentType === 'tabs'}
                    >
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex items-end">
                <label className="cursor-pointer w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      上传文件
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".js,.ts,.html,.css,.json,.xml,.sql,.txt"
                    onChange={uploadFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {activeTab === 'format' && (
          <>
            <Button onClick={formatCode} className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              格式化
            </Button>
            <Button onClick={loadExample} variant="outline">
              加载示例
            </Button>
          </>
        )}
        {activeTab === 'minify' && (
          <Button onClick={minifyCode} className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            压缩代码
          </Button>
        )}
        {activeTab === 'convert' && (
          <Button
            onClick={() => {
              if (!input.trim()) {
                setError('请输入数据');
                return;
              }
              setError('');
              try {
                if (input.trim().startsWith('[') || input.trim().startsWith('{')) {
                  // JSON to CSV
                  const data = JSON.parse(input);
                  if (Array.isArray(data) && data.length > 0) {
                    const headers = Object.keys(data[0]);
                    const csvRows = [headers.join(',')];
                    data.forEach(row => {
                      const values = headers.map(header => {
                        const value = row[header];
                        return typeof value === 'string' && value.includes(',')
                          ? `"${value}"`
                          : value;
                      });
                      csvRows.push(values.join(','));
                    });
                    setOutput(csvRows.join('\n'));
                  } else {
                    setError('JSON数据格式不正确');
                  }
                } else {
                  // CSV to JSON
                  const lines = input.trim().split('\n');
                  const headers = lines[0].split(',').map(h => h.trim());
                  const result = [];
                  for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    const obj: Record<string, string> = {};
                    headers.forEach((header, index) => {
                      obj[header] = values[index] || '';
                    });
                    result.push(obj);
                  }
                  setOutput(JSON.stringify(result, null, 2));
                }
              } catch {
                setError('数据转换失败，请检查格式');
              }
            }}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            转换数据
          </Button>
        )}
        {activeTab === 'encode' && (
          <Button
            onClick={() => {
              if (!input.trim()) {
                setError('请输入内容');
                return;
              }
              setError('');
              try {
                if (input.includes('&lt;') || input.includes('&gt;') || input.includes('&amp;')) {
                  // HTML解码
                  const decoded = input
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&nbsp;/g, ' ');
                  setOutput(decoded);
                } else {
                  // HTML编码
                  const encoded = input
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/ /g, '&nbsp;');
                  setOutput(encoded);
                }
              } catch {
                setError('编解码失败');
              }
            }}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            编解码
          </Button>
        )}
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'format' && '输入代码'}
              {activeTab === 'minify' && '输入代码'}
              {activeTab === 'convert' && '输入数据 (JSON/CSV)'}
              {activeTab === 'encode' && '输入HTML内容'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                activeTab === 'format'
                  ? `输入${languages.find(l => l.value === language)?.name}代码...`
                  : activeTab === 'minify'
                  ? `输入${languages.find(l => l.value === language)?.name}代码...`
                  : activeTab === 'convert'
                  ? 'JSON格式: [{"name":"张三","age":25}]\nCSV格式: name,age\n张三,25'
                  : activeTab === 'encode'
                  ? '输入HTML内容进行编码或解码...'
                  : '输入内容...'
              }
              className="w-full min-h-[200px] p-4 font-mono text-sm rounded-md border bg-background dark:bg-slate-900 dark:text-slate-50"
            />
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {activeTab === 'format' && '格式化结果'}
              {activeTab === 'minify' && '压缩结果'}
              {activeTab === 'convert' && '转换结果'}
              {activeTab === 'encode' && '编解码结果'}
              <div className="flex gap-2">
                {output && (
                  <>
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
                    <Button
                      onClick={downloadFile}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      下载
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={output}
              readOnly
              placeholder="格式化后的代码将显示在这里..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />

            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
            )}

            {output && !error && (
              <div className="mt-2 text-xs text-muted-foreground">
                行数: {output.split('\n').length} | 字符数: {output.length}
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
            <h4 className="font-medium mb-2">支持的语言</h4>
            <ul className="text-sm text-muted-foreground space-y-1 dark:text-slate-300">
              <li>
                • <strong>JavaScript/TypeScript</strong>：格式化JS/TS代码
              </li>
              <li>
                • <strong>HTML</strong>：格式化HTML标记
              </li>
              <li>
                • <strong>CSS</strong>：格式化样式表
              </li>
              <li>
                • <strong>JSON</strong>：格式化和验证JSON数据
              </li>
              <li>
                • <strong>XML</strong>：格式化XML文档
              </li>
              <li>
                • <strong>SQL</strong>：格式化数据库查询语句
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1 dark:text-slate-300">
              <li>
                • <strong>代码格式化</strong>：统一代码风格和缩进，支持多种编程语言
              </li>
              <li>
                • <strong>代码压缩</strong>：移除空白和注释，减小文件大小
              </li>
              <li>
                • <strong>JSON/CSV转换</strong>：JSON数组与CSV格式互相转换
              </li>
              <li>
                • <strong>HTML编解码</strong>：HTML特殊字符的编码和解码
              </li>
              <li>
                • <strong>文件上传</strong>：支持从本地文件导入代码
              </li>
              <li>
                • <strong>实时预览</strong>：输入时自动处理（格式化模式）
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1 dark:text-slate-300">
              <li>• 这是简化版的代码处理工具，复杂代码可能需要专业工具</li>
              <li>• 压缩功能会移除注释，请注意备份原始代码</li>
              <li>• JSON/CSV转换要求数据格式正确，错误时会显示提示</li>
              <li>• HTML编解码支持常见的HTML实体字符</li>
              <li>• 大文件处理可能较慢，建议分段处理</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
