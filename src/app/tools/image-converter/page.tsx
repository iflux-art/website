'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Image as ImageIcon, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function ImageConverterPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
  const [originalInfo, setOriginalInfo] = useState<{
    name: string;
    size: number;
    type: string;
    width: number;
    height: number;
  } | null>(null);
  const [convertedInfo, setConvertedInfo] = useState<{
    size: number;
    width: number;
    height: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(e.target?.result as string);
        setOriginalInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
        });
        
        // 自动转换
        convertImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 转换图片
  const convertImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = img.width;
    canvas.height = img.height;

    // 绘制图片
    ctx.drawImage(img, 0, 0);

    // 转换格式
    const mimeType = `image/${outputFormat}`;
    const qualityValue = outputFormat === 'png' ? undefined : quality / 100;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setConvertedImage(url);
        setConvertedInfo({
          size: blob.size,
          width: img.width,
          height: img.height,
        });
      }
    }, mimeType, qualityValue);
  };

  // 重新转换
  const reconvert = () => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => convertImage(img);
      img.src = originalImage;
    }
  };

  // 下载转换后的图片
  const downloadImage = () => {
    if (!convertedImage || !originalInfo) return;

    const link = document.createElement('a');
    link.href = convertedImage;
    
    // 生成新文件名
    const originalName = originalInfo.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const newName = `${nameWithoutExt}.${outputFormat}`;
    
    link.download = newName;
    link.click();
  };

  // 清空
  const clearAll = () => {
    setOriginalImage(null);
    setConvertedImage(null);
    setOriginalInfo(null);
    setConvertedInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 计算压缩率
  const getCompressionRatio = (): string => {
    if (!originalInfo || !convertedInfo) return '0%';
    const ratio = ((originalInfo.size - convertedInfo.size) / originalInfo.size) * 100;
    return ratio > 0 ? `${ratio.toFixed(1)}%` : '0%';
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
          <ImageIcon className="h-8 w-8" />
          图片格式转换器
        </h1>
        <p className="text-muted-foreground mt-2">
          在线转换图片格式，支持 JPEG、PNG、WebP 格式互转
        </p>
      </div>

      {/* 设置面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>转换设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">输出格式</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            
            {outputFormat !== 'png' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="flex items-end">
              <Button
                onClick={reconvert}
                disabled={!originalImage}
                className="w-full flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                重新转换
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 上传区域 */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 mx-auto"
              size="lg"
            >
              <Upload className="h-5 w-5" />
              选择图片文件
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              支持 JPEG、PNG、WebP、GIF、BMP 等格式
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* 图片预览和信息 */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 原图 */}
          <Card>
            <CardHeader>
              <CardTitle>原图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4 bg-muted/50">
                  <img
                    src={originalImage}
                    alt="原图"
                    className="max-w-full h-auto mx-auto max-h-64 object-contain"
                  />
                </div>
                
                {originalInfo && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>文件名:</span>
                      <span className="font-mono">{originalInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>格式:</span>
                      <span className="font-mono">{originalInfo.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>尺寸:</span>
                      <span className="font-mono">{originalInfo.width} × {originalInfo.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>大小:</span>
                      <span className="font-mono">{formatFileSize(originalInfo.size)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 转换后 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                转换后
                {convertedImage && (
                  <Button
                    onClick={downloadImage}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                    下载
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {convertedImage ? (
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 bg-muted/50">
                    <img
                      src={convertedImage}
                      alt="转换后"
                      className="max-w-full h-auto mx-auto max-h-64 object-contain"
                    />
                  </div>
                  
                  {convertedInfo && originalInfo && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>格式:</span>
                        <span className="font-mono">image/{outputFormat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>尺寸:</span>
                        <span className="font-mono">{convertedInfo.width} × {convertedInfo.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>大小:</span>
                        <span className="font-mono">{formatFileSize(convertedInfo.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>压缩率:</span>
                        <span className="font-mono text-green-600">{getCompressionRatio()}</span>
                      </div>
                      {outputFormat !== 'png' && (
                        <div className="flex justify-between">
                          <span>质量:</span>
                          <span className="font-mono">{quality}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  转换后的图片将显示在这里
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 操作按钮 */}
      {originalImage && (
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={clearAll} variant="outline">
            清空
          </Button>
        </div>
      )}

      {/* 隐藏的画布 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">支持的格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>输入格式</strong>：JPEG、PNG、WebP、GIF、BMP 等常见图片格式</li>
              <li>• <strong>输出格式</strong>：JPEG、PNG、WebP</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">格式特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>JPEG</strong>：有损压缩，文件小，适合照片</li>
              <li>• <strong>PNG</strong>：无损压缩，支持透明，适合图标和截图</li>
              <li>• <strong>WebP</strong>：现代格式，压缩率高，兼容性较新</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">质量设置</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• JPEG 和 WebP 支持质量调节（10-100%）</li>
              <li>• PNG 为无损格式，不支持质量调节</li>
              <li>• 质量越高文件越大，质量越低压缩率越高</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 所有处理都在浏览器本地完成，不会上传到服务器</li>
              <li>• 大文件可能需要较长处理时间</li>
              <li>• 建议在转换前备份原始文件</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
