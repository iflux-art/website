'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function BaseConverterPage() {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState(10);
  const [results, setResults] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
  });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // 验证输入是否符合指定进制
  const validateInput = (value: string, base: number): boolean => {
    if (!value) return true;
    
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, base);
    return value.toUpperCase().split('').every(char => validChars.includes(char));
  };

  // 转换进制
  const convertBase = () => {
    if (!inputValue.trim()) {
      setResults({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: '',
      });
      setError('');
      return;
    }

    if (!validateInput(inputValue, inputBase)) {
      setError(`输入值包含不符合 ${inputBase} 进制的字符`);
      setResults({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: '',
      });
      return;
    }

    try {
      // 先转换为十进制
      const decimalValue = parseInt(inputValue, inputBase);
      
      if (isNaN(decimalValue)) {
        setError('无效的输入值');
        return;
      }

      // 转换为各种进制
      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
      });
      setError('');
    } catch (err) {
      setError('转换失败，请检查输入值');
      setResults({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: '',
      });
    }
  };

  // 复制结果
  const copyResult = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空输入
  const clearInput = () => {
    setInputValue('');
    setResults({
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: '',
    });
    setError('');
  };

  // 加载示例
  const loadExample = () => {
    setInputValue('255');
    setInputBase(10);
  };

  // 快速输入常用值
  const quickInput = (value: string, base: number) => {
    setInputValue(value);
    setInputBase(base);
  };

  // 实时转换
  useEffect(() => {
    convertBase();
  }, [inputValue, inputBase]);

  const baseOptions = [
    { value: 2, name: '二进制 (Binary)', prefix: '0b' },
    { value: 8, name: '八进制 (Octal)', prefix: '0o' },
    { value: 10, name: '十进制 (Decimal)', prefix: '' },
    { value: 16, name: '十六进制 (Hexadecimal)', prefix: '0x' },
  ];

  const resultItems = [
    { key: 'binary', name: '二进制', value: results.binary, prefix: '0b', base: 2 },
    { key: 'octal', name: '八进制', value: results.octal, prefix: '0o', base: 8 },
    { key: 'decimal', name: '十进制', value: results.decimal, prefix: '', base: 10 },
    { key: 'hexadecimal', name: '十六进制', value: results.hexadecimal, prefix: '0x', base: 16 },
  ];

  const quickValues = [
    { name: '0', value: '0', base: 10 },
    { name: '1', value: '1', base: 10 },
    { name: '8', value: '8', base: 10 },
    { name: '16', value: '16', base: 10 },
    { name: '32', value: '32', base: 10 },
    { name: '64', value: '64', base: 10 },
    { name: '128', value: '128', base: 10 },
    { name: '255', value: '255', base: 10 },
    { name: '256', value: '256', base: 10 },
    { name: '512', value: '512', base: 10 },
    { name: '1024', value: '1024', base: 10 },
    { name: 'FF', value: 'FF', base: 16 },
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
          <Calculator className="h-8 w-8" />
          进制转换器
        </h1>
        <p className="text-muted-foreground mt-2">
          二进制、八进制、十进制、十六进制之间的相互转换
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearInput} variant="outline">
          清空
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 输入面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>输入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 进制选择 */}
              <div>
                <label className="block text-sm font-medium mb-2">输入进制</label>
                <select
                  value={inputBase}
                  onChange={(e) => setInputBase(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {baseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 数值输入 */}
              <div>
                <label className="block text-sm font-medium mb-2">数值</label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                  placeholder={`输入 ${inputBase} 进制数值...`}
                  className="w-full p-3 border border-border rounded-lg bg-background font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
              </div>

              {/* 快速输入 */}
              <div>
                <label className="block text-sm font-medium mb-2">快速输入</label>
                <div className="grid grid-cols-3 gap-2">
                  {quickValues.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      size="sm"
                      onClick={() => quickInput(item.value, item.base)}
                      className="text-xs"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>转换结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultItems.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{item.name}</label>
                      {item.value && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResult(item.prefix + item.value, item.key)}
                          className="flex items-center gap-2"
                        >
                          {copied === item.key ? (
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
                    </div>
                    <div className="flex items-center gap-2">
                      {item.prefix && (
                        <span className="text-sm text-muted-foreground font-mono">
                          {item.prefix}
                        </span>
                      )}
                      <input
                        type="text"
                        value={item.value}
                        readOnly
                        onClick={() => quickInput(item.value, item.base)}
                        placeholder={`${item.name}结果`}
                        className="flex-1 p-3 border border-border rounded-lg bg-muted/50 font-mono text-lg cursor-pointer hover:bg-muted"
                        title="点击设置为输入值"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 进制对照表 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>进制对照表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">十进制</th>
                      <th className="text-left p-2">二进制</th>
                      <th className="text-left p-2">八进制</th>
                      <th className="text-left p-2">十六进制</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 16 }, (_, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono">{i}</td>
                        <td className="p-2 font-mono">{i.toString(2).padStart(4, '0')}</td>
                        <td className="p-2 font-mono">{i.toString(8)}</td>
                        <td className="p-2 font-mono">{i.toString(16).toUpperCase()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">进制说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>二进制</strong>：只使用 0 和 1，计算机内部使用的进制</li>
              <li>• <strong>八进制</strong>：使用 0-7，常用于文件权限表示</li>
              <li>• <strong>十进制</strong>：使用 0-9，日常生活中使用的进制</li>
              <li>• <strong>十六进制</strong>：使用 0-9 和 A-F，常用于颜色代码和内存地址</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 点击结果框可以将该值设置为新的输入值</li>
              <li>• 支持大小写字母输入（自动转换为大写）</li>
              <li>• 使用快速输入按钮可以快速测试常用数值</li>
              <li>• 复制结果时会包含进制前缀（如 0x、0b）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见应用</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 编程开发中的数值转换</li>
              <li>• 网络地址和子网掩码计算</li>
              <li>• 颜色代码转换</li>
              <li>• 文件权限设置</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
