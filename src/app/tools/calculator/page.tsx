'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calculator, Delete, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // 添加到历史记录
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // 保留最近10条记录
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const performEquals = () => {
    if (operation && previousValue !== null) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
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
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
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
    setWaitingForOperand(true);
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
  };

  const clearHistory = () => {
    setHistory([]);
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
          <Calculator className="h-8 w-8" />
          科学计算器
        </h1>
        <p className="text-muted-foreground mt-2">
          支持基础运算和科学计算功能
        </p>
      </div>

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
              <div className="grid grid-cols-6 gap-2">
                {/* 第一行：清除和功能键 */}
                <Button variant="outline" onClick={clear} className="col-span-1">C</Button>
                <Button variant="outline" onClick={clearEntry} className="col-span-1">CE</Button>
                <Button variant="outline" onClick={backspace} className="col-span-1">
                  <Delete className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => performOperation('÷')} className="col-span-1">÷</Button>
                <Button variant="outline" onClick={() => performFunction('sqrt')} className="col-span-1">√</Button>
                <Button variant="outline" onClick={() => performFunction('square')} className="col-span-1">x²</Button>

                {/* 第二行 */}
                <Button variant="outline" onClick={() => performFunction('sin')} className="col-span-1">sin</Button>
                <Button variant="outline" onClick={() => performFunction('cos')} className="col-span-1">cos</Button>
                <Button variant="outline" onClick={() => performFunction('tan')} className="col-span-1">tan</Button>
                <Button variant="outline" onClick={() => performOperation('×')} className="col-span-1">×</Button>
                <Button variant="outline" onClick={() => performFunction('ln')} className="col-span-1">ln</Button>
                <Button variant="outline" onClick={() => performFunction('log')} className="col-span-1">log</Button>

                {/* 第三行 */}
                <Button variant="outline" onClick={() => inputNumber('7')} className="col-span-1">7</Button>
                <Button variant="outline" onClick={() => inputNumber('8')} className="col-span-1">8</Button>
                <Button variant="outline" onClick={() => inputNumber('9')} className="col-span-1">9</Button>
                <Button variant="outline" onClick={() => performOperation('-')} className="col-span-1">-</Button>
                <Button variant="outline" onClick={() => performFunction('pi')} className="col-span-1">π</Button>
                <Button variant="outline" onClick={() => performFunction('e')} className="col-span-1">e</Button>

                {/* 第四行 */}
                <Button variant="outline" onClick={() => inputNumber('4')} className="col-span-1">4</Button>
                <Button variant="outline" onClick={() => inputNumber('5')} className="col-span-1">5</Button>
                <Button variant="outline" onClick={() => inputNumber('6')} className="col-span-1">6</Button>
                <Button variant="outline" onClick={() => performOperation('+')} className="col-span-1">+</Button>
                <Button variant="outline" onClick={() => performOperation('^')} className="col-span-1">x^y</Button>
                <Button variant="outline" onClick={() => performFunction('factorial')} className="col-span-1">n!</Button>

                {/* 第五行 */}
                <Button variant="outline" onClick={() => inputNumber('1')} className="col-span-1">1</Button>
                <Button variant="outline" onClick={() => inputNumber('2')} className="col-span-1">2</Button>
                <Button variant="outline" onClick={() => inputNumber('3')} className="col-span-1">3</Button>
                <Button variant="outline" onClick={() => performOperation('%')} className="col-span-1">%</Button>
                <Button variant="outline" onClick={() => performFunction('reciprocal')} className="col-span-1">1/x</Button>
                <Button variant="default" onClick={performEquals} className="col-span-1 row-span-2">=</Button>

                {/* 第六行 */}
                <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">0</Button>
                <Button variant="outline" onClick={inputDecimal} className="col-span-1">.</Button>
                <Button variant="outline" onClick={toggleSign} className="col-span-1">±</Button>
                <Button variant="outline" onClick={() => inputNumber('00')} className="col-span-1">00</Button>
              </div>
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
                  <p className="text-sm text-muted-foreground text-center py-4">
                    暂无计算记录
                  </p>
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

          {/* 功能说明 */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>功能说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-2">
                <div><strong>基础运算</strong></div>
                <div>+, -, ×, ÷, %, ^</div>
                
                <div><strong>科学函数</strong></div>
                <div>sin, cos, tan (角度制)</div>
                <div>ln (自然对数)</div>
                <div>log (常用对数)</div>
                <div>√ (平方根)</div>
                <div>x² (平方)</div>
                <div>1/x (倒数)</div>
                <div>n! (阶乘)</div>
                
                <div><strong>常数</strong></div>
                <div>π (圆周率)</div>
                <div>e (自然常数)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
