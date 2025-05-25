'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, FileText, Minimize, Maximize } from 'lucide-react';
import Link from 'next/link';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('无效的 JSON 格式');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError('无效的 JSON 格式');
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError('');
      alert('JSON 格式正确！');
    } catch (err) {
      setError('无效的 JSON 格式');
    }
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

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadExample = () => {
    const example = {
      "name": "张三",
      "age": 30,
      "city": "北京",
      "hobbies": ["阅读", "游泳", "编程"],
      "address": {
        "street": "中关村大街",
        "number": 123,
        "zipcode": "100080"
      },
      "isActive": true,
      "score": null
    };
    setInput(JSON.stringify(example));
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
          JSON 格式化工具
        </h1>
        <p className="text-muted-foreground mt-2">
          格式化、压缩和验证 JSON 数据
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={formatJson} className="flex items-center gap-2">
          <Maximize className="h-4 w-4" />
          格式化
        </Button>
        <Button onClick={minifyJson} variant="outline" className="flex items-center gap-2">
          <Minimize className="h-4 w-4" />
          压缩
        </Button>
        <Button onClick={validateJson} variant="outline">
          验证
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
            <CardTitle>输入 JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入 JSON 数据..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              输出结果
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
              placeholder="格式化后的 JSON 将显示在这里..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
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
            <h4 className="font-medium mb-2">功能介绍</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>格式化</strong>：将压缩的 JSON 格式化为易读的缩进格式</li>
              <li>• <strong>压缩</strong>：移除所有空格和换行，压缩 JSON 大小</li>
              <li>• <strong>验证</strong>：检查 JSON 语法是否正确</li>
              <li>• <strong>复制</strong>：一键复制格式化后的结果</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">快捷键</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + A</kbd> 全选文本</li>
              <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + C</kbd> 复制文本</li>
              <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + V</kbd> 粘贴文本</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
