'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Code, Download, Upload } from 'lucide-react';
import Link from 'next/link';

export default function CodeFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'html' | 'css' | 'json' | 'xml' | 'sql'>('javascript');
  const [indentSize, setIndentSize] = useState(2);
  const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 格式化JavaScript/TypeScript
  const formatJavaScript = (code: string): string => {
    try {
      // 简化的JavaScript格式化
      let formatted = code
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
    } catch (err) {
      throw new Error('JavaScript格式化失败');
    }
  };

  // 格式化HTML
  const formatHTML = (code: string): string => {
    try {
      let formatted = code
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');

      return addIndentation(formatted);
    } catch (err) {
      throw new Error('HTML格式化失败');
    }
  };

  // 格式化CSS
  const formatCSS = (code: string): string => {
    try {
      let formatted = code
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/:\s*/g, ': ')
        .replace(/,\s*/g, ',\n');

      return addIndentation(formatted);
    } catch (err) {
      throw new Error('CSS格式化失败');
    }
  };

  // 格式化JSON
  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, indentType === 'spaces' ? indentSize : '\t');
    } catch (err) {
      throw new Error('JSON格式错误，请检查语法');
    }
  };

  // 格式化XML
  const formatXML = (code: string): string => {
    try {
      let formatted = code
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');

      return addIndentation(formatted);
    } catch (err) {
      throw new Error('XML格式化失败');
    }
  };

  // 格式化SQL
  const formatSQL = (code: string): string => {
    try {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
                       'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
      
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
    } catch (err) {
      throw new Error('SQL格式化失败');
    }
  };

  // 添加缩进
  const addIndentation = (code: string): string => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indent = indentType === 'spaces' ? ' '.repeat(indentSize) : '\t';

    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // 减少缩进
      if (trimmed.includes('}') || trimmed.includes('</') || trimmed.includes(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indentedLine = indent.repeat(indentLevel) + trimmed;

      // 增加缩进
      if (trimmed.includes('{') || trimmed.includes('<') && !trimmed.includes('</') || trimmed.includes('(')) {
        indentLevel++;
      }

      return indentedLine;
    }).join('\n');
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
        case 'javascript':
          formatted = formatJavaScript(input);
          break;
        case 'html':
          formatted = formatHTML(input);
          break;
        case 'css':
          formatted = formatCSS(input);
          break;
        case 'json':
          formatted = formatJSON(input);
          break;
        case 'xml':
          formatted = formatXML(input);
          break;
        case 'sql':
          formatted = formatSQL(input);
          break;
        default:
          formatted = input;
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
        case 'javascript':
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .trim();
          break;
        case 'css':
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/{\s*/g, '{')
            .replace(/}\s*/g, '}')
            .trim();
          break;
        case 'json':
          const parsed = JSON.parse(input);
          minified = JSON.stringify(parsed);
          break;
        case 'html':
        case 'xml':
          minified = input
            .replace(/>\s+</g, '><')
            .replace(/\s+/g, ' ')
            .trim();
          break;
        default:
          minified = input.replace(/\s+/g, ' ').trim();
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
      sql: 'sql'
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
    reader.onload = (e) => {
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
      sql: `select u.name,u.email,p.title from users u inner join posts p on u.id=p.user_id where u.active=1 order by p.created_at desc`
    };

    setInput(examples[language] || '');
  };

  // 实时格式化
  React.useEffect(() => {
    if (input) {
      formatCode();
    }
  }, [input, language, indentSize, indentType]);

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
          <Code className="h-8 w-8" />
          代码格式化工具
        </h1>
        <p className="text-muted-foreground mt-2">
          格式化和压缩多种编程语言的代码
        </p>
      </div>

      {/* 设置面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>格式化设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">缩进类型</label>
              <select
                value={indentType}
                onChange={(e) => setIndentType(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="spaces">空格</option>
                <option value="tabs">制表符</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">缩进大小</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="w-full p-2 border border-border rounded-lg bg-background"
                disabled={indentType === 'tabs'}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>

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

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={formatCode} className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          格式化
        </Button>
        <Button onClick={minifyCode} variant="outline">
          压缩代码
        </Button>
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
            <CardTitle>输入代码</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入${languages.find(l => l.value === language)?.name}代码...`}
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              格式化结果
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
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
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
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>JavaScript/TypeScript</strong>：格式化JS/TS代码</li>
              <li>• <strong>HTML</strong>：格式化HTML标记</li>
              <li>• <strong>CSS</strong>：格式化样式表</li>
              <li>• <strong>JSON</strong>：格式化和验证JSON数据</li>
              <li>• <strong>XML</strong>：格式化XML文档</li>
              <li>• <strong>SQL</strong>：格式化数据库查询语句</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 自动格式化：统一代码风格和缩进</li>
              <li>• 代码压缩：移除空白和注释，减小文件大小</li>
              <li>• 语法验证：检查JSON等格式的语法错误</li>
              <li>• 文件上传：支持从本地文件导入代码</li>
              <li>• 实时预览：输入时自动格式化</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 这是简化版的格式化工具，复杂代码可能需要专业工具</li>
              <li>• 压缩功能会移除注释，请注意备份</li>
              <li>• JSON格式化会验证语法，错误时会显示提示</li>
              <li>• 大文件处理可能较慢，建议分段处理</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
