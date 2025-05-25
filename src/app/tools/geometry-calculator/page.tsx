'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Triangle, Square, Circle } from 'lucide-react';
import Link from 'next/link';

export default function GeometryCalculatorPage() {
  const [shape, setShape] = useState<'triangle' | 'rectangle' | 'circle' | 'sphere' | 'cylinder'>('triangle');
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: number }>({});
  const [copied, setCopied] = useState<string | null>(null);

  // 计算函数
  const calculate = () => {
    const values: { [key: string]: number } = {};
    Object.keys(inputs).forEach(key => {
      values[key] = parseFloat(inputs[key]) || 0;
    });

    let newResults: { [key: string]: number } = {};

    switch (shape) {
      case 'triangle':
        if (values.base && values.height) {
          newResults.area = (values.base * values.height) / 2;
        }
        if (values.a && values.b && values.c) {
          // 海伦公式计算面积
          const s = (values.a + values.b + values.c) / 2;
          newResults.areaHeron = Math.sqrt(s * (s - values.a) * (s - values.b) * (s - values.c));
          newResults.perimeter = values.a + values.b + values.c;
        }
        break;

      case 'rectangle':
        if (values.length && values.width) {
          newResults.area = values.length * values.width;
          newResults.perimeter = 2 * (values.length + values.width);
          newResults.diagonal = Math.sqrt(values.length ** 2 + values.width ** 2);
        }
        break;

      case 'circle':
        if (values.radius) {
          newResults.area = Math.PI * values.radius ** 2;
          newResults.circumference = 2 * Math.PI * values.radius;
          newResults.diameter = 2 * values.radius;
        }
        break;

      case 'sphere':
        if (values.radius) {
          newResults.volume = (4 / 3) * Math.PI * values.radius ** 3;
          newResults.surfaceArea = 4 * Math.PI * values.radius ** 2;
        }
        break;

      case 'cylinder':
        if (values.radius && values.height) {
          newResults.volume = Math.PI * values.radius ** 2 * values.height;
          newResults.surfaceArea = 2 * Math.PI * values.radius * (values.radius + values.height);
          newResults.lateralArea = 2 * Math.PI * values.radius * values.height;
        }
        break;
    }

    setResults(newResults);
  };

  // 更新输入值
  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // 复制结果
  const copyResult = async (value: number, label: string) => {
    try {
      await navigator.clipboard.writeText(value.toString());
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空
  const clearAll = () => {
    setInputs({});
    setResults({});
  };

  // 实时计算
  React.useEffect(() => {
    calculate();
  }, [inputs, shape]);

  // 切换形状时清空
  React.useEffect(() => {
    clearAll();
  }, [shape]);

  // 形状配置
  const shapeConfigs = {
    triangle: {
      name: '三角形',
      icon: Triangle,
      inputs: [
        { key: 'base', label: '底边', unit: 'cm' },
        { key: 'height', label: '高', unit: 'cm' },
        { key: 'a', label: '边长 a', unit: 'cm' },
        { key: 'b', label: '边长 b', unit: 'cm' },
        { key: 'c', label: '边长 c', unit: 'cm' },
      ],
      results: [
        { key: 'area', label: '面积 (底×高)', unit: 'cm²' },
        { key: 'areaHeron', label: '面积 (海伦公式)', unit: 'cm²' },
        { key: 'perimeter', label: '周长', unit: 'cm' },
      ]
    },
    rectangle: {
      name: '矩形',
      icon: Square,
      inputs: [
        { key: 'length', label: '长', unit: 'cm' },
        { key: 'width', label: '宽', unit: 'cm' },
      ],
      results: [
        { key: 'area', label: '面积', unit: 'cm²' },
        { key: 'perimeter', label: '周长', unit: 'cm' },
        { key: 'diagonal', label: '对角线', unit: 'cm' },
      ]
    },
    circle: {
      name: '圆形',
      icon: Circle,
      inputs: [
        { key: 'radius', label: '半径', unit: 'cm' },
      ],
      results: [
        { key: 'area', label: '面积', unit: 'cm²' },
        { key: 'circumference', label: '周长', unit: 'cm' },
        { key: 'diameter', label: '直径', unit: 'cm' },
      ]
    },
    sphere: {
      name: '球体',
      icon: Circle,
      inputs: [
        { key: 'radius', label: '半径', unit: 'cm' },
      ],
      results: [
        { key: 'volume', label: '体积', unit: 'cm³' },
        { key: 'surfaceArea', label: '表面积', unit: 'cm²' },
      ]
    },
    cylinder: {
      name: '圆柱体',
      icon: Circle,
      inputs: [
        { key: 'radius', label: '半径', unit: 'cm' },
        { key: 'height', label: '高', unit: 'cm' },
      ],
      results: [
        { key: 'volume', label: '体积', unit: 'cm³' },
        { key: 'surfaceArea', label: '表面积', unit: 'cm²' },
        { key: 'lateralArea', label: '侧面积', unit: 'cm²' },
      ]
    },
  };

  const currentConfig = shapeConfigs[shape];

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
          <Triangle className="h-8 w-8" />
          几何计算器
        </h1>
        <p className="text-muted-foreground mt-2">
          计算各种几何图形的面积、周长、体积等属性
        </p>
      </div>

      {/* 形状选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(shapeConfigs).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <Button
                key={key}
                variant={shape === key ? 'default' : 'outline'}
                onClick={() => setShape(key as any)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {config.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentConfig.icon className="h-5 w-5" />
              {currentConfig.name} - 参数输入
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentConfig.inputs.map((input) => (
              <div key={input.key}>
                <label className="block text-sm font-medium mb-2">
                  {input.label} ({input.unit})
                </label>
                <input
                  type="number"
                  value={inputs[input.key] || ''}
                  onChange={(e) => updateInput(input.key, e.target.value)}
                  placeholder={`输入${input.label}`}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}

            <Button onClick={clearAll} variant="outline" className="w-full">
              清空
            </Button>
          </CardContent>
        </Card>

        {/* 结果面板 */}
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            {currentConfig.results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                输入参数后将显示计算结果
              </div>
            ) : (
              <div className="space-y-4">
                {currentConfig.results.map((result) => {
                  const value = results[result.key];
                  const hasValue = value !== undefined && !isNaN(value);
                  
                  return (
                    <div key={result.key} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">{result.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {hasValue ? `${value.toFixed(4)} ${result.unit}` : '请输入完整参数'}
                        </div>
                      </div>
                      {hasValue && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyResult(value, result.label)}
                          className="flex items-center gap-2"
                        >
                          {copied === result.label ? (
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
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 公式说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>公式说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shape === 'triangle' && (
            <div>
              <h4 className="font-medium mb-2">三角形公式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>面积 (底×高)</strong>: S = (底边 × 高) ÷ 2</li>
                <li>• <strong>面积 (海伦公式)</strong>: S = √[s(s-a)(s-b)(s-c)]，其中 s = (a+b+c)÷2</li>
                <li>• <strong>周长</strong>: P = a + b + c</li>
              </ul>
            </div>
          )}
          
          {shape === 'rectangle' && (
            <div>
              <h4 className="font-medium mb-2">矩形公式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>面积</strong>: S = 长 × 宽</li>
                <li>• <strong>周长</strong>: P = 2 × (长 + 宽)</li>
                <li>• <strong>对角线</strong>: d = √(长² + 宽²)</li>
              </ul>
            </div>
          )}
          
          {shape === 'circle' && (
            <div>
              <h4 className="font-medium mb-2">圆形公式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>面积</strong>: S = π × r²</li>
                <li>• <strong>周长</strong>: C = 2 × π × r</li>
                <li>• <strong>直径</strong>: d = 2 × r</li>
              </ul>
            </div>
          )}
          
          {shape === 'sphere' && (
            <div>
              <h4 className="font-medium mb-2">球体公式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>体积</strong>: V = (4/3) × π × r³</li>
                <li>• <strong>表面积</strong>: S = 4 × π × r²</li>
              </ul>
            </div>
          )}
          
          {shape === 'cylinder' && (
            <div>
              <h4 className="font-medium mb-2">圆柱体公式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>体积</strong>: V = π × r² × h</li>
                <li>• <strong>表面积</strong>: S = 2π × r × (r + h)</li>
                <li>• <strong>侧面积</strong>: S侧 = 2π × r × h</li>
              </ul>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-2">使用说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 输入数值后自动计算结果</li>
              <li>• 支持小数点输入，精确到4位小数</li>
              <li>• 点击复制按钮可复制具体数值</li>
              <li>• 三角形支持两种面积计算方式</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
