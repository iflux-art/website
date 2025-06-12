'use client';

import React, { useState } from 'react';
import { Calculator, Delete, RotateCcw, ArrowLeft } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { ToolActions } from '@/components/features/tools/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/card';
import { Button } from '@/components/ui/input/button';
import { calculatorUtils } from '@/lib/tool-utils';
import Link from 'next/link';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  // const [error, setError] = useState(''); // Unused variable
  const [mode, setMode] = useState<'simple' | 'scientific'>('simple');

  const clearEntry = () => {
    setDisplay('0');
    // setError('');
  };

  const performOperation = (op: string) => {
    if (expression && !expression.endsWith(' ')) {
      setExpression(expression + ' ' + op + ' ');
    } else {
      setExpression(display + ' ' + op + ' ');
    }
    setDisplay('0');
    // setError('');
  };

  const performEquals = () => {
    const fullExpression = expression + display;
    const result = calculatorUtils.evaluate(fullExpression);

    if (result.success) {
      const calculation = `${fullExpression} = ${result.data}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      setDisplay(result.data!);
      setExpression('');
      // setError('');
    } else {
      // setError(result.error!);
      // 如果需要显示错误，可以在这里处理，例如 setDisplay(result.error!) 或其他方式
      setDisplay(result.error || 'Error'); // 临时处理，实际应有更好的错误显示
    }
  };

  const performFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'reciprocal':
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case 'sin':
        result = Math.sin((inputValue * Math.PI) / 180);
        break;
      case 'cos':
        result = Math.cos((inputValue * Math.PI) / 180);
        break;
      case 'tan':
        result = Math.tan((inputValue * Math.PI) / 180);
        break;
      case 'ln':
        result = inputValue > 0 ? Math.log(inputValue) : 0;
        break;
      case 'log':
        result = inputValue > 0 ? Math.log10(inputValue) : 0;
        break;
      case 'factorial':
        result = factorial(Math.floor(inputValue));
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    const calculation = `${func}(${inputValue}) = ${result}`;
    setHistory(prev => [calculation, ...prev.slice(0, 9)]);
    // setError('');
  };

  const factorial = (n: number): number => {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
    // setError('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const inputNumber = (num: string) => {
    if (display === '0' && num !== '.') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    // setError('');
  };

  const inputOperator = (op: string) => {
    if (expression && !expression.endsWith(' ')) {
      setExpression(expression + ' ' + op + ' ');
    } else {
      setExpression(display + ' ' + op + ' ');
    }
    setDisplay('0');
    // setError('');
  };

  const calculate = () => {
    const fullExpression = expression + display;
    const result = calculatorUtils.evaluate(fullExpression);

    if (result.success) {
      const calculation = `${fullExpression} = ${result.data}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
      setDisplay(result.data!);
      setExpression('');
      // setError('');
    } else {
      // setError(result.error!);
      setDisplay(result.error || 'Error'); // 临时处理
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    // setError('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
    // setError('');
  };

  const inputDecimal = () => {
    if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
    // setError('');
  };

  const actions = [
    {
      label: '简单模式',
      onClick: () => setMode('simple'),
      variant: 'default' as const,
      active: mode === 'simple',
    },
    {
      label: '科学模式',
      onClick: () => setMode('scientific'),
      variant: 'outline' as const,
      active: mode === 'scientific',
    },
    {
      label: '清空历史',
      onClick: clearHistory,
      icon: RotateCcw,
      variant: 'outline' as const,
      disabled: history.length === 0,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>简单模式</strong>：基本的四则运算
          </li>
          <li>
            • <strong>科学模式</strong>：包含三角函数、对数等高级功能
          </li>
          <li>
            • <strong>历史记录</strong>：保存最近的计算结果
          </li>
          <li>
            • <strong>表达式计算</strong>：支持复杂的数学表达式
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">快捷键</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> 计算结果
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd> 清空
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Backspace</kbd> 删除
          </li>
        </ul>
      </div>
    </div>
  );

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
            <h1 className="text-3xl font-bold tracking-tight">计算器</h1>
            <p className="text-muted-foreground">
              多功能计算器，支持基础运算、科学计算、单位换算、历史记录
            </p>
          </div>
        </div>
      </div>
      <ToolLayout
        title="计算器"
        description="多功能计算器，支持基本运算和科学计算"
        icon={Calculator}
        actions={<ToolActions actions={actions} />}
        helpContent={helpContent}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 计算器主体 */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* 显示屏 */}
                <div className="mb-4">
                  <div className="w-full p-4 text-right text-3xl font-mono bg-muted/50 rounded-lg border min-h-[4rem] flex items-center justify-end">
                    {display}
                  </div>
                </div>

                {/* 按钮区域 */}
                {mode === 'simple' ? (
                  // 简单计算器布局
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" onClick={clear} className="col-span-1">
                      C
                    </Button>
                    <Button variant="outline" onClick={clearEntry} className="col-span-1">
                      CE
                    </Button>
                    <Button variant="outline" onClick={backspace} className="col-span-1">
                      <Delete className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performOperation('÷')}
                      className="col-span-1"
                    >
                      ÷
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber('7')}
                      className="col-span-1"
                    >
                      7
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('8')}
                      className="col-span-1"
                    >
                      8
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('9')}
                      className="col-span-1"
                    >
                      9
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('×')}
                      className="col-span-1"
                    >
                      ×
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber('4')}
                      className="col-span-1"
                    >
                      4
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('5')}
                      className="col-span-1"
                    >
                      5
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('6')}
                      className="col-span-1"
                    >
                      6
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('-')}
                      className="col-span-1"
                    >
                      -
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber('1')}
                      className="col-span-1"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('2')}
                      className="col-span-1"
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('3')}
                      className="col-span-1"
                    >
                      3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('+')}
                      className="col-span-1 row-span-2"
                    >
                      +
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber('0')}
                      className="col-span-2"
                    >
                      0
                    </Button>
                    <Button variant="outline" onClick={inputDecimal} className="col-span-1">
                      .
                    </Button>

                    <Button variant="default" onClick={performEquals} className="col-span-4">
                      =
                    </Button>
                  </div>
                ) : (
                  // 科学计算器布局
                  <div className="grid grid-cols-6 gap-2">
                    {/* 第一行 */}
                    <Button variant="outline" onClick={clear} className="col-span-1">
                      C
                    </Button>
                    <Button variant="outline" onClick={clearEntry} className="col-span-1">
                      CE
                    </Button>
                    <Button variant="outline" onClick={backspace} className="col-span-1">
                      <Delete className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('/')}
                      className="col-span-1"
                    >
                      ÷
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('sqrt')}
                      className="col-span-1"
                    >
                      √
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('square')}
                      className="col-span-1"
                    >
                      x²
                    </Button>

                    {/* 第二行 */}
                    <Button
                      variant="outline"
                      onClick={() => performFunction('sin')}
                      className="col-span-1"
                    >
                      sin
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('cos')}
                      className="col-span-1"
                    >
                      cos
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('tan')}
                      className="col-span-1"
                    >
                      tan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('*')}
                      className="col-span-1"
                    >
                      ×
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('ln')}
                      className="col-span-1"
                    >
                      ln
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('log')}
                      className="col-span-1"
                    >
                      log
                    </Button>

                    {/* 第三行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('7')}
                      className="col-span-1"
                    >
                      7
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('8')}
                      className="col-span-1"
                    >
                      8
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('9')}
                      className="col-span-1"
                    >
                      9
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('-')}
                      className="col-span-1"
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('pi')}
                      className="col-span-1"
                    >
                      π
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('e')}
                      className="col-span-1"
                    >
                      e
                    </Button>

                    {/* 第四行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('4')}
                      className="col-span-1"
                    >
                      4
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('5')}
                      className="col-span-1"
                    >
                      5
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('6')}
                      className="col-span-1"
                    >
                      6
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('+')}
                      className="col-span-1"
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performOperation('^')}
                      className="col-span-1"
                    >
                      x^y
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('factorial')}
                      className="col-span-1"
                    >
                      n!
                    </Button>

                    {/* 第五行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('1')}
                      className="col-span-1"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('2')}
                      className="col-span-1"
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('3')}
                      className="col-span-1"
                    >
                      3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator('%')}
                      className="col-span-1"
                    >
                      %
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction('reciprocal')}
                      className="col-span-1"
                    >
                      1/x
                    </Button>
                    <Button variant="default" onClick={calculate} className="col-span-1 row-span-2">
                      =
                    </Button>

                    {/* 第六行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('0')}
                      className="col-span-2"
                    >
                      0
                    </Button>
                    <Button variant="outline" onClick={inputDecimal} className="col-span-1">
                      .
                    </Button>
                    <Button variant="outline" onClick={toggleSign} className="col-span-1">
                      ±
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber('00')}
                      className="col-span-1"
                    >
                      00
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 历史记录 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  历史记录
                  {history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">暂无计算记录</p>
                  ) : (
                    history.map((entry, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted"
                        onClick={() => setDisplay(entry.split(' = ')[1])}
                      >
                        {entry}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ToolLayout>
    </div>
  );
}
