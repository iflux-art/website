'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check, RefreshCw, RotateCcw } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { ToolActions } from '@/components/ui/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { colorUtils, exampleData } from '@/lib/tool-utils';

export default function ColorSimplePage() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<string>('');

  const addToHistory = (color: string) => {
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 9)]);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    addToHistory(color);
  };

  const generateRandomColor = () => {
    const randomColor = colorUtils.generateRandomColor();
    handleColorChange(randomColor);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearHistory = () => {
    setColorHistory([]);
  };

  const loadExample = () => {
    handleColorChange(exampleData.color());
  };

  const colorFormats = colorUtils.getColorFormats(selectedColor);

  const actions = [
    {
      label: '随机颜色',
      onClick: generateRandomColor,
      icon: RefreshCw,
    },
    {
      label: '示例颜色',
      onClick: loadExample,
      icon: Palette,
      variant: 'outline' as const,
    },
    {
      label: '清空历史',
      onClick: clearHistory,
      icon: RotateCcw,
      variant: 'outline' as const,
      disabled: colorHistory.length === 0,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>颜色选择</strong>：使用颜色选择器或输入 HEX 值</li>
          <li>• <strong>格式转换</strong>：自动转换为 RGB、HSL、CSS 变量格式</li>
          <li>• <strong>随机生成</strong>：生成随机颜色获取灵感</li>
          <li>• <strong>历史记录</strong>：保存最近使用的颜色</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">颜色格式说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>HEX</strong>：#RRGGBB 格式，网页开发常用</li>
          <li>• <strong>RGB</strong>：rgb(r, g, b) 格式，红绿蓝值</li>
          <li>• <strong>HSL</strong>：hsl(h, s%, l%) 格式，色相饱和度亮度</li>
          <li>• <strong>CSS 变量</strong>：CSS 自定义属性格式</li>
        </ul>
      </div>
    </div>
  );

  // 预设颜色
  const presetColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#8B4513',
    '#FFA500', '#FFD700', '#ADFF2F', '#00CED1', '#1E90FF', '#9370DB',
  ];

  return (
    <ToolLayout
      title="颜色工具"
      description="颜色选择、格式转换和随机生成工具"
      icon={Palette}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 颜色选择器 */}
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

            {/* 颜色历史 */}
            {colorHistory.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">颜色历史</label>
                <div className="grid grid-cols-6 gap-2">
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* 颜色格式 */}
        <Card>
          <CardHeader>
            <CardTitle>颜色格式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(colorFormats).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{key.toUpperCase()}</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(value, key)}
                      className="flex items-center gap-2"
                    >
                      {copied === key ? (
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
                    value={value}
                    readOnly
                    className="w-full p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
