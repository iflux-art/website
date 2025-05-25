'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Link as LinkIcon, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('编码失败，请检查输入内容');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('解码失败，请检查 URL 编码格式是否正确');
      setOutput('');
    }
  };

  const process = () => {
    if (mode === 'encode') {
      encode();
    } else {
      decode();
    }
  };

  const switchMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
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
    if (mode === 'encode') {
      setInput('https://example.com/search?q=你好世界&type=文档');
    } else {
      setInput(
        'https%3A//example.com/search%3Fq%3D%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%26type%3D%E6%96%87%E6%A1%A3'
      );
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
          <LinkIcon className="h-8 w-8" />
          URL {mode === 'encode' ? '编码' : '解码'}工具
        </h1>
        <p className="text-muted-foreground mt-2">URL 编码和解码工具，处理特殊字符和中文字符</p>
      </div>

      {/* 模式切换 */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            onClick={() => setMode('encode')}
          >
            编码
          </Button>
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            onClick={() => setMode('decode')}
          >
            解码
          </Button>
        </div>
        <Button onClick={switchMode} variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          交换输入输出
        </Button>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={process}>{mode === 'encode' ? '编码' : '解码'}</Button>
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
            <CardTitle>{mode === 'encode' ? '原始 URL' : 'URL 编码'}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                mode === 'encode' ? '在此输入要编码的 URL...' : '在此输入要解码的 URL 编码字符串...'
              }
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
            )}
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mode === 'encode' ? 'URL 编码' : '解码结果'}
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
              placeholder={
                mode === 'encode' ? '编码后的 URL 将显示在这里...' : '解码后的 URL 将显示在这里...'
              }
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
            <h4 className="font-medium mb-2">什么是 URL 编码？</h4>
            <p className="text-sm text-muted-foreground">
              URL 编码（也称为百分号编码）是一种将特殊字符转换为 %XX 格式的编码方式，其中 XX
              是字符的十六进制 ASCII 值。这样可以确保 URL 中的特殊字符不会被误解。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见编码字符</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">空格 → %20</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">! → %21</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono"># → %23</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">$ → %24</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">& → %26</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">+ → %2B</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">= → %3D</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-mono">? → %3F</div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 支持中文字符的编码和解码</li>
              <li>• 自动处理 UTF-8 编码</li>
              <li>• 实时错误检测和提示</li>
              <li>• 一键复制结果</li>
              <li>• 支持输入输出交换</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 在 URL 中传递包含特殊字符的参数</li>
              <li>• 处理搜索查询中的中文字符</li>
              <li>• API 接口参数编码</li>
              <li>• 表单数据提交时的编码处理</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
