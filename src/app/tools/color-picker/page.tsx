'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/cards/card';
import { ArrowLeft, Copy, Check, Palette, Upload, Shuffle, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ColorPickerPage() {
  const [activeTab, setActiveTab] = useState('picker');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 调色板相关状态
  const [paletteType, setPaletteType] = useState('complementary');
  const [paletteColors, setPaletteColors] = useState<string[]>([]);

  // 颜色转换函数
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // 生成调色板
  const generatePalette = (baseColor: string, type: string) => {
    const hsl = hexToHsl(baseColor);
    if (!hsl) return [];

    const { h, s, l } = hsl;
    let colors: string[] = [];

    switch (type) {
      case 'complementary':
        colors = [baseColor, hslToHex((h + 180) % 360, s, l)];
        break;
      case 'triadic':
        colors = [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
        break;
      case 'analogous':
        colors = [
          hslToHex((h - 30 + 360) % 360, s, l),
          baseColor,
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
        ];
        break;
      case 'monochromatic':
        colors = [
          hslToHex(h, s, Math.max(l - 40, 0)),
          hslToHex(h, s, Math.max(l - 20, 0)),
          baseColor,
          hslToHex(h, s, Math.min(l + 20, 100)),
          hslToHex(h, s, Math.min(l + 40, 100)),
        ];
        break;
      case 'tetradic':
        colors = [
          baseColor,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l),
        ];
        break;
      default:
        colors = [baseColor];
    }

    return colors;
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const randomHex = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomHex}`;
  };

  // 添加到历史记录
  const addToHistory = (color: string) => {
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 19)]); // 保留最近20个颜色
    }
  };

  // 复制颜色值
  const copyColor = async (color: string, format: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 处理颜色变化
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    addToHistory(color);
  };

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 设置画布尺寸
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 从画布获取颜色
  const getColorFromCanvas = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const hex = rgbToHex(r, g, b);

    handleColorChange(hex);
  };

  const rgb = hexToRgb(selectedColor);
  const hsl = hexToHsl(selectedColor);

  const colorFormats = [
    { name: 'HEX', value: selectedColor.toUpperCase() },
    { name: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { name: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    { name: 'CSS变量', value: `--color: ${selectedColor};` },
  ];

  // 预设颜色
  const presetColors = [
    '#FF0000',
    '#FF8000',
    '#FFFF00',
    '#80FF00',
    '#00FF00',
    '#00FF80',
    '#00FFFF',
    '#0080FF',
    '#0000FF',
    '#8000FF',
    '#FF00FF',
    '#FF0080',
    '#000000',
    '#404040',
    '#808080',
    '#C0C0C0',
    '#FFFFFF',
    '#8B4513',
    '#FFA500',
    '#FFD700',
    '#ADFF2F',
    '#00CED1',
    '#1E90FF',
    '#9370DB',
    '#FF1493',
    '#32CD32',
    '#FF6347',
    '#4169E1',
    '#DC143C',
    '#00FA9A',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">颜色选择器</h1>
            <p className="text-muted-foreground">
              专业的颜色选择工具，支持HEX、RGB、HSL格式转换，提供配色方案和调色板
            </p>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { key: 'picker', name: '颜色选择器', icon: Palette },
              { key: 'palette', name: '调色板生成', icon: Eye },
              { key: 'random', name: '随机颜色', icon: Shuffle },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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

      {/* 颜色选择器标签页 */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 颜色选择器 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>颜色选择</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 主颜色选择器 */}
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={e => handleColorChange(e.target.value)}
                    className="w-20 h-20 border border-border rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <div
                      className="w-full h-20 rounded-lg border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                </div>

                {/* 颜色值输入 */}
                <div>
                  <label className="block text-sm font-medium mb-2">HEX 颜色值</label>
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={e => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setSelectedColor(value);
                        if (value.length === 7) {
                          addToHistory(value);
                        }
                      }
                    }}
                    className="w-full p-3 border border-border rounded-lg bg-background font-mono"
                    placeholder="#000000"
                  />
                </div>

                {/* 预设颜色 */}
                <div>
                  <label className="block text-sm font-medium mb-2">预设颜色</label>
                  <div className="grid grid-cols-6 gap-2">
                    {presetColors.map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-10 h-10 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* 图片颜色提取 */}
                <div>
                  <label className="block text-sm font-medium mb-2">从图片提取颜色</label>
                  <div className="space-y-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      上传图片
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <canvas
                      ref={canvasRef}
                      onClick={getColorFromCanvas}
                      className="max-w-full border border-border rounded-lg cursor-crosshair"
                      style={{ display: canvasRef.current?.width ? 'block' : 'none' }}
                    />
                    {canvasRef.current?.width && (
                      <p className="text-sm text-muted-foreground">点击图片上的任意位置提取颜色</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 颜色信息和历史 */}
          <div className="space-y-6">
            {/* 颜色格式 */}
            <Card>
              <CardHeader>
                <CardTitle>颜色格式</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {colorFormats.map(format => (
                    <div key={format.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{format.name}</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyColor(format.value, format.name)}
                          className="flex items-center gap-2"
                        >
                          {copied === format.name ? (
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
                      </div>
                      <input
                        type="text"
                        value={format.value}
                        readOnly
                        className="w-full p-2 border border-border rounded bg-muted/50 font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 颜色历史 */}
            <Card>
              <CardHeader>
                <CardTitle>颜色历史</CardTitle>
              </CardHeader>
              <CardContent>
                {colorHistory.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">暂无颜色历史</div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {colorHistory.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className="w-10 h-10 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 颜色信息 */}
            {rgb && hsl && (
              <Card>
                <CardHeader>
                  <CardTitle>颜色信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>红色 (R):</span>
                    <span className="font-mono">{rgb.r}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>绿色 (G):</span>
                    <span className="font-mono">{rgb.g}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>蓝色 (B):</span>
                    <span className="font-mono">{rgb.b}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>色相 (H):</span>
                    <span className="font-mono">{hsl.h}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>饱和度 (S):</span>
                    <span className="font-mono">{hsl.s}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>亮度 (L):</span>
                    <span className="font-mono">{hsl.l}%</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 调色板生成标签页 */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>调色板生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">基础颜色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={e => setSelectedColor(e.target.value)}
                      className="w-12 h-12 border border-border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={e => setSelectedColor(e.target.value)}
                      className="flex-1 p-2 border border-border rounded bg-background font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">调色板类型</label>
                  <select
                    value={paletteType}
                    onChange={e => {
                      setPaletteType(e.target.value);
                      setPaletteColors(generatePalette(selectedColor, e.target.value));
                    }}
                    className="w-full p-2 border border-border rounded bg-background"
                  >
                    <option value="complementary">互补色</option>
                    <option value="triadic">三角色</option>
                    <option value="analogous">类似色</option>
                    <option value="monochromatic">单色调</option>
                    <option value="tetradic">四角色</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={() => setPaletteColors(generatePalette(selectedColor, paletteType))}
                className="w-full"
              >
                生成调色板
              </Button>

              {paletteColors.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">生成的调色板</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {paletteColors.map((color, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className="w-full h-20 rounded-lg border border-border cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                        <div className="text-center">
                          <div className="font-mono text-sm">{color.toUpperCase()}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyColor(color, `palette-${index}`)}
                            className="text-xs"
                          >
                            {copied === `palette-${index}` ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2">调色板说明</h5>
                    <p className="text-sm text-muted-foreground">
                      {paletteType === 'complementary' &&
                        '互补色：位于色轮对面的颜色，形成强烈对比'}
                      {paletteType === 'triadic' &&
                        '三角色：在色轮上等距分布的三种颜色，平衡且充满活力'}
                      {paletteType === 'analogous' && '类似色：在色轮上相邻的颜色，和谐统一'}
                      {paletteType === 'monochromatic' && '单色调：同一色相的不同明度和饱和度'}
                      {paletteType === 'tetradic' && '四角色：在色轮上形成矩形的四种颜色，丰富多彩'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 随机颜色标签页 */}
      {activeTab === 'random' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>随机颜色生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div
                  className="w-full h-32 rounded-lg border border-border mx-auto"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="font-mono text-lg">{selectedColor.toUpperCase()}</div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {
                      const newColor = generateRandomColor();
                      setSelectedColor(newColor);
                      addToHistory(newColor);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    生成随机颜色
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyColor(selectedColor, 'random')}
                    className="flex items-center gap-2"
                  >
                    {copied === 'random' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    复制颜色
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {Array.from({ length: 24 }, (_, i) => {
                  const randomColor = generateRandomColor();
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(randomColor);
                        addToHistory(randomColor);
                      }}
                      className="w-full h-12 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: randomColor }}
                      title={randomColor}
                    />
                  );
                })}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">💡 使用技巧</h5>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• 点击任意颜色块快速选择</li>
                  <li>• 生成的随机颜色会自动添加到历史记录</li>
                  <li>• 可以基于随机颜色生成调色板</li>
                  <li>• 适合寻找设计灵感和配色方案</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">颜色选择方式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用颜色选择器直接选择</li>
              <li>• 输入 HEX 颜色值</li>
              <li>• 点击预设颜色</li>
              <li>• 从上传的图片中提取</li>
              <li>• 从颜色历史中选择</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">颜色格式说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>HEX</strong>：网页开发中最常用的格式
              </li>
              <li>
                • <strong>RGB</strong>：红绿蓝三原色值
              </li>
              <li>
                • <strong>HSL</strong>：色相、饱和度、亮度
              </li>
              <li>
                • <strong>CSS变量</strong>：CSS 自定义属性格式
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 网页设计和开发</li>
              <li>• UI/UX 设计</li>
              <li>• 品牌色彩搭配</li>
              <li>• 图片颜色分析</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
