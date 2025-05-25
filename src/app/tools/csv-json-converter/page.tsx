'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, ArrowUpDown, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CsvJsonConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // CSV 转 JSON
  const csvToJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const lines = input.trim().split('\n');
      if (lines.length === 0) {
        setError('CSV 数据为空');
        return;
      }

      // 解析 CSV 行
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++; // 跳过下一个引号
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim());
        return result;
      };

      let headers: string[];
      let dataLines: string[];

      if (hasHeader) {
        headers = parseCSVLine(lines[0]);
        dataLines = lines.slice(1);
      } else {
        // 如果没有标题行，使用 column1, column2, ... 作为键名
        const firstLine = parseCSVLine(lines[0]);
        headers = firstLine.map((_, index) => `column${index + 1}`);
        dataLines = lines;
      }

      const jsonData = dataLines.map(line => {
        const values = parseCSVLine(line);
        const obj: { [key: string]: string } = {};
        
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        
        return obj;
      });

      setOutput(JSON.stringify(jsonData, null, 2));
      setError('');
    } catch (err) {
      setError('CSV 解析失败：' + (err instanceof Error ? err.message : '未知错误'));
      setOutput('');
    }
  };

  // JSON 转 CSV
  const jsonToCsv = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const jsonData = JSON.parse(input);
      
      if (!Array.isArray(jsonData)) {
        setError('JSON 数据必须是数组格式');
        return;
      }

      if (jsonData.length === 0) {
        setError('JSON 数组为空');
        return;
      }

      // 获取所有可能的键名
      const allKeys = new Set<string>();
      jsonData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });

      const headers = Array.from(allKeys);
      
      // 转义 CSV 字段
      const escapeCSVField = (field: any): string => {
        const str = String(field || '');
        if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // 生成 CSV
      const csvLines: string[] = [];
      
      if (hasHeader) {
        csvLines.push(headers.map(escapeCSVField).join(delimiter));
      }

      jsonData.forEach(item => {
        const row = headers.map(header => {
          const value = typeof item === 'object' && item !== null ? item[header] : '';
          return escapeCSVField(value);
        });
        csvLines.push(row.join(delimiter));
      });

      setOutput(csvLines.join('\n'));
      setError('');
    } catch (err) {
      setError('JSON 解析失败：' + (err instanceof Error ? err.message : '未知错误'));
      setOutput('');
    }
  };

  // 执行转换
  const convert = () => {
    if (mode === 'csv-to-json') {
      csvToJson();
    } else {
      jsonToCsv();
    }
  };

  // 切换模式
  const switchMode = () => {
    setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
    setInput(output);
    setOutput('');
    setError('');
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
    if (mode === 'csv-to-json') {
      setInput('姓名,年龄,城市\n张三,25,北京\n李四,30,上海\n王五,28,广州');
    } else {
      setInput(`[
  {"姓名": "张三", "年龄": "25", "城市": "北京"},
  {"姓名": "李四", "年龄": "30", "城市": "上海"},
  {"姓名": "王五", "年龄": "28", "城市": "广州"}
]`);
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
          <FileText className="h-8 w-8" />
          CSV/JSON 转换器
        </h1>
        <p className="text-muted-foreground mt-2">
          CSV 和 JSON 格式互相转换，支持自定义分隔符和标题行设置
        </p>
      </div>

      {/* 模式选择 */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'csv-to-json' ? 'default' : 'outline'}
            onClick={() => setMode('csv-to-json')}
          >
            CSV → JSON
          </Button>
          <Button
            variant={mode === 'json-to-csv' ? 'default' : 'outline'}
            onClick={() => setMode('json-to-csv')}
          >
            JSON → CSV
          </Button>
        </div>
        <Button onClick={switchMode} variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          交换输入输出
        </Button>
      </div>

      {/* 设置选项 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>转换设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">分隔符</label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value=",">逗号 (,)</option>
                <option value=";">分号 (;)</option>
                <option value="\t">制表符 (\t)</option>
                <option value="|">竖线 (|)</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">包含标题行</span>
              </label>
            </div>
            <div className="flex items-end">
              <Button onClick={convert} className="w-full">
                转换
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
            <CardTitle>
              {mode === 'csv-to-json' ? 'CSV 数据' : 'JSON 数据'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'csv-to-json' 
                  ? '在此输入 CSV 数据...\n例如：\n姓名,年龄,城市\n张三,25,北京\n李四,30,上海' 
                  : '在此输入 JSON 数据...\n例如：\n[{"姓名": "张三", "年龄": 25}]'
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
              {mode === 'csv-to-json' ? 'JSON 结果' : 'CSV 结果'}
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
                mode === 'csv-to-json' 
                  ? '转换后的 JSON 数据将显示在这里...' 
                  : '转换后的 CSV 数据将显示在这里...'
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
            <h4 className="font-medium mb-2">CSV 格式要求</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 每行代表一条记录</li>
              <li>• 字段之间用指定分隔符分隔</li>
              <li>• 包含分隔符或引号的字段需要用双引号包围</li>
              <li>• 字段内的双引号需要转义为两个双引号</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">JSON 格式要求</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 必须是对象数组格式</li>
              <li>• 每个对象代表一条记录</li>
              <li>• 对象的键名将作为 CSV 的列标题</li>
              <li>• 支持嵌套对象（会被转换为字符串）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 支持多种分隔符（逗号、分号、制表符、竖线）</li>
              <li>• 可选择是否包含标题行</li>
              <li>• 自动处理特殊字符转义</li>
              <li>• 支持中文和特殊字符</li>
              <li>• 双向转换，支持输入输出交换</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Excel 数据与 API 数据格式转换</li>
              <li>• 数据库导入导出</li>
              <li>• 数据分析和处理</li>
              <li>• 配置文件格式转换</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
