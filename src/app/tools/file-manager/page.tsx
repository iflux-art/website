'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, File, FolderOpen, Search, Download } from 'lucide-react';
import Link from 'next/link';

export default function FileManagerPage() {
  const [activeTab, setActiveTab] = useState<'organize' | 'rename' | 'duplicate' | 'analyze'>('organize');

  // 文件整理工具
  const FileOrganizer = () => {
    const [files, setFiles] = useState([
      { name: 'document.pdf', type: 'pdf', size: 1024, date: '2024-01-15' },
      { name: 'image.jpg', type: 'jpg', size: 2048, date: '2024-01-14' },
      { name: 'video.mp4', type: 'mp4', size: 10240, date: '2024-01-13' },
      { name: 'music.mp3', type: 'mp3', size: 5120, date: '2024-01-12' }
    ]);
    const [organizeBy, setOrganizeBy] = useState('type');
    const [organized, setOrganized] = useState<any>(null);

    const organizeFiles = () => {
      let result: any = {};
      
      files.forEach(file => {
        let key = '';
        switch (organizeBy) {
          case 'type':
            key = file.type.toUpperCase();
            break;
          case 'date':
            key = file.date.substring(0, 7); // YYYY-MM
            break;
          case 'size':
            if (file.size < 1024) key = '小文件 (<1MB)';
            else if (file.size < 5120) key = '中等文件 (1-5MB)';
            else key = '大文件 (>5MB)';
            break;
        }
        
        if (!result[key]) result[key] = [];
        result[key].push(file);
      });
      
      setOrganized(result);
    };

    const formatSize = (bytes: number) => {
      return (bytes / 1024).toFixed(1) + ' MB';
    };

    return (
      <Card>
        <CardHeader><CardTitle>文件整理工具</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2">整理方式</label>
            <select
              value={organizeBy}
              onChange={(e) => setOrganizeBy(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="type">按文件类型</option>
              <option value="date">按创建日期</option>
              <option value="size">按文件大小</option>
            </select>
          </div>

          <Button onClick={organizeFiles} className="w-full">整理文件</Button>

          <div className="space-y-2">
            <h4 className="font-medium">当前文件 ({files.length})</h4>
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(file.size)} | {file.date}
                </div>
              </div>
            ))}
          </div>

          {organized && (
            <div className="space-y-3">
              <h4 className="font-medium">整理结果</h4>
              {Object.entries(organized).map(([category, categoryFiles]: [string, any]) => (
                <div key={category} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="font-medium">{category}</span>
                    <span className="text-xs text-muted-foreground">({categoryFiles.length}个文件)</span>
                  </div>
                  <div className="space-y-1 ml-6">
                    {categoryFiles.map((file: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {file.name} ({formatSize(file.size)})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 批量重命名工具
  const BatchRename = () => {
    const [files, setFiles] = useState(['IMG_001.jpg', 'IMG_002.jpg', 'IMG_003.jpg']);
    const [pattern, setPattern] = useState('Photo_{index}');
    const [startIndex, setStartIndex] = useState(1);
    const [preview, setPreview] = useState<string[]>([]);

    const generatePreview = () => {
      const newNames = files.map((file, index) => {
        const ext = file.split('.').pop();
        let newName = pattern;
        
        newName = newName.replace('{index}', String(startIndex + index).padStart(3, '0'));
        newName = newName.replace('{original}', file.split('.')[0]);
        newName = newName.replace('{date}', new Date().toISOString().split('T')[0]);
        
        return `${newName}.${ext}`;
      });
      setPreview(newNames);
    };

    const addFile = () => {
      const newFile = `file_${files.length + 1}.txt`;
      setFiles([...files, newFile]);
    };

    return (
      <Card>
        <CardHeader><CardTitle>批量重命名工具</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">命名模式</label>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Photo_{index}"
                className="w-full p-3 border rounded-lg"
              />
              <div className="text-xs text-muted-foreground mt-1">
                可用变量: {'{index}'}, {'{original}'}, {'{date}'}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">起始序号</label>
              <input
                type="number"
                value={startIndex}
                onChange={(e) => setStartIndex(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generatePreview} className="flex-1">预览重命名</Button>
            <Button onClick={addFile} variant="outline">添加文件</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">原文件名</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {file}
                  </div>
                ))}
              </div>
            </div>
            
            {preview.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">新文件名</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {preview.map((name, index) => (
                    <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 重复文件检测
  const DuplicateDetector = () => {
    const [files] = useState([
      { name: 'document.pdf', size: 1024, hash: 'abc123' },
      { name: 'document_copy.pdf', size: 1024, hash: 'abc123' },
      { name: 'image.jpg', size: 2048, hash: 'def456' },
      { name: 'photo.jpg', size: 2048, hash: 'def456' },
      { name: 'unique.txt', size: 512, hash: 'ghi789' }
    ]);
    const [duplicates, setDuplicates] = useState<any[]>([]);

    const findDuplicates = () => {
      const hashMap: any = {};
      
      files.forEach(file => {
        if (!hashMap[file.hash]) {
          hashMap[file.hash] = [];
        }
        hashMap[file.hash].push(file);
      });

      const duplicateGroups = Object.values(hashMap).filter((group: any) => group.length > 1);
      setDuplicates(duplicateGroups);
    };

    const formatSize = (bytes: number) => {
      return (bytes / 1024).toFixed(1) + ' MB';
    };

    const getTotalWastedSpace = () => {
      let total = 0;
      duplicates.forEach((group: any) => {
        total += group[0].size * (group.length - 1);
      });
      return formatSize(total);
    };

    return (
      <Card>
        <CardHeader><CardTitle>重复文件检测</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={findDuplicates} className="w-full">扫描重复文件</Button>

          {duplicates.length > 0 && (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium">检测结果</div>
                <div className="text-sm text-muted-foreground">
                  发现 {duplicates.length} 组重复文件，可释放空间: {getTotalWastedSpace()}
                </div>
              </div>

              {duplicates.map((group: any, groupIndex: number) => (
                <div key={groupIndex} className="border rounded-lg p-3">
                  <div className="font-medium mb-2">
                    重复组 {groupIndex + 1} ({formatSize(group[0].size)})
                  </div>
                  <div className="space-y-2">
                    {group.map((file: any, fileIndex: number) => (
                      <div key={fileIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <div className="flex gap-2">
                          {fileIndex === 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              保留
                            </span>
                          )}
                          {fileIndex > 0 && (
                            <Button variant="outline" size="sm">
                              删除
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {duplicates.length === 0 && files.length > 0 && (
            <div className="text-center p-4 text-muted-foreground">
              点击扫描按钮开始检测重复文件
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 文件分析工具
  const FileAnalyzer = () => {
    const [files] = useState([
      { name: 'documents', type: 'folder', size: 15360, count: 25 },
      { name: 'images', type: 'folder', size: 51200, count: 120 },
      { name: 'videos', type: 'folder', size: 204800, count: 15 },
      { name: 'music', type: 'folder', size: 30720, count: 80 }
    ]);

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalFiles = files.reduce((sum, file) => sum + file.count, 0);

    const formatSize = (bytes: number) => {
      if (bytes >= 1024 * 1024) {
        return (bytes / 1024 / 1024).toFixed(1) + ' GB';
      }
      return (bytes / 1024).toFixed(1) + ' MB';
    };

    const getPercentage = (size: number) => {
      return ((size / totalSize) * 100).toFixed(1);
    };

    return (
      <Card>
        <CardHeader><CardTitle>文件分析工具</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
              <div className="text-sm text-muted-foreground">总大小</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold">{totalFiles}</div>
              <div className="text-sm text-muted-foreground">文件数量</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">存储分布</h4>
            {files.map((file, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatSize(file.size)} ({getPercentage(file.size)}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${getPercentage(file.size)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {file.count} 个文件
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">优化建议</h4>
            <ul className="text-sm space-y-1">
              <li>• 视频文件占用最多空间，考虑压缩或移动到外部存储</li>
              <li>• 图片文件数量较多，可以按日期整理到子文件夹</li>
              <li>• 定期清理临时文件和缓存</li>
              <li>• 使用云存储备份重要文件</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'organize', name: '文件整理', icon: FolderOpen },
    { key: 'rename', name: '批量重命名', icon: File },
    { key: 'duplicate', name: '重复检测', icon: Search },
    { key: 'analyze', name: '文件分析', icon: Download },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FolderOpen className="h-8 w-8" />
          文件管理工具
        </h1>
        <p className="text-muted-foreground mt-2">
          文件管理和整理工具，包括文件整理、批量重命名、重复检测、文件分析
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
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

      {activeTab === 'organize' && <FileOrganizer />}
      {activeTab === 'rename' && <BatchRename />}
      {activeTab === 'duplicate' && <DuplicateDetector />}
      {activeTab === 'analyze' && <FileAnalyzer />}
    </div>
  );
}
