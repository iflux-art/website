'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, ArrowUpDown, Shield, Key } from 'lucide-react';
import Link from 'next/link';

export default function TextEncryptPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [method, setMethod] = useState<'caesar' | 'base64' | 'reverse' | 'rot13'>('caesar');
  const [key, setKey] = useState('3');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 凯撒密码
  const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
    if (decrypt) shift = -shift;
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
    });
  };

  // ROT13
  const rot13 = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  // 反转文本
  const reverseText = (text: string): string => {
    return text.split('').reverse().join('');
  };

  // Base64 编码/解码
  const base64Encode = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (err) {
      throw new Error('Base64 编码失败');
    }
  };

  const base64Decode = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (err) {
      throw new Error('Base64 解码失败，请检查输入格式');
    }
  };

  // 执行加密/解密
  const processText = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      let result = '';
      
      switch (method) {
        case 'caesar':
          const shift = parseInt(key) || 0;
          result = caesarCipher(input, shift, mode === 'decrypt');
          break;
          
        case 'rot13':
          result = rot13(input);
          break;
          
        case 'reverse':
          result = reverseText(input);
          break;
          
        case 'base64':
          if (mode === 'encrypt') {
            result = base64Encode(input);
          } else {
            result = base64Decode(input);
          }
          break;
          
        default:
          result = input;
      }
      
      setOutput(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
      setOutput('');
    }
  };

  // 交换输入输出
  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
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

  // 清空
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  // 加载示例
  const loadExample = () => {
    setInput('Hello World! 你好世界！');
    setMethod('caesar');
    setKey('3');
    setMode('encrypt');
  };

  // 实时处理
  React.useEffect(() => {
    processText();
  }, [input, method, key, mode]);

  const methods = [
    { value: 'caesar', name: '凯撒密码', needsKey: true, keyLabel: '偏移量' },
    { value: 'rot13', name: 'ROT13', needsKey: false },
    { value: 'reverse', name: '反转文本', needsKey: false },
    { value: 'base64', name: 'Base64', needsKey: false },
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
          <Shield className="h-8 w-8" />
          文本加密解密
        </h1>
        <p className="text-muted-foreground mt-2">
          使用多种算法对文本进行加密和解密处理
        </p>
      </div>

      {/* 设置面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>加密设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 模式选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">模式</label>
              <div className="flex gap-1">
                <Button
                  variant={mode === 'encrypt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('encrypt')}
                  className="flex-1"
                >
                  加密
                </Button>
                <Button
                  variant={mode === 'decrypt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('decrypt')}
                  className="flex-1"
                >
                  解密
                </Button>
              </div>
            </div>

            {/* 算法选择 */}
            <div>
              <label className="block text-sm font-medium mb-2">算法</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {methods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 密钥输入 */}
            {methods.find(m => m.value === method)?.needsKey && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {methods.find(m => m.value === method)?.keyLabel}
                </label>
                <input
                  type="number"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                  min="0"
                  max="25"
                />
              </div>
            )}

            {/* 交换按钮 */}
            <div className="flex items-end">
              <Button
                onClick={swapInputOutput}
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={!output}
              >
                <ArrowUpDown className="h-4 w-4" />
                交换
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
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
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              {mode === 'encrypt' ? '原文' : '密文'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入要${mode === 'encrypt' ? '加密' : '解密'}的文本...`}
              className="w-full h-64 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {mode === 'encrypt' ? '密文' : '原文'}
              </div>
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
              placeholder={`${mode === 'encrypt' ? '加密' : '解密'}后的文本将显示在这里...`}
              className="w-full h-64 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* 算法说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>算法说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">凯撒密码 (Caesar Cipher)</h4>
            <p className="text-sm text-muted-foreground">
              将字母按照固定偏移量进行替换的古典密码算法。例如偏移量为3时，A变成D，B变成E。只对英文字母有效。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">ROT13</h4>
            <p className="text-sm text-muted-foreground">
              凯撒密码的特殊情况，偏移量固定为13。由于英文字母共26个，ROT13加密和解密使用相同操作。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">反转文本 (Reverse Text)</h4>
            <p className="text-sm text-muted-foreground">
              简单地将文本字符顺序颠倒。这是最简单的文本混淆方法，加密和解密操作相同。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Base64</h4>
            <p className="text-sm text-muted-foreground">
              将文本转换为Base64编码格式。严格来说这是编码而非加密，主要用于数据传输和存储。
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ 安全提醒</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              这些算法仅适用于学习和简单的文本混淆，不能用于保护敏感信息。如需真正的安全加密，请使用AES等现代加密算法。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
