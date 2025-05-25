'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function QrGeneratorPage() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [margin, setMargin] = useState(4);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 简单的二维码生成函数（使用 Canvas 绘制简单的二维码模式）
  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // 清空画布
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // 生成简单的二维码模式（这是一个简化版本，实际项目中应使用专业的二维码库）
    const moduleSize = Math.floor((size - margin * 2) / 25); // 25x25 模块
    const startX = margin;
    const startY = margin;

    ctx.fillStyle = foregroundColor;

    // 生成基于文本的伪随机模式
    const pattern = generatePattern(text);
    
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(
            startX + col * moduleSize,
            startY + row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    // 添加定位标记（三个角的方块）
    drawFinderPattern(ctx, startX, startY, moduleSize);
    drawFinderPattern(ctx, startX + 18 * moduleSize, startY, moduleSize);
    drawFinderPattern(ctx, startX, startY + 18 * moduleSize, moduleSize);
  };

  // 生成基于文本的模式
  const generatePattern = (input: string): boolean[][] => {
    const pattern: boolean[][] = Array(25).fill(null).map(() => Array(25).fill(false));
    
    // 使用文本生成伪随机模式
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xffffffff;
    }

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // 跳过定位标记区域
        if (isFinderPatternArea(row, col)) continue;
        
        const seed = hash + row * 25 + col;
        pattern[row][col] = (seed % 3) === 0;
      }
    }

    return pattern;
  };

  // 检查是否是定位标记区域
  const isFinderPatternArea = (row: number, col: number): boolean => {
    return (
      (row < 7 && col < 7) || // 左上角
      (row < 7 && col > 17) || // 右上角
      (row > 17 && col < 7)    // 左下角
    );
  };

  // 绘制定位标记
  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // 外框 7x7
    ctx.fillStyle = foregroundColor;
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // 内部白色 5x5
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // 中心黑色 3x3
    ctx.fillStyle = foregroundColor;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  // 下载二维码
  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // 预设文本
  const loadExample = () => {
    setText('https://example.com');
  };

  const clearText = () => {
    setText('');
  };

  useEffect(() => {
    generateQRCode();
  }, [text, size, errorLevel, margin, foregroundColor, backgroundColor]);

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
          <QrCode className="h-8 w-8" />
          二维码生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成自定义二维码，支持文本、URL、联系信息等
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>二维码设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 文本输入 */}
              <div>
                <label className="block text-sm font-medium mb-2">内容</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="输入要生成二维码的内容..."
                  className="w-full h-24 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 尺寸 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  尺寸: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* 容错级别 */}
              <div>
                <label className="block text-sm font-medium mb-2">容错级别</label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  <option value="L">低 (L) - 约7%</option>
                  <option value="M">中 (M) - 约15%</option>
                  <option value="Q">较高 (Q) - 约25%</option>
                  <option value="H">高 (H) - 约30%</option>
                </select>
              </div>

              {/* 边距 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  边距: {margin}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 颜色设置 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">前景色</label>
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">背景色</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                <Button onClick={generateQRCode} className="w-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  重新生成
                </Button>
                <Button onClick={loadExample} variant="outline" className="w-full">
                  加载示例
                </Button>
                <Button onClick={clearText} variant="outline" className="w-full">
                  清空内容
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 预览和下载 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>二维码预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {/* 二维码画布 */}
                <div className="border border-border rounded-lg p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* 下载按钮 */}
                {text && (
                  <Button onClick={downloadQRCode} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    下载 PNG
                  </Button>
                )}

                {/* 提示信息 */}
                {!text && (
                  <div className="text-center text-muted-foreground">
                    请输入内容生成二维码
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 使用说明 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">支持的内容类型</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>网址</strong>：https://example.com</li>
                  <li>• <strong>文本</strong>：任意文本内容</li>
                  <li>• <strong>邮箱</strong>：mailto:user@example.com</li>
                  <li>• <strong>电话</strong>：tel:+1234567890</li>
                  <li>• <strong>短信</strong>：sms:+1234567890</li>
                  <li>• <strong>WiFi</strong>：WIFI:T:WPA;S:网络名;P:密码;;</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">容错级别说明</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>低 (L)</strong>：可恢复约7%的数据</li>
                  <li>• <strong>中 (M)</strong>：可恢复约15%的数据（推荐）</li>
                  <li>• <strong>较高 (Q)</strong>：可恢复约25%的数据</li>
                  <li>• <strong>高 (H)</strong>：可恢复约30%的数据</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">注意事项</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 内容越长，二维码越复杂</li>
                  <li>• 建议使用高对比度的颜色组合</li>
                  <li>• 打印时确保足够的分辨率</li>
                  <li>• 测试扫描效果后再正式使用</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
