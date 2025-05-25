'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus, Download, Upload, Copy, Check, Table } from 'lucide-react';
import Link from 'next/link';

export default function TableEditorPage() {
  const [tableData, setTableData] = useState<string[][]>([
    ['姓名', '年龄', '城市'],
    ['张三', '25', '北京'],
    ['李四', '30', '上海'],
    ['王五', '28', '广州']
  ]);
  const [copied, setCopied] = useState<string | null>(null);

  // 添加行
  const addRow = () => {
    const newRow = new Array(tableData[0]?.length || 3).fill('');
    setTableData(prev => [...prev, newRow]);
  };

  // 添加列
  const addColumn = () => {
    setTableData(prev => prev.map((row, index) => [...row, index === 0 ? '新列' : '']));
  };

  // 删除行
  const deleteRow = (rowIndex: number) => {
    if (tableData.length <= 1) return;
    setTableData(prev => prev.filter((_, index) => index !== rowIndex));
  };

  // 删除列
  const deleteColumn = (colIndex: number) => {
    if (tableData[0]?.length <= 1) return;
    setTableData(prev => prev.map(row => row.filter((_, index) => index !== colIndex)));
  };

  // 更新单元格
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setTableData(prev => prev.map((row, rIndex) => 
      rIndex === rowIndex 
        ? row.map((cell, cIndex) => cIndex === colIndex ? value : cell)
        : row
    ));
  };

  // 导出为 CSV
  const exportCSV = () => {
    const csvContent = tableData.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导出为 HTML
  const exportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>表格</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <table>
        ${tableData.map((row, index) => 
          `<${index === 0 ? 'thead><tr>' : 'tr>'}${row.map(cell => 
            `<${index === 0 ? 'th' : 'td'}>${cell}</${index === 0 ? 'th' : 'td'}>`
          ).join('')}</${index === 0 ? '/tr></thead><tbody' : 'tr'}>`
        ).join('')}
        </tbody>
    </table>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导出为 Markdown
  const exportMarkdown = () => {
    if (tableData.length === 0) return;
    
    const headers = tableData[0];
    const separator = headers.map(() => '---').join(' | ');
    const rows = tableData.slice(1);
    
    const markdownContent = [
      `| ${headers.join(' | ')} |`,
      `| ${separator} |`,
      ...rows.map(row => `| ${row.join(' | ')} |`)
    ].join('\n');
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 复制为不同格式
  const copyAs = async (format: 'csv' | 'html' | 'markdown') => {
    let content = '';
    
    switch (format) {
      case 'csv':
        content = tableData.map(row => 
          row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        break;
      case 'html':
        content = `<table>
${tableData.map((row, index) => 
  `  <${index === 0 ? 'thead>\n    <tr>' : 'tr>'}${row.map(cell => 
    `\n      <${index === 0 ? 'th' : 'td'}>${cell}</${index === 0 ? 'th' : 'td'}>`
  ).join('')}\n    </${index === 0 ? '/tr>\n  </thead>\n  <tbody' : 'tr'}>`
).join('\n')}
  </tbody>
</table>`;
        break;
      case 'markdown':
        if (tableData.length > 0) {
          const headers = tableData[0];
          const separator = headers.map(() => '---').join(' | ');
          const rows = tableData.slice(1);
          content = [
            `| ${headers.join(' | ')} |`,
            `| ${separator} |`,
            ...rows.map(row => `| ${row.join(' | ')} |`)
          ].join('\n');
        }
        break;
    }
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 导入 CSV
  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim());
      const data = rows.map(row => {
        const cells: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
              current += '"';
              i++; // 跳过下一个引号
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        cells.push(current.trim());
        return cells;
      });
      
      if (data.length > 0) {
        setTableData(data);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // 清空表格
  const clearTable = () => {
    setTableData([['列1', '列2', '列3'], ['', '', ''], ['', '', '']]);
  };

  // 加载示例数据
  const loadExample = () => {
    setTableData([
      ['产品名称', '价格', '库存', '分类'],
      ['iPhone 15', '¥5999', '50', '手机'],
      ['MacBook Pro', '¥12999', '20', '电脑'],
      ['iPad Air', '¥4599', '30', '平板'],
      ['AirPods Pro', '¥1899', '100', '耳机']
    ]);
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
          <Table className="h-8 w-8" />
          表格处理工具
        </h1>
        <p className="text-muted-foreground mt-2">
          在线编辑表格，支持导入导出多种格式
        </p>
      </div>

      {/* 工具栏 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {/* 表格操作 */}
            <Button onClick={addRow} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              添加行
            </Button>
            <Button onClick={addColumn} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              添加列
            </Button>
            
            {/* 导入导出 */}
            <div className="flex gap-2 ml-4">
              <label className="cursor-pointer">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    导入 CSV
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importCSV}
                  className="hidden"
                />
              </label>
              
              <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                导出 CSV
              </Button>
              <Button onClick={exportHTML} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                导出 HTML
              </Button>
              <Button onClick={exportMarkdown} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                导出 Markdown
              </Button>
            </div>

            {/* 复制 */}
            <div className="flex gap-2 ml-4">
              <Button 
                onClick={() => copyAs('csv')} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {copied === 'csv' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === 'csv' ? '已复制' : '复制 CSV'}
              </Button>
              <Button 
                onClick={() => copyAs('html')} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {copied === 'html' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === 'html' ? '已复制' : '复制 HTML'}
              </Button>
              <Button 
                onClick={() => copyAs('markdown')} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {copied === 'markdown' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === 'markdown' ? '已复制' : '复制 Markdown'}
              </Button>
            </div>

            {/* 其他操作 */}
            <div className="flex gap-2 ml-4">
              <Button onClick={loadExample} variant="outline">
                加载示例
              </Button>
              <Button onClick={clearTable} variant="outline">
                清空表格
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 表格编辑器 */}
      <Card>
        <CardHeader>
          <CardTitle>表格编辑器</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-border p-1 relative group">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className={`w-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background ${
                            rowIndex === 0 ? 'font-semibold bg-muted/50' : ''
                          }`}
                          placeholder={rowIndex === 0 ? '列标题' : '单元格内容'}
                        />
                        
                        {/* 删除按钮 */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {colIndex === 0 && tableData.length > 1 && (
                            <Button
                              onClick={() => deleteRow(rowIndex)}
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0 text-xs"
                              title="删除行"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                          {rowIndex === 0 && tableData[0]?.length > 1 && (
                            <Button
                              onClick={() => deleteColumn(colIndex)}
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0 text-xs ml-1"
                              title="删除列"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            当前表格: {tableData.length} 行 × {tableData[0]?.length || 0} 列
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
            <h4 className="font-medium mb-2">编辑功能</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 点击单元格直接编辑内容</li>
              <li>• 第一行自动作为表头，样式加粗</li>
              <li>• 鼠标悬停显示删除按钮</li>
              <li>• 支持添加和删除行列</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">导入导出</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>CSV</strong>：兼容 Excel 等表格软件</li>
              <li>• <strong>HTML</strong>：可直接在网页中显示</li>
              <li>• <strong>Markdown</strong>：适用于文档和博客</li>
              <li>• 支持从 CSV 文件导入数据</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用 Tab 键在单元格间快速切换</li>
              <li>• 复制功能可快速获取不同格式的代码</li>
              <li>• 导入 CSV 时支持带引号的复杂内容</li>
              <li>• 可以先加载示例数据了解功能</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
