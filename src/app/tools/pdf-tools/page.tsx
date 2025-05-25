'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, FileText, Scissors, Merge, Compress } from 'lucide-react';
import Link from 'next/link';

export default function PdfToolsPage() {
  const [mode, setMode] = useState<'merge' | 'split' | 'compress'>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [splitRange, setSplitRange] = useState('1-5');
  const [compressionLevel, setCompressionLevel] = useState(75);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      alert('请只选择PDF文件');
    }
    
    if (mode === 'merge') {
      setFiles(prev => [...prev, ...pdfFiles]);
    } else {
      setFiles(pdfFiles.slice(0, 1)); // 分割和压缩只支持单个文件
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 移除文件
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 移动文件位置（用于合并时调整顺序）
  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  // 模拟PDF处理
  const processPDF = async () => {
    if (files.length === 0) {
      alert('请先选择PDF文件');
      return;
    }

    setProcessing(true);

    try {
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 创建模拟的处理结果
      let fileName = '';
      let content = '';

      switch (mode) {
        case 'merge':
          fileName = 'merged.pdf';
          content = `合并的PDF文件\n包含 ${files.length} 个文件:\n${files.map(f => f.name).join('\n')}`;
          break;
        case 'split':
          fileName = 'split_pages.pdf';
          content = `分割的PDF文件\n原文件: ${files[0]?.name}\n页面范围: ${splitRange}`;
          break;
        case 'compress':
          fileName = 'compressed.pdf';
          content = `压缩的PDF文件\n原文件: ${files[0]?.name}\n压缩级别: ${compressionLevel}%`;
          break;
      }

      // 创建并下载模拟文件
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      alert('PDF处理完成！');
    } catch (error) {
      alert('处理失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  // 清空文件
  const clearFiles = () => {
    setFiles([]);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const modes = [
    { key: 'merge', name: 'PDF合并', icon: Merge, desc: '将多个PDF文件合并为一个' },
    { key: 'split', name: 'PDF分割', icon: Scissors, desc: '从PDF中提取指定页面' },
    { key: 'compress', name: 'PDF压缩', icon: Compress, desc: '减小PDF文件大小' },
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
          PDF工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          PDF文件处理工具，支持合并、分割、压缩等功能
        </p>
      </div>

      {/* 模式选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => {
            const IconComponent = m.icon;
            return (
              <Button
                key={m.key}
                variant={mode === m.key ? 'default' : 'outline'}
                onClick={() => {
                  setMode(m.key as any);
                  setFiles([]);
                }}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {m.name}
              </Button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {modes.find(m => m.key === mode)?.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 文件上传区域 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>文件管理</span>
                {files.length > 0 && (
                  <Button onClick={clearFiles} variant="outline" size="sm">
                    清空文件
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 上传区域 */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  选择PDF文件
                </Button>
                <p className="text-sm text-muted-foreground">
                  {mode === 'merge' ? '可选择多个PDF文件' : '选择一个PDF文件'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple={mode === 'merge'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* 文件列表 */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">已选择的文件 ({files.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {mode === 'merge' && files.length > 1 && (
                            <>
                              <Button
                                onClick={() => moveFile(index, Math.max(0, index - 1))}
                                disabled={index === 0}
                                variant="outline"
                                size="sm"
                              >
                                ↑
                              </Button>
                              <Button
                                onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))}
                                disabled={index === files.length - 1}
                                variant="outline"
                                size="sm"
                              >
                                ↓
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() => removeFile(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 设置面板 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>处理设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 分割设置 */}
              {mode === 'split' && (
                <div>
                  <label className="block text-sm font-medium mb-2">页面范围</label>
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    placeholder="如: 1-5, 3,7,9"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    支持范围(1-5)和单页(3,7,9)格式
                  </p>
                </div>
              )}

              {/* 压缩设置 */}
              {mode === 'compress' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    压缩级别: {compressionLevel}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>高压缩</span>
                    <span>高质量</span>
                  </div>
                </div>
              )}

              {/* 处理按钮 */}
              <Button
                onClick={processPDF}
                disabled={files.length === 0 || processing}
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {processing ? '处理中...' : `开始${modes.find(m => m.key === mode)?.name}`}
              </Button>

              {/* 文件信息 */}
              {files.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">文件信息</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>文件数量: {files.length}</div>
                    <div>
                      总大小: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                    </div>
                    {mode === 'merge' && files.length > 1 && (
                      <div className="text-xs mt-2">
                        合并顺序: {files.map((f, i) => `${i + 1}. ${f.name}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 功能说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>功能说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">PDF合并</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 选择多个PDF文件进行合并</li>
              <li>• 可以调整文件合并顺序</li>
              <li>• 支持拖拽排序（使用上下箭头）</li>
              <li>• 生成单个合并后的PDF文件</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">PDF分割</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 从PDF中提取指定页面</li>
              <li>• 支持页面范围：1-5（第1到5页）</li>
              <li>• 支持单独页面：3,7,9（第3、7、9页）</li>
              <li>• 支持混合格式：1-3,5,8-10</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">PDF压缩</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 减小PDF文件大小</li>
              <li>• 可调节压缩级别</li>
              <li>• 10%：最高压缩，质量较低</li>
              <li>• 100%：无压缩，保持原质量</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ 演示说明</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              这是一个演示工具，实际的PDF处理需要专业的PDF处理库（如PDF-lib、jsPDF等）。当前版本仅展示界面和流程，不会进行真实的PDF处理。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
