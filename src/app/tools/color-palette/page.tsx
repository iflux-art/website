'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Palette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// 颜色数据
const COLOR_PALETTES = {
  gray: {
    name: '灰色',
    colors: [
      { name: 'Gray 50', hex: '#f9fafb', rgb: 'rgb(249, 250, 251)' },
      { name: 'Gray 100', hex: '#f3f4f6', rgb: 'rgb(243, 244, 246)' },
      { name: 'Gray 200', hex: '#e5e7eb', rgb: 'rgb(229, 231, 235)' },
      { name: 'Gray 300', hex: '#d1d5db', rgb: 'rgb(209, 213, 219)' },
      { name: 'Gray 400', hex: '#9ca3af', rgb: 'rgb(156, 163, 175)' },
      { name: 'Gray 500', hex: '#6b7280', rgb: 'rgb(107, 114, 128)' },
      { name: 'Gray 600', hex: '#4b5563', rgb: 'rgb(75, 85, 99)' },
      { name: 'Gray 700', hex: '#374151', rgb: 'rgb(55, 65, 81)' },
      { name: 'Gray 800', hex: '#1f2937', rgb: 'rgb(31, 41, 55)' },
      { name: 'Gray 900', hex: '#111827', rgb: 'rgb(17, 24, 39)' },
    ],
  },
  blue: {
    name: '蓝色',
    colors: [
      { name: 'Blue 50', hex: '#eff6ff', rgb: 'rgb(239, 246, 255)' },
      { name: 'Blue 100', hex: '#dbeafe', rgb: 'rgb(219, 234, 254)' },
      { name: 'Blue 200', hex: '#bfdbfe', rgb: 'rgb(191, 219, 254)' },
      { name: 'Blue 300', hex: '#93c5fd', rgb: 'rgb(147, 197, 253)' },
      { name: 'Blue 400', hex: '#60a5fa', rgb: 'rgb(96, 165, 250)' },
      { name: 'Blue 500', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
      { name: 'Blue 600', hex: '#2563eb', rgb: 'rgb(37, 99, 235)' },
      { name: 'Blue 700', hex: '#1d4ed8', rgb: 'rgb(29, 78, 216)' },
      { name: 'Blue 800', hex: '#1e40af', rgb: 'rgb(30, 64, 175)' },
      { name: 'Blue 900', hex: '#1e3a8a', rgb: 'rgb(30, 58, 138)' },
    ],
  },
  green: {
    name: '绿色',
    colors: [
      { name: 'Green 50', hex: '#f0fdf4', rgb: 'rgb(240, 253, 244)' },
      { name: 'Green 100', hex: '#dcfce7', rgb: 'rgb(220, 252, 231)' },
      { name: 'Green 200', hex: '#bbf7d0', rgb: 'rgb(187, 247, 208)' },
      { name: 'Green 300', hex: '#86efac', rgb: 'rgb(134, 239, 172)' },
      { name: 'Green 400', hex: '#4ade80', rgb: 'rgb(74, 222, 128)' },
      { name: 'Green 500', hex: '#22c55e', rgb: 'rgb(34, 197, 94)' },
      { name: 'Green 600', hex: '#16a34a', rgb: 'rgb(22, 163, 74)' },
      { name: 'Green 700', hex: '#15803d', rgb: 'rgb(21, 128, 61)' },
      { name: 'Green 800', hex: '#166534', rgb: 'rgb(22, 101, 52)' },
      { name: 'Green 900', hex: '#14532d', rgb: 'rgb(20, 83, 45)' },
    ],
  },
  red: {
    name: '红色',
    colors: [
      { name: 'Red 50', hex: '#fef2f2', rgb: 'rgb(254, 242, 242)' },
      { name: 'Red 100', hex: '#fee2e2', rgb: 'rgb(254, 226, 226)' },
      { name: 'Red 200', hex: '#fecaca', rgb: 'rgb(254, 202, 202)' },
      { name: 'Red 300', hex: '#fca5a5', rgb: 'rgb(252, 165, 165)' },
      { name: 'Red 400', hex: '#f87171', rgb: 'rgb(248, 113, 113)' },
      { name: 'Red 500', hex: '#ef4444', rgb: 'rgb(239, 68, 68)' },
      { name: 'Red 600', hex: '#dc2626', rgb: 'rgb(220, 38, 38)' },
      { name: 'Red 700', hex: '#b91c1c', rgb: 'rgb(185, 28, 28)' },
      { name: 'Red 800', hex: '#991b1b', rgb: 'rgb(153, 27, 27)' },
      { name: 'Red 900', hex: '#7f1d1d', rgb: 'rgb(127, 29, 29)' },
    ],
  },
  purple: {
    name: '紫色',
    colors: [
      { name: 'Purple 50', hex: '#faf5ff', rgb: 'rgb(250, 245, 255)' },
      { name: 'Purple 100', hex: '#f3e8ff', rgb: 'rgb(243, 232, 255)' },
      { name: 'Purple 200', hex: '#e9d5ff', rgb: 'rgb(233, 213, 255)' },
      { name: 'Purple 300', hex: '#d8b4fe', rgb: 'rgb(216, 180, 254)' },
      { name: 'Purple 400', hex: '#c084fc', rgb: 'rgb(192, 132, 252)' },
      { name: 'Purple 500', hex: '#a855f7', rgb: 'rgb(168, 85, 247)' },
      { name: 'Purple 600', hex: '#9333ea', rgb: 'rgb(147, 51, 234)' },
      { name: 'Purple 700', hex: '#7c3aed', rgb: 'rgb(124, 58, 237)' },
      { name: 'Purple 800', hex: '#6b21a8', rgb: 'rgb(107, 33, 168)' },
      { name: 'Purple 900', hex: '#581c87', rgb: 'rgb(88, 28, 135)' },
    ],
  },
};

export default function ColorPalettePage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copyFormat, setCopyFormat] = useState<'hex' | 'rgb'>('hex');

  const copyToClipboard = async (color: { hex: string; rgb: string }) => {
    const value = copyFormat === 'hex' ? color.hex : color.rgb;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedColor(value);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
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
          <Palette className="h-8 w-8" />
          颜色库
        </h1>
        <p className="text-muted-foreground mt-2">精选颜色库，支持一键复制 HEX 和 RGB 色值</p>
      </div>

      {/* 格式选择 */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">复制格式：</span>
          <Button
            variant={copyFormat === 'hex' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCopyFormat('hex')}
          >
            HEX
          </Button>
          <Button
            variant={copyFormat === 'rgb' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCopyFormat('rgb')}
          >
            RGB
          </Button>
        </div>
      </div>

      {/* 颜色面板 */}
      <div className="space-y-8">
        {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {palette.name}
                <Badge variant="outline">{palette.colors.length} 色</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                {palette.colors.map(color => (
                  <div key={color.name} className="space-y-2">
                    {/* 颜色块 */}
                    <div
                      className="w-full h-16 rounded-lg border cursor-pointer hover:scale-105 transition-transform relative group"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color)}
                    >
                      {/* 复制图标 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === (copyFormat === 'hex' ? color.hex : color.rgb) ? (
                          <Check className="h-5 w-5 text-white drop-shadow-lg" />
                        ) : (
                          <Copy className="h-5 w-5 text-white drop-shadow-lg" />
                        )}
                      </div>
                    </div>

                    {/* 颜色信息 */}
                    <div className="text-center">
                      <div className="text-xs font-medium text-foreground">{color.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {copyFormat === 'hex' ? color.hex : color.rgb}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">如何使用</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 点击任意颜色块即可复制色值到剪贴板</li>
              <li>• 可以选择复制 HEX 或 RGB 格式</li>
              <li>• 所有颜色都来自 Tailwind CSS 官方色板</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tailwind CSS 使用</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>在 Tailwind CSS 中，可以这样使用这些颜色：</p>
              <code className="block bg-muted p-2 rounded text-xs font-mono mt-2">
                &lt;div className="bg-blue-500 text-white"&gt;蓝色背景&lt;/div&gt;
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
