'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Ruler, RotateCcw, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { ToolActions } from '@/components/ui/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { unitUtils } from '@/lib/tool-utils';

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // 单位转换配置
  const unitCategories = {
    length: {
      name: '长度',
      units: {
        mm: { name: '毫米', factor: 0.001 },
        cm: { name: '厘米', factor: 0.01 },
        m: { name: '米', factor: 1 },
        km: { name: '千米', factor: 1000 },
        inch: { name: '英寸', factor: 0.0254 },
        ft: { name: '英尺', factor: 0.3048 },
        yard: { name: '码', factor: 0.9144 },
        mile: { name: '英里', factor: 1609.344 },
      },
    },
    weight: {
      name: '重量',
      units: {
        mg: { name: '毫克', factor: 0.000001 },
        g: { name: '克', factor: 0.001 },
        kg: { name: '千克', factor: 1 },
        ton: { name: '吨', factor: 1000 },
        oz: { name: '盎司', factor: 0.0283495 },
        lb: { name: '磅', factor: 0.453592 },
        stone: { name: '英石', factor: 6.35029 },
      },
    },
    temperature: {
      name: '温度',
      units: {
        celsius: { name: '摄氏度 (°C)', factor: 1 },
        fahrenheit: { name: '华氏度 (°F)', factor: 1 },
        kelvin: { name: '开尔文 (K)', factor: 1 },
      },
    },
    area: {
      name: '面积',
      units: {
        mm2: { name: '平方毫米', factor: 0.000001 },
        cm2: { name: '平方厘米', factor: 0.0001 },
        m2: { name: '平方米', factor: 1 },
        km2: { name: '平方千米', factor: 1000000 },
        inch2: { name: '平方英寸', factor: 0.00064516 },
        ft2: { name: '平方英尺', factor: 0.092903 },
        acre: { name: '英亩', factor: 4046.86 },
      },
    },
    volume: {
      name: '体积',
      units: {
        ml: { name: '毫升', factor: 0.001 },
        l: { name: '升', factor: 1 },
        m3: { name: '立方米', factor: 1000 },
        inch3: { name: '立方英寸', factor: 0.0163871 },
        ft3: { name: '立方英尺', factor: 28.3168 },
        gallon: { name: '加仑', factor: 3.78541 },
        cup: { name: '杯', factor: 0.236588 },
      },
    },
    speed: {
      name: '速度',
      units: {
        mps: { name: '米/秒', factor: 1 },
        kmh: { name: '千米/小时', factor: 0.277778 },
        mph: { name: '英里/小时', factor: 0.44704 },
        knot: { name: '节', factor: 0.514444 },
        fps: { name: '英尺/秒', factor: 0.3048 },
      },
    },
    number: {
      name: '进制',
      units: {
        binary: { name: '二进制', base: 2 },
        octal: { name: '八进制', base: 8 },
        decimal: { name: '十进制', base: 10 },
        hexadecimal: { name: '十六进制', base: 16 },
      },
    },
  };

  // 温度转换特殊处理
  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;

    // 先转换为摄氏度
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = ((value - 32) * 5) / 9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }

    // 再转换为目标单位
    if (to === 'fahrenheit') {
      return (celsius * 9) / 5 + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    return celsius;
  };

  // 进制转换
  const convertNumber = (value: string, from: string, to: string): string => {
    if (from === to) return value;

    const units = unitCategories.number.units;
    const fromBase = units[from as keyof typeof units]?.base || 10;
    const toBase = units[to as keyof typeof units]?.base || 10;

    try {
      // 先转换为十进制
      const decimalValue = parseInt(value, fromBase);
      if (isNaN(decimalValue)) return '';

      // 再转换为目标进制
      return decimalValue.toString(toBase).toUpperCase();
    } catch {
      return '';
    }
  };

  // 通用单位转换
  const convertUnit = (value: number, from: string, to: string): number => {
    if (category === 'temperature') {
      return convertTemperature(value, from, to);
    }

    const units = unitCategories[category as keyof typeof unitCategories].units;
    const fromFactor = units[from as keyof typeof units]?.factor || 1;
    const toFactor = units[to as keyof typeof units]?.factor || 1;

    // 转换为基准单位，再转换为目标单位
    const baseValue = value * fromFactor;
    return baseValue / toFactor;
  };

  // 处理输入变化
  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    if (value && fromUnit && toUnit) {
      if (category === 'number') {
        const converted = convertNumber(value, fromUnit, toUnit);
        setToValue(converted);
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const converted = convertUnit(numValue, fromUnit, toUnit);
          setToValue(converted.toFixed(6).replace(/\.?0+$/, ''));
        } else {
          setToValue('');
        }
      }
    } else {
      setToValue('');
    }
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    if (value && fromUnit && toUnit) {
      if (category === 'number') {
        const converted = convertNumber(value, toUnit, fromUnit);
        setFromValue(converted);
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const converted = convertUnit(numValue, toUnit, fromUnit);
          setFromValue(converted.toFixed(6).replace(/\.?0+$/, ''));
        } else {
          setFromValue('');
        }
      }
    } else {
      setFromValue('');
    }
  };

  // 交换单位
  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  // 清空
  const clearAll = () => {
    setFromValue('');
    setToValue('');
  };

  // 初始化默认单位
  useEffect(() => {
    const units = Object.keys(unitCategories[category as keyof typeof unitCategories].units);
    setFromUnit(units[0] || '');
    setToUnit(units[1] || units[0] || '');
    setFromValue('');
    setToValue('');
  }, [category]);

  const currentUnits = unitCategories[category as keyof typeof unitCategories].units;

  const actions = [
    {
      label: '交换单位',
      onClick: swapUnits,
      icon: ArrowUpDown,
      variant: 'outline' as const,
    },
    {
      label: '清空',
      onClick: clearAll,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">支持的转换类型</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>长度</strong>：毫米、厘米、米、千米、英寸、英尺、码、英里
          </li>
          <li>
            • <strong>重量</strong>：毫克、克、千克、吨、盎司、磅、英石
          </li>
          <li>
            • <strong>温度</strong>：摄氏度、华氏度、开尔文
          </li>
          <li>
            • <strong>面积</strong>：平方毫米、平方厘米、平方米、平方千米、英亩
          </li>
          <li>
            • <strong>体积</strong>：毫升、升、立方米、立方英寸、立方英尺、加仑
          </li>
          <li>
            • <strong>速度</strong>：米/秒、千米/小时、英里/小时、节
          </li>
          <li>
            • <strong>进制</strong>：二进制、八进制、十进制、十六进制
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">使用说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 选择转换类型，然后选择源单位和目标单位</li>
          <li>• 在任一输入框中输入数值，另一个会自动计算</li>
          <li>• 点击交换按钮可以快速交换源单位和目标单位</li>
          <li>• 支持双向转换，可以在任意输入框中输入</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="单位转换器"
      description="长度、重量、温度、面积、体积、速度等单位转换"
      icon={Ruler}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      {/* 分类选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(unitCategories).map(([key, cat]) => (
            <Button
              key={key}
              variant={category === key ? 'default' : 'outline'}
              onClick={() => setCategory(key)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 转换器主体 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{unitCategories[category as keyof typeof unitCategories].name}转换</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 源单位 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">从</label>
                <select
                  value={fromUnit}
                  onChange={e => setFromUnit(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type={category === 'number' ? 'text' : 'number'}
                  value={fromValue}
                  onChange={e => handleFromValueChange(e.target.value)}
                  placeholder={category === 'number' ? '输入数值（如：FF, 255, 377）' : '输入数值'}
                  className="w-full p-3 border border-border rounded-lg bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* 交换按钮 */}
            <div className="flex items-center justify-center md:flex-col">
              <Button
                onClick={swapUnits}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                交换
              </Button>
            </div>

            {/* 目标单位 */}
            <div className="space-y-4 md:order-3">
              <div>
                <label className="block text-sm font-medium mb-2">到</label>
                <select
                  value={toUnit}
                  onChange={e => setToUnit(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type={category === 'number' ? 'text' : 'number'}
                  value={toValue}
                  onChange={e => handleToValueChange(e.target.value)}
                  placeholder="转换结果"
                  className="w-full p-3 border border-border rounded-lg bg-muted/50 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex justify-center">
            <Button onClick={clearAll} variant="outline">
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 常用转换表 */}
      <Card>
        <CardHeader>
          <CardTitle>常用转换参考</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {category === 'length' && (
              <>
                <div className="p-3 bg-muted/50 rounded">1 米 = 100 厘米</div>
                <div className="p-3 bg-muted/50 rounded">1 千米 = 1000 米</div>
                <div className="p-3 bg-muted/50 rounded">1 英寸 = 2.54 厘米</div>
                <div className="p-3 bg-muted/50 rounded">1 英尺 = 30.48 厘米</div>
                <div className="p-3 bg-muted/50 rounded">1 码 = 0.9144 米</div>
                <div className="p-3 bg-muted/50 rounded">1 英里 = 1.609 千米</div>
              </>
            )}
            {category === 'weight' && (
              <>
                <div className="p-3 bg-muted/50 rounded">1 千克 = 1000 克</div>
                <div className="p-3 bg-muted/50 rounded">1 吨 = 1000 千克</div>
                <div className="p-3 bg-muted/50 rounded">1 磅 = 0.454 千克</div>
                <div className="p-3 bg-muted/50 rounded">1 盎司 = 28.35 克</div>
                <div className="p-3 bg-muted/50 rounded">1 英石 = 6.35 千克</div>
              </>
            )}
            {category === 'temperature' && (
              <>
                <div className="p-3 bg-muted/50 rounded">0°C = 32°F = 273.15K</div>
                <div className="p-3 bg-muted/50 rounded">100°C = 212°F = 373.15K</div>
                <div className="p-3 bg-muted/50 rounded">37°C = 98.6°F (体温)</div>
                <div className="p-3 bg-muted/50 rounded">-40°C = -40°F</div>
              </>
            )}
            {category === 'number' && (
              <>
                <div className="p-3 bg-muted/50 rounded">255 = FF = 377 = 11111111</div>
                <div className="p-3 bg-muted/50 rounded">16 = 10 = 20 = 10000</div>
                <div className="p-3 bg-muted/50 rounded">8 = 8 = 10 = 1000</div>
                <div className="p-3 bg-muted/50 rounded">1 = 1 = 1 = 1</div>
                <div className="p-3 bg-muted/50 rounded">0 = 0 = 0 = 0</div>
                <div className="p-3 bg-muted/50 rounded">十进制 = 十六进制 = 八进制 = 二进制</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
