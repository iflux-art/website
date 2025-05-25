'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, ArrowUpDown, FileText } from 'lucide-react';
import Link from 'next/link';

export default function EncodingConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sourceEncoding, setSourceEncoding] = useState('utf-8');
  const [targetEncoding, setTargetEncoding] = useState('gbk');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 编码列表
  const encodings = [
    { value: 'utf-8', name: 'UTF-8', desc: '通用Unicode编码' },
    { value: 'utf-16', name: 'UTF-16', desc: 'Unicode 16位编码' },
    { value: 'gbk', name: 'GBK', desc: '中文简体编码' },
    { value: 'gb2312', name: 'GB2312', desc: '中文简体编码(旧)' },
    { value: 'big5', name: 'Big5', desc: '中文繁体编码' },
    { value: 'iso-8859-1', name: 'ISO-8859-1', desc: '西欧字符编码' },
    { value: 'ascii', name: 'ASCII', desc: '基础ASCII编码' },
    { value: 'windows-1252', name: 'Windows-1252', desc: 'Windows西欧编码' },
    { value: 'shift-jis', name: 'Shift-JIS', desc: '日文编码' },
    { value: 'euc-kr', name: 'EUC-KR', desc: '韩文编码' },
  ];

  // 编码转换函数
  const convertEncoding = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // 这里是简化的编码转换演示
      // 实际项目中需要使用专业的编码转换库
      
      let result = input;
      
      // 模拟不同编码的转换效果
      if (sourceEncoding === 'utf-8' && targetEncoding === 'gbk') {
        // UTF-8 到 GBK 的模拟转换
        result = input; // 实际需要真正的编码转换
      } else if (sourceEncoding === 'gbk' && targetEncoding === 'utf-8') {
        // GBK 到 UTF-8 的模拟转换
        result = input;
      } else if (targetEncoding === 'ascii') {
        // 转换为 ASCII，非ASCII字符用?替代
        result = input.replace(/[^\x00-\x7F]/g, '?');
      } else if (targetEncoding === 'hex') {
        // 转换为十六进制
        result = Array.from(input)
          .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ');
      } else if (sourceEncoding === 'hex') {
        // 从十六进制转换
        try {
          const hexValues = input.split(/\s+/).filter(h => h);
          result = hexValues
            .map(hex => String.fromCharCode(parseInt(hex, 16)))
            .join('');
        } catch (err) {
          throw new Error('无效的十六进制格式');
        }
      } else {
        result = input; // 其他情况保持原样
      }

      setOutput(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败');
      setOutput('');
    }
  };

  // 交换编码
  const swapEncodings = () => {
    const temp = sourceEncoding;
    setSourceEncoding(targetEncoding);
    setTargetEncoding(temp);
    
    // 同时交换输入输出
    const tempText = input;
    setInput(output);
    setOutput(tempText);
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
    setInput('你好，世界！Hello World! 123');
    setSourceEncoding('utf-8');
    setTargetEncoding('ascii');
  };

  // 检测编码（简化版）
  const detectEncoding = (text: string): string => {
    // 简化的编码检测
    if (/^[\x00-\x7F]*$/.test(text)) {
      return 'ASCII';
    } else if (/[\u4e00-\u9fff]/.test(text)) {
      return 'UTF-8 (包含中文)';
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
      return 'UTF-8 (包含日文)';
    } else if (/[\uac00-\ud7af]/.test(text)) {
      return 'UTF-8 (包含韩文)';
    } else {
      return 'UTF-8';
    }
  };

  // 实时转换
  React.useEffect(() => {
    convertEncoding();
  }, [input, sourceEncoding, targetEncoding]);

  // 添加十六进制编码选项
  const extendedEncodings = [
    ...encodings,
    { value: 'hex', name: 'HEX', desc: '十六进制表示' },
    { value: 'binary', name: 'Binary', desc: '二进制表示' },
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
          <FileText className="h-8 w-8" />
          编码转换工具
        </h1>
        <p className="text-muted-foreground mt-2">
          在不同字符编码之间进行转换，支持多种常用编码格式
        </p>
      </div>

      {/* 编码设置 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>编码设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">源编码</label>
              <select
                value={sourceEncoding}
                onChange={(e) => setSourceEncoding(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                {extendedEncodings.map((encoding) => (
                  <option key={encoding.value} value={encoding.value}>
                    {encoding.name} - {encoding.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={swapEncodings}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                交换
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">目标编码</label>
              <select
                value={targetEncoding}
                onChange={(e) => setTargetEncoding(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                {extendedEncodings.map((encoding) => (
                  <option key={encoding.value} value={encoding.value}>
                    {encoding.name} - {encoding.desc}
                  </option>
                ))}
              </select>
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
            <CardTitle>
              输入文本 ({extendedEncodings.find(e => e.value === sourceEncoding)?.name})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要转换的文本..."
              className="w-full h-64 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            {/* 输入信息 */}
            {input && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div>字符数: {input.length}</div>
                <div>字节数: {new Blob([input]).size}</div>
                <div>检测编码: {detectEncoding(input)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                输出文本 ({extendedEncodings.find(e => e.value === targetEncoding)?.name})
              </span>
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
              placeholder="转换后的文本将显示在这里..."
              className="w-full h-64 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
            
            {/* 错误信息 */}
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            {/* 输出信息 */}
            {output && !error && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div>字符数: {output.length}</div>
                <div>字节数: {new Blob([output]).size}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 编码对照表 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>常用字符编码对照</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">字符</th>
                  <th className="text-left p-2">UTF-8</th>
                  <th className="text-left p-2">GBK</th>
                  <th className="text-left p-2">ASCII</th>
                  <th className="text-left p-2">Unicode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-mono">A</td>
                  <td className="p-2 font-mono">41</td>
                  <td className="p-2 font-mono">41</td>
                  <td className="p-2 font-mono">65</td>
                  <td className="p-2 font-mono">U+0041</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">中</td>
                  <td className="p-2 font-mono">E4 B8 AD</td>
                  <td className="p-2 font-mono">D6 D0</td>
                  <td className="p-2 font-mono">?</td>
                  <td className="p-2 font-mono">U+4E2D</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">文</td>
                  <td className="p-2 font-mono">E6 96 87</td>
                  <td className="p-2 font-mono">CE C4</td>
                  <td className="p-2 font-mono">?</td>
                  <td className="p-2 font-mono">U+6587</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">€</td>
                  <td className="p-2 font-mono">E2 82 AC</td>
                  <td className="p-2 font-mono">80</td>
                  <td className="p-2 font-mono">?</td>
                  <td className="p-2 font-mono">U+20AC</td>
                </tr>
              </tbody>
            </table>
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
            <h4 className="font-medium mb-2">常用编码说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>UTF-8</strong>：通用Unicode编码，支持所有语言</li>
              <li>• <strong>GBK</strong>：中文简体编码，兼容GB2312</li>
              <li>• <strong>Big5</strong>：中文繁体编码</li>
              <li>• <strong>ASCII</strong>：基础英文编码，只支持128个字符</li>
              <li>• <strong>ISO-8859-1</strong>：西欧字符编码</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 解决网页乱码问题</li>
              <li>• 文件编码格式转换</li>
              <li>• 数据库字符集迁移</li>
              <li>• 不同系统间的文本交换</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 从高编码转到低编码可能丢失字符</li>
              <li>• ASCII只支持英文字符和基本符号</li>
              <li>• 转换前请确认源文本的正确编码</li>
              <li>• 建议优先使用UTF-8编码</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">💡 提示</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              这是一个简化的编码转换演示工具。实际的编码转换需要考虑更多细节，如字节序、代理对等。在生产环境中建议使用专业的编码转换库。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
