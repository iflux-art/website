'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Crop, Palette, Type } from 'lucide-react';
import Link from 'next/link';

export default function ImageEditorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<'resize' | 'crop' | 'filter' | 'watermark'>('resize');
  const [imageInfo, setImageInfo] = useState<{
    name: string;
    size: number;
    width: number;
    height: number;
  } | null>(null);

  // 调整大小设置
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);

  // 裁剪设置
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(400);
  const [cropHeight, setCropHeight] = useState(300);

  // 滤镜设置
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // 水印设置
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkSize, setWatermarkSize] = useState(24);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(e.target?.result as string);
        setOriginalImage(img);
        setImageInfo({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height
        });

        // 设置默认值
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        setCropWidth(Math.min(400, img.width));
        setCropHeight(Math.min(300, img.height));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 更新宽度时保持比例
  const updateWidth = (width: number) => {
    setResizeWidth(width);
    if (maintainAspect && originalImage) {
      const ratio = originalImage.height / originalImage.width;
      setResizeHeight(Math.round(width * ratio));
    }
  };

  // 更新高度时保持比例
  const updateHeight = (height: number) => {
    setResizeHeight(height);
    if (maintainAspect && originalImage) {
      const ratio = originalImage.width / originalImage.height;
      setResizeWidth(Math.round(height * ratio));
    }
  };

  // 应用处理
  const applyProcessing = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sourceX = 0, sourceY = 0, sourceWidth = originalImage.width, sourceHeight = originalImage.height;
    let destWidth = originalImage.width, destHeight = originalImage.height;

    switch (mode) {
      case 'resize':
        destWidth = resizeWidth;
        destHeight = resizeHeight;
        break;
      case 'crop':
        sourceX = cropX;
        sourceY = cropY;
        sourceWidth = cropWidth;
        sourceHeight = cropHeight;
        destWidth = cropWidth;
        destHeight = cropHeight;
        break;
      case 'filter':
        destWidth = originalImage.width;
        destHeight = originalImage.height;
        break;
      case 'watermark':
        destWidth = originalImage.width;
        destHeight = originalImage.height;
        break;
    }

    canvas.width = destWidth;
    canvas.height = destHeight;

    // 应用滤镜
    if (mode === 'filter') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    } else {
      ctx.filter = 'none';
    }

    // 绘制图片
    ctx.drawImage(
      originalImage,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, destWidth, destHeight
    );

    // 添加水印
    if (mode === 'watermark') {
      ctx.filter = 'none';
      ctx.font = `${watermarkSize}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity / 100})`;
      ctx.lineWidth = 1;
      
      const x = destWidth - ctx.measureText(watermarkText).width - 20;
      const y = destHeight - 20;
      
      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);
    }
  };

  // 下载处理后的图片
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageInfo) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const originalName = imageInfo.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const ext = originalName.substring(originalName.lastIndexOf('.'));
        const newName = `${nameWithoutExt}_${mode}${ext}`;
        
        a.download = newName;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  // 清空
  const clearImage = () => {
    setImage(null);
    setOriginalImage(null);
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 实时预览
  useEffect(() => {
    if (originalImage) {
      applyProcessing();
    }
  }, [originalImage, mode, resizeWidth, resizeHeight, cropX, cropY, cropWidth, cropHeight, 
      brightness, contrast, saturation, blur, watermarkText, watermarkOpacity, watermarkSize]);

  const modes = [
    { key: 'resize', name: '调整大小', icon: ImageIcon },
    { key: 'crop', name: '裁剪', icon: Crop },
    { key: 'filter', name: '滤镜', icon: Palette },
    { key: 'watermark', name: '水印', icon: Type },
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          图片处理工具
        </h1>
        <p className="text-muted-foreground mt-2">
          在线图片编辑，支持调整大小、裁剪、滤镜、水印等功能
        </p>
      </div>

      {/* 文件上传 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>选择图片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                选择图片文件
              </Button>
              <p className="text-sm text-muted-foreground">
                支持 JPG、PNG、GIF、WebP 等格式
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {imageInfo && (
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/50">
                <ImageIcon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{imageInfo.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(imageInfo.size)} • {imageInfo.width} × {imageInfo.height}
                  </div>
                </div>
                <Button onClick={clearImage} variant="outline" size="sm">
                  清空
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 模式选择 */}
      {image && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => {
              const IconComponent = m.icon;
              return (
                <Button
                  key={m.key}
                  variant={mode === m.key ? 'default' : 'outline'}
                  onClick={() => setMode(m.key as any)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {m.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* 主要编辑区域 */}
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 设置面板 */}
          <Card>
            <CardHeader>
              <CardTitle>
                {modes.find(m => m.key === mode)?.name}设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 调整大小设置 */}
              {mode === 'resize' && (
                <>
                  <div>
                    <label className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={maintainAspect}
                        onChange={(e) => setMaintainAspect(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">保持宽高比</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">宽度 (px)</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => updateWidth(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">高度 (px)</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => updateHeight(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                      min="1"
                    />
                  </div>
                </>
              )}

              {/* 裁剪设置 */}
              {mode === 'crop' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">X坐标</label>
                      <input
                        type="number"
                        value={cropX}
                        onChange={(e) => setCropX(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded bg-background"
                        min="0"
                        max={originalImage?.width || 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Y坐标</label>
                      <input
                        type="number"
                        value={cropY}
                        onChange={(e) => setCropY(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded bg-background"
                        min="0"
                        max={originalImage?.height || 0}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">宽度</label>
                      <input
                        type="number"
                        value={cropWidth}
                        onChange={(e) => setCropWidth(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded bg-background"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">高度</label>
                      <input
                        type="number"
                        value={cropHeight}
                        onChange={(e) => setCropHeight(Number(e.target.value))}
                        className="w-full p-2 border border-border rounded bg-background"
                        min="1"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 滤镜设置 */}
              {mode === 'filter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      亮度: {brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      对比度: {contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      饱和度: {saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      模糊: {blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {/* 水印设置 */}
              {mode === 'watermark' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">水印文字</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      透明度: {watermarkOpacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      字体大小: {watermarkSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={downloadImage}
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                下载处理后的图片
              </Button>
            </CardContent>
          </Card>

          {/* 预览区域 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 原图 */}
                  <div>
                    <h4 className="font-medium mb-2">原图</h4>
                    <div className="border border-border rounded-lg p-4 bg-muted/50 overflow-auto">
                      <img
                        src={image}
                        alt="原图"
                        className="max-w-full h-auto max-h-64 object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* 处理后 */}
                  <div>
                    <h4 className="font-medium mb-2">处理后</h4>
                    <div className="border border-border rounded-lg p-4 bg-muted/50 overflow-auto">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto max-h-64 object-contain mx-auto border"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能介绍</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>调整大小</strong>：改变图片尺寸，可保持宽高比</li>
              <li>• <strong>裁剪</strong>：截取图片的指定区域</li>
              <li>• <strong>滤镜</strong>：调整亮度、对比度、饱和度、模糊</li>
              <li>• <strong>水印</strong>：在图片上添加文字水印</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 调整参数后会实时预览效果</li>
              <li>• 保持宽高比可避免图片变形</li>
              <li>• 裁剪时注意坐标不要超出原图范围</li>
              <li>• 水印位置固定在右下角</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 所有处理都在浏览器本地完成</li>
              <li>• 大图片处理可能需要较长时间</li>
              <li>• 建议先备份原始图片</li>
              <li>• 处理后的图片质量可能有所损失</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
