'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, BarChart, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState('');
  const [barcodeType, setBarcodeType] = useState<'code128' | 'code39' | 'ean13' | 'upc'>('code128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Code 128 编码表（简化版）
  const code128Patterns: { [key: string]: string } = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
    'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001000',
    'G': '10011101000', 'H': '10011100100', 'I': '11001110010', 'J': '11001011100',
    'K': '11001001110', 'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
    'O': '11101001100', 'P': '11100101100', 'Q': '11100100110', 'R': '11101100100',
    'S': '11100110100', 'T': '11100110010', 'U': '11011011000', 'V': '11011000110',
    'W': '11000110110', 'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110',
    ' ': '10110001000', '-': '10001101000', '.': '10001100010', '$': '10110111000',
    '/': '10110001110', '+': '11010001110', '%': '11000101000', 'START': '11010000100',
    'STOP': '1100011101011'
  };

  // Code 39 编码表
  const code39Patterns: { [key: string]: string } = {
    '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
    '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
    '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
    'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
    'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
    'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
    'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
    'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
    'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
    ' ': '100101011011', '-': '100101101101', '.': '110010101101', '$': '100100100101',
    '/': '100100101001', '+': '100101001001', '%': '101001001001', '*': '100101101101'
  };

  // 生成条形码
  const generateBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pattern = '';
    let processedText = text.toUpperCase();

    // 根据类型生成模式
    switch (barcodeType) {
      case 'code128':
        pattern = 'START';
        for (let char of processedText) {
          if (code128Patterns[char]) {
            pattern += code128Patterns[char];
          }
        }
        pattern += 'STOP';
        break;

      case 'code39':
        pattern = '*'; // Code 39 开始符
        for (let char of processedText) {
          if (code39Patterns[char]) {
            pattern += code39Patterns[char] + '0'; // 间隔
          }
        }
        pattern += '*'; // Code 39 结束符
        break;

      case 'ean13':
        // 简化的 EAN-13 实现
        if (processedText.length === 13 && /^\d+$/.test(processedText)) {
          pattern = generateEAN13Pattern(processedText);
        } else {
          pattern = ''; // 无效输入
        }
        break;

      case 'upc':
        // 简化的 UPC 实现
        if (processedText.length === 12 && /^\d+$/.test(processedText)) {
          pattern = generateUPCPattern(processedText);
        } else {
          pattern = ''; // 无效输入
        }
        break;
    }

    if (!pattern) {
      // 显示错误信息
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px Arial';
      ctx.fillText('无效的输入格式', 10, 50);
      return;
    }

    // 转换模式为二进制字符串
    let binaryPattern = '';
    for (let char of pattern) {
      if (char === 'START') {
        binaryPattern += code128Patterns['START'];
      } else if (char === 'STOP') {
        binaryPattern += code128Patterns['STOP'];
      } else if (char === '*') {
        binaryPattern += code39Patterns['*'];
      } else {
        binaryPattern += char;
      }
    }

    // 计算画布尺寸
    const barWidth = width;
    const canvasWidth = binaryPattern.length * barWidth;
    const canvasHeight = height + (showText ? 30 : 10);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 清空画布
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制条形码
    ctx.fillStyle = '#000000';
    for (let i = 0; i < binaryPattern.length; i++) {
      if (binaryPattern[i] === '1') {
        ctx.fillRect(i * barWidth, 5, barWidth, height);
      }
    }

    // 绘制文本
    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, canvasWidth / 2, height + 25);
    }
  };

  // 简化的 EAN-13 模式生成
  const generateEAN13Pattern = (code: string): string => {
    // 这是一个简化实现，实际 EAN-13 需要更复杂的编码
    return '101' + code.split('').map(d => '0'.repeat(parseInt(d) + 1) + '1').join('') + '101';
  };

  // 简化的 UPC 模式生成
  const generateUPCPattern = (code: string): string => {
    // 这是一个简化实现，实际 UPC 需要更复杂的编码
    return '101' + code.split('').map(d => '0'.repeat(parseInt(d) + 1) + '1').join('') + '101';
  };

  // 下载条形码
  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `barcode-${text}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // 清空
  const clearAll = () => {
    setText('');
  };

  // 加载示例
  const loadExample = () => {
    switch (barcodeType) {
      case 'code128':
      case 'code39':
        setText('HELLO123');
        break;
      case 'ean13':
        setText('1234567890123');
        break;
      case 'upc':
        setText('123456789012');
        break;
    }
  };

  // 实时生成
  useEffect(() => {
    generateBarcode();
  }, [text, barcodeType, width, height, showText]);

  const barcodeTypes = [
    { value: 'code128', name: 'Code 128', desc: '支持数字、字母和符号' },
    { value: 'code39', name: 'Code 39', desc: '支持数字、大写字母和部分符号' },
    { value: 'ean13', name: 'EAN-13', desc: '13位数字，用于商品标识' },
    { value: 'upc', name: 'UPC-A', desc: '12位数字，北美商品码' },
  ];

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
          <BarChart className="h-8 w-8" />
          条形码生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成多种格式的条形码，支持自定义样式和下载
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>条形码设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 条形码类型 */}
              <div>
                <label className="block text-sm font-medium mb-2">条形码类型</label>
                <select
                  value={barcodeType}
                  onChange={(e) => setBarcodeType(e.target.value as any)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  {barcodeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {barcodeTypes.find(t => t.value === barcodeType)?.desc}
                </p>
              </div>

              {/* 内容输入 */}
              <div>
                <label className="block text-sm font-medium mb-2">内容</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    barcodeType === 'ean13' ? '输入13位数字' :
                    barcodeType === 'upc' ? '输入12位数字' :
                    '输入要编码的内容'
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 样式设置 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    条宽: {width}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    高度: {height}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showText}
                      onChange={(e) => setShowText(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">显示文本</span>
                  </label>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                <Button onClick={generateBarcode} className="w-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  重新生成
                </Button>
                <Button onClick={loadExample} variant="outline" className="w-full">
                  加载示例
                </Button>
                <Button onClick={clearAll} variant="outline" className="w-full">
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 预览和下载 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                条形码预览
                {text && (
                  <Button
                    onClick={downloadBarcode}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    下载 PNG
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {/* 条形码画布 */}
                <div className="border border-border rounded-lg p-4 bg-white overflow-auto max-w-full">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* 提示信息 */}
                {!text && (
                  <div className="text-center text-muted-foreground">
                    请输入内容生成条形码
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 格式说明 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>格式说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Code 128</h4>
                <p className="text-sm text-muted-foreground">
                  支持完整的 ASCII 字符集，包括数字、大小写字母和特殊符号。广泛用于物流和库存管理。
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Code 39</h4>
                <p className="text-sm text-muted-foreground">
                  支持数字 0-9、大写字母 A-Z 和部分特殊符号（- . $ / + % *）。常用于工业应用。
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">EAN-13</h4>
                <p className="text-sm text-muted-foreground">
                  13位数字的国际商品条码，广泛用于零售商品。前12位是商品代码，最后1位是校验码。
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">UPC-A</h4>
                <p className="text-sm text-muted-foreground">
                  12位数字的北美通用商品条码。前11位是商品代码，最后1位是校验码。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
