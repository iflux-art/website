'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Trash2, Image as ImageIcon, Zap } from 'lucide-react';
import Link from 'next/link';

interface ImageItem {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  originalUrl: string;
  compressedUrl?: string;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
  width?: number;
  height?: number;
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [outputFormat, setOutputFormat] = useState<'original' | 'jpeg' | 'webp' | 'png'>('original');
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length !== selectedFiles.length) {
      alert('请只选择图片文件');
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const newImage: ImageItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            originalSize: file.size,
            originalUrl: e.target?.result as string,
            status: 'pending',
            width: img.width,
            height: img.height
          };

          setImages(prev => [...prev, newImage]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 压缩单个图片
  const compressImage = async (imageItem: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算新尺寸
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx?.drawImage(img, 0, 0, width, height);

        // 确定输出格式
        let mimeType = imageItem.file.type;
        if (outputFormat !== 'original') {
          switch (outputFormat) {
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
          }
        }

        // 转换为blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedSize = blob.size;
            const compressionRatio = ((imageItem.originalSize - compressedSize) / imageItem.originalSize) * 100;
            const compressedUrl = URL.createObjectURL(blob);

            resolve({
              ...imageItem,
              compressedSize,
              compressionRatio: Math.max(0, compressionRatio),
              compressedUrl,
              status: 'completed'
            });
          } else {
            resolve({
              ...imageItem,
              status: 'error',
              error: '压缩失败'
            });
          }
        }, mimeType, quality / 100);
      };

      img.onerror = () => {
        resolve({
          ...imageItem,
          status: 'error',
          error: '图片加载失败'
        });
      };

      img.src = imageItem.originalUrl;
    });
  };

  // 压缩所有图片
  const compressAllImages = async () => {
    if (images.length === 0) return;

    setCompressing(true);

    // 更新所有图片状态为压缩中
    setImages(prev => prev.map(img => ({ ...img, status: 'compressing' as const })));

    try {
      // 逐个压缩图片（避免同时处理太多图片导致浏览器卡顿）
      const compressedImages: ImageItem[] = [];
      
      for (const image of images) {
        try {
          const compressedImage = await compressImage(image);
          compressedImages.push(compressedImage);
          
          // 实时更新单个图片的状态
          setImages(prev => prev.map(img => 
            img.id === image.id ? compressedImage : img
          ));
          
          // 添加小延迟避免阻塞UI
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          const errorImage = {
            ...image,
            status: 'error' as const,
            error: '压缩失败'
          };
          compressedImages.push(errorImage);
          
          setImages(prev => prev.map(img => 
            img.id === image.id ? errorImage : img
          ));
        }
      }

    } catch (error) {
      console.error('压缩过程出错:', error);
    } finally {
      setCompressing(false);
    }
  };

  // 下载压缩后的图片
  const downloadCompressedImage = (imageItem: ImageItem) => {
    if (!imageItem.compressedUrl) return;

    const originalName = imageItem.file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    
    let ext = '';
    switch (outputFormat) {
      case 'jpeg':
        ext = '.jpg';
        break;
      case 'webp':
        ext = '.webp';
        break;
      case 'png':
        ext = '.png';
        break;
      default:
        ext = originalName.substring(originalName.lastIndexOf('.')) || '.jpg';
    }

    const newName = `${nameWithoutExt}_compressed${ext}`;

    const a = document.createElement('a');
    a.href = imageItem.compressedUrl;
    a.download = newName;
    a.click();
  };

  // 下载所有压缩图片
  const downloadAllCompressed = () => {
    const completedImages = images.filter(img => img.status === 'completed' && img.compressedUrl);
    completedImages.forEach(img => downloadCompressedImage(img));
  };

  // 移除图片
  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        // 清理URL对象
        URL.revokeObjectURL(imageToRemove.originalUrl);
        if (imageToRemove.compressedUrl) {
          URL.revokeObjectURL(imageToRemove.compressedUrl);
        }
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // 清空所有图片
  const clearAllImages = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) {
        URL.revokeObjectURL(img.compressedUrl);
      }
    });
    setImages([]);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

  // 计算总体统计
  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
  const completedImages = images.filter(img => img.status === 'completed');
  const averageCompressionRatio = completedImages.length > 0 
    ? completedImages.reduce((sum, img) => sum + (img.compressionRatio || 0), 0) / completedImages.length 
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
          <Zap className="h-8 w-8" />
          图片压缩优化
        </h1>
        <p className="text-muted-foreground mt-2">
          压缩图片文件大小，优化网页加载速度
        </p>
      </div>

      {/* 压缩设置 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>压缩设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                图片质量: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>小文件</span>
                <span>高质量</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">最大宽度 (px)</label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                min="100"
                max="4000"
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">最大高度 (px)</label>
              <input
                type="number"
                value={maxHeight}
                onChange={(e) => setMaxHeight(Number(e.target.value))}
                min="100"
                max="4000"
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">输出格式</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="original">保持原格式</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="cursor-pointer">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  选择图片
                </span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 图片列表 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>图片列表 ({images.length})</span>
            <div className="flex gap-2">
              {images.length > 0 && (
                <>
                  <Button
                    onClick={compressAllImages}
                    disabled={compressing || images.every(img => img.status === 'completed')}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {compressing ? '压缩中...' : '开始压缩'}
                  </Button>
                  {completedImages.length > 0 && (
                    <Button
                      onClick={downloadAllCompressed}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      下载全部
                    </Button>
                  )}
                  <Button onClick={clearAllImages} variant="outline" size="sm">
                    清空
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>还没有选择图片</p>
              <p className="text-sm">点击"选择图片"开始添加要压缩的图片</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((imageItem) => (
                <div
                  key={imageItem.id}
                  className="border border-border rounded-lg overflow-hidden bg-muted/50"
                >
                  {/* 图片预览 */}
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={imageItem.originalUrl}
                      alt={imageItem.file.name}
                      className="w-full h-full object-cover"
                    />
                    {imageItem.status === 'compressing' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {/* 图片信息 */}
                  <div className="p-4">
                    <div className="font-medium text-sm truncate mb-2">{imageItem.file.name}</div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>尺寸: {imageItem.width} × {imageItem.height}</div>
                      <div>原始大小: {formatFileSize(imageItem.originalSize)}</div>
                      {imageItem.compressedSize && (
                        <div className="text-green-600">
                          压缩后: {formatFileSize(imageItem.compressedSize)}
                          {' ('}
                          -{imageItem.compressionRatio!.toFixed(1)}%
                          {')'}
                        </div>
                      )}
                    </div>

                    <div className={`text-xs mt-2 ${getStatusColor(imageItem.status)}`}>
                      {imageItem.status === 'pending' && '等待压缩'}
                      {imageItem.status === 'compressing' && '压缩中...'}
                      {imageItem.status === 'completed' && '压缩完成'}
                      {imageItem.status === 'error' && `错误: ${imageItem.error}`}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-between items-center mt-3">
                      {imageItem.status === 'completed' ? (
                        <Button
                          onClick={() => downloadCompressedImage(imageItem)}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          下载
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      <Button
                        onClick={() => removeImage(imageItem.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 压缩统计 */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>压缩统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{images.length}</div>
                <div className="text-sm text-muted-foreground">总图片数</div>
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
            <h4 className="font-medium mb-2">压缩原理</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>质量压缩</strong>：降低图片质量以减小文件大小</li>
              <li>• <strong>尺寸压缩</strong>：缩小图片尺寸以减小文件大小</li>
              <li>• <strong>格式转换</strong>：转换为更高效的图片格式</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">格式建议</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>JPEG</strong>：适合照片，文件小但有损压缩</li>
              <li>• <strong>WebP</strong>：现代格式，压缩率高，支持透明</li>
              <li>• <strong>PNG</strong>：无损压缩，适合图标和透明图片</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">优化建议</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 网页图片建议质量设置为70-85%</li>
              <li>• 移动端图片可适当降低尺寸</li>
              <li>• 批量处理可提高效率</li>
              <li>• 压缩前建议备份原图</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
