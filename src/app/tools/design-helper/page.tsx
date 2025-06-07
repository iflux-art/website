'use client';

import React, { useState } from 'react';
import type { IconType } from 'react-icons';

type TabKey = 'colors' | 'typography' | 'spacing' | 'grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Layout, Ruler, Copy, Check } from 'lucide-react';
import { ToolLayout } from '@/components/layout/ToolLayout';

export default function DesignHelperPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('colors');
  const [copied, setCopied] = useState<string | null>(null);

  // 复制内容
  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 调色板生成器
  const PaletteGenerator = () => {
    const [baseColor, setBaseColor] = useState('#3B82F6');
    const [paletteType, setPaletteType] = useState<
      'monochromatic' | 'analogous' | 'complementary' | 'triadic'
    >('monochromatic');

    // 颜色转换函数
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

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

      return [h * 360, s * 100, l * 100];
    };

    const hslToHex = (h: number, s: number, l: number) => {
      h /= 360;
      s /= 100;
      l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const generatePalette = () => {
      const [h, s, l] = hexToHsl(baseColor);
      const colors = [];

      switch (paletteType) {
        case 'monochromatic':
          for (let i = 0; i < 5; i++) {
            colors.push(hslToHex(h, s, Math.max(10, Math.min(90, l + (i - 2) * 20))));
          }
          break;
        case 'analogous':
          for (let i = 0; i < 5; i++) {
            colors.push(hslToHex((h + (i - 2) * 30 + 360) % 360, s, l));
          }
          break;
        case 'complementary':
          colors.push(baseColor);
          colors.push(hslToHex((h + 180) % 360, s, l));
          colors.push(hslToHex(h, s * 0.7, l * 1.2));
          colors.push(hslToHex((h + 180) % 360, s * 0.7, l * 1.2));
          colors.push(hslToHex(h, s * 0.5, l * 0.8));
          break;
        case 'triadic':
          colors.push(baseColor);
          colors.push(hslToHex((h + 120) % 360, s, l));
          colors.push(hslToHex((h + 240) % 360, s, l));
          colors.push(hslToHex(h, s * 0.7, l * 1.2));
          colors.push(hslToHex((h + 120) % 360, s * 0.7, l * 1.2));
          break;
      }

      return colors;
    };

    const palette = generatePalette();

    const generateCSS = () => {
      return `:root {
${palette.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}

/* 使用示例 */
.primary { background-color: var(--color-1); }
.secondary { background-color: var(--color-2); }
.accent { background-color: var(--color-3); }`;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>调色板设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">基础颜色</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={e => setBaseColor(e.target.value)}
                    className="w-16 h-10 border border-border rounded"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={e => setBaseColor(e.target.value)}
                    className="flex-1 p-2 border border-border rounded-lg bg-background font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">调色板类型</label>
                <select
                  value={paletteType}
                  onChange={e => setPaletteType(e.target.value as typeof paletteType)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  <option value="monochromatic">单色调</option>
                  <option value="analogous">类似色</option>
                  <option value="complementary">互补色</option>
                  <option value="triadic">三角色</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              生成的调色板
              <Button
                onClick={() => copyContent(generateCSS(), 'palette')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied === 'palette' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                复制CSS
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 mb-4">
              {palette.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-border cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => copyContent(color, `color-${index}`)}
                  />
                  <div className="mt-2 text-sm font-mono">{color}</div>
                  {copied === `color-${index}` && (
                    <div className="text-xs text-green-600">已复制</div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">CSS 变量</h4>
              <pre className="text-sm font-mono overflow-x-auto">{generateCSS()}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 字体排版工具
  const TypographyTool = () => {
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [fontFamily, setFontFamily] = useState('Inter');

    const fontFamilies = [
      'Inter',
      'Roboto',
      'Open Sans',
      'Lato',
      'Montserrat',
      'Source Sans Pro',
      'Poppins',
      'Nunito',
      'Raleway',
      'Ubuntu',
    ];

    const generateTypographyScale = () => {
      const scale = 1.25; // Major Third
      const sizes = [];
      for (let i = -2; i <= 4; i++) {
        sizes.push(Math.round(fontSize * Math.pow(scale, i)));
      }
      return sizes;
    };

    const typographyScale = generateTypographyScale();

    const generateCSS = () => {
      return `/* Typography Scale */
:root {
  --font-family: '${fontFamily}', sans-serif;
  --line-height: ${lineHeight};
  --font-size-xs: ${typographyScale[0]}px;
  --font-size-sm: ${typographyScale[1]}px;
  --font-size-base: ${typographyScale[2]}px;
  --font-size-lg: ${typographyScale[3]}px;
  --font-size-xl: ${typographyScale[4]}px;
  --font-size-2xl: ${typographyScale[5]}px;
  --font-size-3xl: ${typographyScale[6]}px;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }
h4 { font-size: var(--font-size-lg); }
p { font-size: var(--font-size-base); }
small { font-size: var(--font-size-sm); }`;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>字体设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">字体族</label>
                <select
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">基础字号 ({fontSize}px)</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">行高 ({lineHeight})</label>
                <input
                  type="range"
                  min="1.2"
                  max="2"
                  step="0.1"
                  value={lineHeight}
                  onChange={e => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              字体比例预览
              <Button
                onClick={() => copyContent(generateCSS(), 'typography')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied === 'typography' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                复制CSS
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" style={{ fontFamily }}>
              {[
                { label: 'H1 标题', size: typographyScale[6], tag: 'h1' },
                { label: 'H2 标题', size: typographyScale[5], tag: 'h2' },
                { label: 'H3 标题', size: typographyScale[4], tag: 'h3' },
                { label: 'H4 标题', size: typographyScale[3], tag: 'h4' },
                { label: '正文', size: typographyScale[2], tag: 'p' },
                { label: '小字', size: typographyScale[1], tag: 'small' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground">{item.size}px</div>
                  <div
                    style={{
                      fontSize: `${item.size}px`,
                      lineHeight: lineHeight,
                      fontWeight: item.tag.startsWith('h') ? '600' : '400',
                    }}
                  >
                    {item.label} - The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">CSS 代码</h4>
              <pre className="text-sm font-mono overflow-x-auto">{generateCSS()}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 布局网格工具
  const LayoutTool = () => {
    const [columns, setColumns] = useState(12);
    const [gap, setGap] = useState(24);
    const [maxWidth, setMaxWidth] = useState(1200);

    const generateGridCSS = () => {
      return `.container {
  max-width: ${maxWidth}px;
  margin: 0 auto;
  padding: 0 ${gap / 2}px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
}

/* 响应式列 */
${Array.from({ length: columns }, (_, i) => i + 1)
  .map(col => `.col-${col} { grid-column: span ${col}; }`)
  .join('\n')}

/* 响应式断点 */
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
  [class*="col-"] { grid-column: span 1; }
}`;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>网格设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">列数 ({columns})</label>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={columns}
                  onChange={e => setColumns(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">间距 ({gap}px)</label>
                <input
                  type="range"
                  min="8"
                  max="48"
                  step="4"
                  value={gap}
                  onChange={e => setGap(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">最大宽度 ({maxWidth}px)</label>
                <input
                  type="range"
                  min="960"
                  max="1440"
                  step="60"
                  value={maxWidth}
                  onChange={e => setMaxWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              网格预览
              <Button
                onClick={() => copyContent(generateGridCSS(), 'grid')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied === 'grid' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                复制CSS
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid border border-border rounded-lg p-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: columns }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary/10 border border-primary/20 rounded p-2 text-center text-xs"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="mt-6 bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">CSS 代码</h4>
              <pre className="text-sm font-mono overflow-x-auto">{generateGridCSS()}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 间距系统
  const SpacingTool = () => {
    const [baseUnit, setBaseUnit] = useState(8);
    // 比例暂时固定，但保留状态以支持未来可能的自定义功能
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [scale, _setScale] = useState([0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16]);

    const generateSpacingCSS = () => {
      return `:root {
${scale.map((multiplier, index) => `  --spacing-${index}: ${baseUnit * multiplier}px;`).join('\n')}
}

/* 间距工具类 */
${scale
  .map((multiplier, index) => {
    const value = baseUnit * multiplier;
    return `.m-${index} { margin: ${value}px; }
.mt-${index} { margin-top: ${value}px; }
.mr-${index} { margin-right: ${value}px; }
.mb-${index} { margin-bottom: ${value}px; }
.ml-${index} { margin-left: ${value}px; }
.p-${index} { padding: ${value}px; }
.pt-${index} { padding-top: ${value}px; }
.pr-${index} { padding-right: ${value}px; }
.pb-${index} { padding-bottom: ${value}px; }
.pl-${index} { padding-left: ${value}px; }`;
  })
  .join('\n')}`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            间距系统
            <Button
              onClick={() => copyContent(generateSpacingCSS(), 'spacing')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied === 'spacing' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              复制CSS
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">基础单位 ({baseUnit}px)</label>
            <input
              type="range"
              min="4"
              max="16"
              value={baseUnit}
              onChange={e => setBaseUnit(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">间距预览</h4>
            {scale.map((multiplier, index) => {
              const value = baseUnit * multiplier;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-mono">--{index}</div>
                  <div className="w-16 text-sm">{value}px</div>
                  <div className="bg-primary h-4 rounded" style={{ width: `${value}px` }} />
                </div>
              );
            })}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">CSS 代码</h4>
            <pre className="text-sm font-mono overflow-x-auto max-h-64">{generateSpacingCSS()}</pre>
          </div>
        </CardContent>
      </Card>
    );
  };

  interface Tab {
    key: TabKey;
    label: string;
    icon: IconType;
  }

  const tabs: Tab[] = [
    { key: 'colors', label: '调色板', icon: Palette },
    { key: 'typography', label: '字体排版', icon: Type },
    { key: 'grid', label: '布局网格', icon: Layout },
    { key: 'spacing', label: '间距系统', icon: Ruler },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>调色板</strong>：基于色彩理论生成和谐的配色方案
          </li>
          <li>
            • <strong>字体排版</strong>：创建一致的字体比例系统
          </li>
          <li>
            • <strong>布局网格</strong>：生成响应式网格布局系统
          </li>
          <li>
            • <strong>间距系统</strong>：建立统一的间距规范
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">设计建议</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 使用一致的设计系统提高用户体验</li>
          <li>• 调色板应考虑可访问性和对比度</li>
          <li>• 字体比例遵循数学规律，保持视觉和谐</li>
          <li>• 间距系统基于基础单位，便于维护</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="设计辅助工具"
      description="设计系统构建工具，包括调色板、字体、布局和间距系统"
      icon={Palette}
      helpContent={helpContent}
    >
      {/* 功能标签页 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 内容区域 */}
      {activeTab === 'colors' && <PaletteGenerator />}
      {activeTab === 'typography' && <TypographyTool />}
      {activeTab === 'grid' && <LayoutTool />}
      {activeTab === 'spacing' && <SpacingTool />}
    </ToolLayout>
  );
}