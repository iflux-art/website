'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Trash2, Archive, FileText } from 'lucide-react';
import Link from 'next/link';

interface FileItem {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
}

export default function FileCompressorPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [compressing, setCompressing] = useState(false);
  const [compressionFormat, setCompressionFormat] = useState<'zip' | 'gzip' | 'brotli'>('zip');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    const newFiles: FileItem[] = selectedFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      originalSize: file.size,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 移除文件
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // 清空所有文件
  const clearAllFiles = () => {
    setFiles([]);
  };

  // 模拟文件压缩
  const compressFile = async (fileItem: FileItem): Promise<FileItem> => {
    // 模拟压缩过程
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 模拟压缩结果
    const compressionRatio = Math.random() * 0.4 + 0.3; // 30%-70%的压缩率
    const compressedSize = Math.floor(fileItem.originalSize * compressionRatio);

    return {
      ...fileItem,
      compressedSize,
      compressionRatio: (1 - compressionRatio) * 100,
      status: 'completed'
    };
  };

  // 压缩所有文件
  const compressAllFiles = async () => {
    if (files.length === 0) return;

    setCompressing(true);

    // 更新所有文件状态为压缩中
    setFiles(prev => prev.map(file => ({ ...file, status: 'compressing' as const })));

    try {
      // 并行压缩所有文件
      const compressPromises = files.map(async (file) => {
        try {
          return await compressFile(file);
        } catch (error) {
          return {
            ...file,
            status: 'error' as const,
            error: '压缩失败'
          };
        }
      });

      const compressedFiles = await Promise.all(compressPromises);
      setFiles(compressedFiles);

    } catch (error) {
      console.error('压缩过程出错:', error);
    } finally {
      setCompressing(false);
    }
  };

  // 下载压缩文件
  const downloadCompressedFile = (fileItem: FileItem) => {
    if (fileItem.status !== 'completed') return;

    // 创建模拟的压缩文件
    const originalName = fileItem.file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const ext = originalName.substring(originalName.lastIndexOf('.')) || '';
    
    let newName = '';
    switch (compressionFormat) {
      case 'zip':
        newName = `${nameWithoutExt}_compressed.zip`;
        break;
      case 'gzip':
        newName = `${originalName}.gz`;
        break;
      case 'brotli':
        newName = `${originalName}.br`;
        break;
    }

    // 创建模拟的压缩内容
    const content = `压缩文件: ${originalName}\n压缩格式: ${compressionFormat.toUpperCase()}\n原始大小: ${formatFileSize(fileItem.originalSize)}\n压缩后大小: ${formatFileSize(fileItem.compressedSize!)}\n压缩率: ${fileItem.compressionRatio!.toFixed(1)}%`;
    
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 下载所有压缩文件
  const downloadAllCompressed = () => {
    const completedFiles = files.filter(file => file.status === 'completed');
    if (completedFiles.length === 0) return;

    // 创建包含所有文件信息的压缩包
    const content = `压缩包信息
================
压缩格式: ${compressionFormat.toUpperCase()}
压缩级别: ${compressionLevel}
文件数量: ${completedFiles.length}
压缩时间: ${new Date().toISOString().replace('T', ' ').split('.')[0]}

文件列表:
${completedFiles.map((file, index) => 
  `${index + 1}. ${file.file.name}
   原始大小: ${formatFileSize(file.originalSize)}
   压缩后: ${formatFileSize(file.compressedSize!)}
   压缩率: ${file.compressionRatio!.toFixed(1)}%`
).join('\n\n')}

总原始大小: ${formatFileSize(completedFiles.reduce((sum, file) => sum + file.originalSize, 0))}
总压缩后大小: ${formatFileSize(completedFiles.reduce((sum, file) => sum + (file.compressedSize || 0), 0))}
平均压缩率: ${(completedFiles.reduce((sum, file) => sum + (file.compressionRatio || 0), 0) / completedFiles.length).toFixed(1)}%`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_files_${new Date().toISOString().split('T')[0]}.${compressionFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600';
      case 'compressing': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '等待压缩';
      case 'compressing': return '压缩中...';
      case 'completed': return '压缩完成';
      case 'error': return '压缩失败';
      default: return '未知状态';
    }
  };

  // 计算总体统计
  const totalOriginalSize = files.reduce((sum, file) => sum + file.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, file) => sum + (file.compressedSize || 0), 0);
  const completedFiles = files.filter(file => file.status === 'completed');
  const averageCompressionRatio = completedFiles.length > 0 
    ? completedFiles.reduce((sum, file) => sum + (file.compressionRatio || 0), 0) / completedFiles.length 
    : 0;

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
          <Archive className="h-8 w-8" />
          文件压缩工具
        </h1>
        <p className="text-muted-foreground mt-2">
          压缩文件以减小存储空间，支持多种压缩格式
        </p>
      </div>

      {/* 压缩设置 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>压缩设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">压缩格式</label>
              <select
                value={compressionFormat}
                onChange={(e) => setCompressionFormat(e.target.value as any)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="zip">ZIP - 通用压缩格式</option>
                <option value="gzip">GZIP - 高效压缩</option>
                <option value="brotli">Brotli - 最新压缩算法</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                压缩级别: {compressionLevel}
              </label>
              <input
                type="range"
                min="1"
                max="9"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>快速</span>
                <span>平衡</span>
                <span>最佳</span>
              </div>
            </div>

            <div className="flex items-end">
              <label className="cursor-pointer w-full">
                <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    选择文件
                  </span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>文件列表 ({files.length})</span>
            <div className="flex gap-2">
              {files.length > 0 && (
                <>
                  <Button
                    onClick={compressAllFiles}
                    disabled={compressing || files.every(f => f.status === 'completed')}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    {compressing ? '压缩中...' : '开始压缩'}
                  </Button>
                  {completedFiles.length > 0 && (
                    <Button
                      onClick={downloadAllCompressed}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      下载全部
                    </Button>
                  )}
                  <Button onClick={clearAllFiles} variant="outline" size="sm">
                    清空
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>还没有选择文件</p>
              <p className="text-sm">点击"选择文件"开始添加要压缩的文件</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{fileItem.file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          原始大小: {formatFileSize(fileItem.originalSize)}
                          {fileItem.compressedSize && (
                            <>
                              {' → '}
                              压缩后: {formatFileSize(fileItem.compressedSize)}
                              {' ('}
                              <span className="text-green-600">
                                -{fileItem.compressionRatio!.toFixed(1)}%
                              </span>
                              {')'}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-sm ${getStatusColor(fileItem.status)}`}>
                      {getStatusText(fileItem.status)}
                      {fileItem.status === 'compressing' && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block ml-2"></div>
                      )}
                    </div>

                    {fileItem.status === 'completed' && (
                      <Button
                        onClick={() => downloadCompressedFile(fileItem)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        下载
                      </Button>
                    )}

                    <Button
                      onClick={() => removeFile(fileItem.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 压缩统计 */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>压缩统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{files.length}</div>
                <div className="text-sm text-muted-foreground">总文件数</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatFileSize(totalOriginalSize)}</div>
                <div className="text-sm text-muted-foreground">原始总大小</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatFileSize(totalCompressedSize)}</div>
                <div className="text-sm text-muted-foreground">压缩后大小</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {averageCompressionRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">平均压缩率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">压缩格式说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>ZIP</strong>：最通用的压缩格式，兼容性最好</li>
              <li>• <strong>GZIP</strong>：高效的压缩算法，适合文本文件</li>
              <li>• <strong>Brotli</strong>：Google开发的新压缩算法，压缩率更高</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">压缩级别</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>1-3级</strong>：快速压缩，压缩率较低</li>
              <li>• <strong>4-6级</strong>：平衡模式，速度和压缩率兼顾</li>
              <li>• <strong>7-9级</strong>：最佳压缩，压缩率最高但速度较慢</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 文本文件（如代码、文档）通常有更好的压缩效果</li>
              <li>• 已压缩的文件（如图片、视频）压缩效果有限</li>
              <li>• 批量压缩可以提高效率</li>
              <li>• 选择合适的压缩级别平衡速度和效果</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ 演示说明</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              这是一个演示工具，显示的是模拟压缩结果。实际的文件压缩需要专业的压缩库（如JSZip、pako等）。当前版本仅展示界面和流程。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
