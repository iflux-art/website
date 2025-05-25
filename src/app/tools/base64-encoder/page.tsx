'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Lock, Unlock, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function Base64EncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('编码失败，请检查输入内容');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('解码失败，请检查 Base64 格式是否正确');
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
      setInput('Hello, World! 你好，世界！');
    } else {
      setInput('SGVsbG8sIFdvcmxkISDkvaDlpb3vvIzkuJbnlYzvvIE=');
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
          {mode === 'encode' ? <Lock className="h-8 w-8" /> : <Unlock className="h-8 w-8" />}
          Base64 {mode === 'encode' ? '编码' : '解码'}工具
        </h1>
        <p className="text-muted-foreground mt-2">
          Base64 编码和解码工具，支持中文字符
        </p>
      </div>

      {/* 模式切换 */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            onClick={() => setMode('encode')}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            编码
          </Button>
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            onClick={() => setMode('decode')}
            className="flex items-center gap-2"
          >
            <Unlock className="h-4 w-4" />
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
        <Button onClick={process}>
          {mode === 'encode' ? '编码' : '解码'}
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
            <CardTitle>
              {mode === 'encode' ? '原始文本' : 'Base64 编码'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode' 
                  ? '在此输入要编码的文本...' 
                  : '在此输入要解码的 Base64 字符串...'
              }
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
              {mode === 'encode' ? 'Base64 编码' : '解码结果'}
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
                mode === 'encode' 
                  ? '编码后的 Base64 字符串将显示在这里...' 
                  : '解码后的原始文本将显示在这里...'
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
            <h4 className="font-medium mb-2">什么是 Base64？</h4>
            <p className="text-sm text-muted-foreground">
              Base64 是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在HTTP环境下传递较长的标识信息，或者在需要将二进制数据存储在文本格式中的场景。
            </p>
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
              <li>• 在 URL 中传递二进制数据</li>
              <li>• 在 JSON 中嵌入图片数据</li>
              <li>• 在邮件中传输附件</li>
              <li>• 在 HTML 中嵌入小图片</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
