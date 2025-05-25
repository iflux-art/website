'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Code, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function HtmlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '§': '&sect;',
    '¶': '&para;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '‰': '&permil;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '‾': '&oline;',
    '⁄': '&frasl;',
    '€': '&euro;',
    '℘': '&weierp;',
    'ℑ': '&image;',
    'ℜ': '&real;',
    '™': '&trade;',
    'ℵ': '&alefsym;',
    '←': '&larr;',
    '↑': '&uarr;',
    '→': '&rarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '↵': '&crarr;',
    '⇐': '&lArr;',
    '⇑': '&uArr;',
    '⇒': '&rArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;',
  };

  const encode = () => {
    let encoded = input;
    
    // 基本 HTML 实体编码
    encoded = encoded
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    
    // 可选：编码其他特殊字符
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      if (char !== '&' && char !== '<' && char !== '>' && char !== '"' && char !== "'") {
        encoded = encoded.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entity);
      }
    });
    
    setOutput(encoded);
  };

  const decode = () => {
    let decoded = input;
    
    // 解码 HTML 实体
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      decoded = decoded.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), char);
    });
    
    // 解码数字实体
    decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
      return String.fromCharCode(parseInt(num, 10));
    });
    
    // 解码十六进制实体
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    setOutput(decoded);
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
  };

  const loadExample = () => {
    if (mode === 'encode') {
      setInput('<div class="example">Hello & "World"</div>\n<p>版权所有 © 2024</p>');
    } else {
      setInput('&lt;div class=&quot;example&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;\n&lt;p&gt;版权所有 &copy; 2024&lt;/p&gt;');
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
          <Code className="h-8 w-8" />
          HTML {mode === 'encode' ? '编码' : '解码'}工具
        </h1>
        <p className="text-muted-foreground mt-2">
          HTML 实体编码和解码工具，处理特殊字符和符号
        </p>
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
              {mode === 'encode' ? '原始 HTML' : 'HTML 实体'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode' 
                  ? '在此输入要编码的 HTML 代码...' 
                  : '在此输入要解码的 HTML 实体...'
              }
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mode === 'encode' ? 'HTML 实体' : '解码结果'}
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
                  ? '编码后的 HTML 实体将显示在这里...' 
                  : '解码后的 HTML 代码将显示在这里...'
              }
              className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* 常用实体参考 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>常用 HTML 实体参考</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
            {Object.entries(htmlEntities).slice(0, 24).map(([char, entity]) => (
              <div key={char} className="p-2 bg-muted/50 rounded flex justify-between">
                <span className="font-mono">{char}</span>
                <span className="font-mono text-muted-foreground">{entity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">什么是 HTML 实体？</h4>
            <p className="text-sm text-muted-foreground">
              HTML 实体是用来在 HTML 文档中表示特殊字符的代码。某些字符在 HTML 中有特殊含义（如 &lt;、&gt;、&amp;），需要用实体来表示才能正确显示。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">实体格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>命名实体</strong>：&amp;name; （如 &amp;lt; 表示 &lt;）</li>
              <li>• <strong>数字实体</strong>：&amp;#number; （如 &amp;#60; 表示 &lt;）</li>
              <li>• <strong>十六进制实体</strong>：&amp;#xhex; （如 &amp;#x3C; 表示 &lt;）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 在 HTML 中显示代码片段</li>
              <li>• 防止 XSS 攻击（转义用户输入）</li>
              <li>• 在 HTML 属性中使用特殊字符</li>
              <li>• 显示版权符号、商标等特殊符号</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
