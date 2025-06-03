'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Lock, Unlock, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function Base64EncoderPage() {
  const [activeTab, setActiveTab] = useState('base64');
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
    } catch {
      setError('编码失败，请检查输入内容');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch {
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
    if (activeTab === 'base64') {
      if (mode === 'encode') {
        setInput('Hello, World! 你好，世界！');
      } else {
        setInput('SGVsbG8sIFdvcmxkISDkvaDlpb3vvIzkuJbnlYzvvIE=');
      }
    } else if (activeTab === 'url') {
      if (mode === 'encode') {
        setInput('https://example.com/search?q=你好世界&type=text');
      } else {
        setInput(
          'https%3A//example.com/search%3Fq%3D%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%26type%3Dtext'
        );
      }
    } else if (activeTab === 'html') {
      if (mode === 'encode') {
        setInput('<div class="example">Hello & "World"</div>');
      } else {
        setInput('&lt;div class=&quot;example&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;');
      }
    }
  };

  // URL编码/解码
  const urlEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setError('');
    } catch {
      setError('URL编码失败');
      setOutput('');
    }
  };

  const urlDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError('');
    } catch {
      setError('URL解码失败，请检查格式是否正确');
      setOutput('');
    }
  };

  // HTML编码/解码
  const htmlEncode = () => {
    try {
      const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('HTML编码失败');
      setOutput('');
    }
  };

  const htmlDecode = () => {
    try {
      const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('HTML解码失败');
      setOutput('');
    }
  };

  // 字符编码转换
  const charsetConvert = () => {
    try {
      if (mode === 'encode') {
        // 转换为Unicode编码
        const unicode = input
          .split('')
          .map(char => {
            const code = char.charCodeAt(0);
            return `\\u${code.toString(16).padStart(4, '0')}`;
          })
          .join('');
        setOutput(unicode);
      } else {
        // 从Unicode解码
        const decoded = input.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
          return String.fromCharCode(parseInt(code, 16));
        });
        setOutput(decoded);
      }
      setError('');
    } catch {
      setError('字符编码转换失败');
      setOutput('');
    }
  };

  // 统一处理函数
  const processText = () => {
    if (activeTab === 'base64') {
      process();
    } else if (activeTab === 'url') {
      if (mode === 'encode') {
        urlEncode();
      } else {
        urlDecode();
      }
    } else if (activeTab === 'html') {
      if (mode === 'encode') {
        htmlEncode();
      } else {
        htmlDecode();
      }
    } else if (activeTab === 'charset') {
      charsetConvert();
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
          编码工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          编码转换工具，包括Base64、URL、HTML编解码、字符编码转换
        </p>
      </div>

      {/* 标签页 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { key: 'base64', name: 'Base64', icon: Lock },
              { key: 'url', name: 'URL编码', icon: ArrowUpDown },
              { key: 'html', name: 'HTML编码', icon: Check },
              { key: 'charset', name: '字符编码', icon: ArrowUpDown },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setInput('');
                    setOutput('');
                    setError('');
                  }}
                  className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
        <Button onClick={processText}>{mode === 'encode' ? '编码' : '解码'}</Button>
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
              {mode === 'encode'
                ? '原始文本'
                : activeTab === 'base64'
                ? 'Base64 编码'
                : activeTab === 'url'
                ? 'URL 编码'
                : activeTab === 'html'
                ? 'HTML 编码'
                : 'Unicode 编码'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? '在此输入要编码的文本...'
                  : activeTab === 'base64'
                  ? '在此输入要解码的 Base64 字符串...'
                  : activeTab === 'url'
                  ? '在此输入要解码的 URL 编码字符串...'
                  : activeTab === 'html'
                  ? '在此输入要解码的 HTML 编码字符串...'
                  : '在此输入要解码的 Unicode 编码字符串...'
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
              {mode === 'encode'
                ? activeTab === 'base64'
                  ? 'Base64 编码'
                  : activeTab === 'url'
                  ? 'URL 编码'
                  : activeTab === 'html'
                  ? 'HTML 编码'
                  : 'Unicode 编码'
                : '解码结果'}
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
                  ? activeTab === 'base64'
                    ? '编码后的 Base64 字符串将显示在这里...'
                    : activeTab === 'url'
                    ? '编码后的 URL 字符串将显示在这里...'
                    : activeTab === 'html'
                    ? '编码后的 HTML 字符串将显示在这里...'
                    : '编码后的 Unicode 字符串将显示在这里...'
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
              Base64
              是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在HTTP环境下传递较长的标识信息，或者在需要将二进制数据存储在文本格式中的场景。
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
