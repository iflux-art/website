"use client";

import React, { useState } from "react";
import { Calculator, Delete, RotateCcw, ArrowLeft } from "lucide-react";
import { ToolLayout } from "packages/ui/components/tools/tool-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "packages/ui/components/ui/card";
import { Button } from "packages/ui/components/ui/button";
import { useSafeTool } from "packages/hooks/tools/tool-state";
import Link from "next/link";

// ===== 迁移自 src/lib/tools/tool-utils.ts =====
/**
 * 计算器表达式求值工具
 * 支持基础四则运算和括号
 */
const evaluateExpression = (
  expression: string,
): {
  success: boolean;
  data?: string;
  error?: string;
} => {
  try {
    // 仅允许数字、运算符和括号，防止注入
    if (!/^[\d+\-*/().\s]+$/.test(expression)) {
      return { success: false, error: "表达式包含非法字符" };
    }
    // eslint-disable-next-line no-eval
    const result = Function(
      `"use strict";return (${expression.replace(/÷/g, "/").replace(/×/g, "*")})`,
    )();
    if (typeof result === "number" && isFinite(result)) {
      return { success: true, data: String(result) };
    }
    return { success: false, error: "表达式无效" };
  } catch (e: any) {
    return { success: false, error: e?.message || "计算错误" };
  }
};

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState<"simple" | "scientific">("simple");

  // 使用安全状态管理历史记录
  const {
    history,
    addToHistory,
    clearHistory: clearCalculatorHistory,
  } = useSafeTool();

  const clearEntry = () => {
    setDisplay("0");
    // setError('');
  };

  const performOperation = (op: string) => {
    if (expression && !expression.endsWith(" ")) {
      setExpression(expression + " " + op + " ");
    } else {
      setExpression(display + " " + op + " ");
    }
    setDisplay("0");
    // setError('');
  };

  const performEquals = () => {
    const fullExpression = expression + display;
    const result = evaluateExpression(fullExpression);

    if (result.success) {
      addToHistory({
        input: fullExpression,
        output: result.data!,
        tool: "calculator",
      });
      setDisplay(result.data!);
      setExpression("");
    } else {
      setDisplay(result.error || "Error");
    }
  };

  const performFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "square":
        result = inputValue * inputValue;
        break;
      case "reciprocal":
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case "sin":
        result = Math.sin((inputValue * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((inputValue * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((inputValue * Math.PI) / 180);
        break;
      case "ln":
        result = inputValue > 0 ? Math.log(inputValue) : 0;
        break;
      case "log":
        result = inputValue > 0 ? Math.log10(inputValue) : 0;
        break;
      case "factorial":
        result = factorial(Math.floor(inputValue));
        break;
      case "pi":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    addToHistory({
      input: `${func}(${inputValue})`,
      output: String(result),
      tool: "calculator",
    });
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
    if (display !== "0") {
      setDisplay(display.charAt(0) === "-" ? display.slice(1) : "-" + display);
    }
    // setError('');
  };

  const inputNumber = (num: string) => {
    if (display === "0" && num !== ".") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    // setError('');
  };

  const inputOperator = (op: string) => {
    if (expression && !expression.endsWith(" ")) {
      setExpression(expression + " " + op + " ");
    } else {
      setExpression(display + " " + op + " ");
    }
    setDisplay("0");
    // setError('');
  };

  const calculate = () => {
    const fullExpression = expression + display;
    const result = evaluateExpression(fullExpression);

    if (result.success) {
      addToHistory({
        input: fullExpression,
        output: result.data!,
        tool: "calculator",
      });
      setDisplay(result.data!);
      setExpression("");
    } else {
      // setError(result.error!);
      setDisplay(result.error || "Error"); // 临时处理
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    // setError('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
    // setError('');
  };

  const inputDecimal = () => {
    if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
    // setError('');
  };

  const actions = [
    {
      label: "简单模式",
      onClick: () => setMode("simple"),
      variant: "default" as const,
      active: mode === "simple",
    },
    {
      label: "科学模式",
      onClick: () => setMode("scientific"),
      variant: "outline" as const,
      active: mode === "scientific",
    },
    {
      label: "清空历史",
      onClick: clearCalculatorHistory,
      icon: RotateCcw,
      variant: "outline" as const,
      disabled: history.length === 0,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          功能介绍
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground dark:text-slate-400">
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
        <h4 className="mb-2 font-medium">快捷键</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            • <kbd className="rounded bg-muted px-2 py-1 text-xs">Enter</kbd>{" "}
            计算结果
          </li>
          <li>
            • <kbd className="rounded bg-muted px-2 py-1 text-xs">Escape</kbd>{" "}
            清空
          </li>
          <li>
            •{" "}
            <kbd className="rounded bg-muted px-2 py-1 text-xs">Backspace</kbd>{" "}
            删除
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
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
        actions={
          <div className="flex gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant={action.variant}
                disabled={action.disabled}
                className="flex items-center gap-1"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        }
        helpContent={helpContent}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* 计算器主体 */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* 显示屏 */}
                <div className="mb-4">
                  <div className="mb-4 h-24 w-full rounded-lg border bg-background p-4 text-right font-mono text-2xl dark:bg-slate-900 dark:text-slate-50">
                    {display}
                  </div>
                </div>

                {/* 按钮区域 */}
                {mode === "simple" ? (
                  // 简单计算器布局
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      onClick={clear}
                      className="col-span-1 h-16 w-full rounded-lg bg-destructive/10 text-lg font-medium hover:bg-destructive/20 dark:bg-red-900/30 dark:text-slate-100 dark:hover:bg-red-900/50"
                    >
                      C
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearEntry}
                      className="col-span-1"
                    >
                      CE
                    </Button>
                    <Button
                      variant="outline"
                      onClick={backspace}
                      className="col-span-1"
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performOperation("÷")}
                      className="col-span-1"
                    >
                      ÷
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber("7")}
                      className="col-span-1 h-16 w-full rounded-lg bg-background text-lg font-medium hover:bg-accent dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      7
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("8")}
                      className="col-span-1"
                    >
                      8
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("9")}
                      className="col-span-1"
                    >
                      9
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("×")}
                      className="col-span-1 h-16 w-full rounded-lg bg-primary/10 text-lg font-medium hover:bg-primary/20 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                    >
                      ×
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber("4")}
                      className="col-span-1"
                    >
                      4
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("5")}
                      className="col-span-1"
                    >
                      5
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("6")}
                      className="col-span-1"
                    >
                      6
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("-")}
                      className="col-span-1"
                    >
                      -
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber("1")}
                      className="col-span-1"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("2")}
                      className="col-span-1"
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("3")}
                      className="col-span-1"
                    >
                      3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("+")}
                      className="col-span-1 row-span-2"
                    >
                      +
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => inputNumber("0")}
                      className="col-span-2"
                    >
                      0
                    </Button>
                    <Button
                      variant="outline"
                      onClick={inputDecimal}
                      className="col-span-1"
                    >
                      .
                    </Button>

                    <Button
                      variant="default"
                      onClick={performEquals}
                      className="col-span-4 h-16 w-full rounded-lg bg-primary text-lg font-medium text-primary-foreground hover:bg-primary/90 dark:bg-slate-600 dark:hover:bg-slate-500"
                    >
                      =
                    </Button>
                  </div>
                ) : (
                  // 科学计算器布局
                  <div className="grid grid-cols-6 gap-2">
                    {/* 第一行 */}
                    <Button
                      variant="outline"
                      onClick={clear}
                      className="col-span-1"
                    >
                      C
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearEntry}
                      className="col-span-1"
                    >
                      CE
                    </Button>
                    <Button
                      variant="outline"
                      onClick={backspace}
                      className="col-span-1"
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("/")}
                      className="col-span-1"
                    >
                      ÷
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("sqrt")}
                      className="col-span-1"
                    >
                      √
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("square")}
                      className="col-span-1"
                    >
                      x²
                    </Button>

                    {/* 第二行 */}
                    <Button
                      variant="outline"
                      onClick={() => performFunction("sin")}
                      className="col-span-1"
                    >
                      sin
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("cos")}
                      className="col-span-1"
                    >
                      cos
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("tan")}
                      className="col-span-1"
                    >
                      tan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("*")}
                      className="col-span-1"
                    >
                      ×
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("ln")}
                      className="col-span-1"
                    >
                      ln
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("log")}
                      className="col-span-1"
                    >
                      log
                    </Button>

                    {/* 第三行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("7")}
                      className="col-span-1"
                    >
                      7
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("8")}
                      className="col-span-1"
                    >
                      8
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("9")}
                      className="col-span-1"
                    >
                      9
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("-")}
                      className="col-span-1"
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("pi")}
                      className="col-span-1"
                    >
                      π
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("e")}
                      className="col-span-1"
                    >
                      e
                    </Button>

                    {/* 第四行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("4")}
                      className="col-span-1"
                    >
                      4
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("5")}
                      className="col-span-1"
                    >
                      5
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("6")}
                      className="col-span-1"
                    >
                      6
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("+")}
                      className="col-span-1"
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performOperation("^")}
                      className="col-span-1"
                    >
                      x^y
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("factorial")}
                      className="col-span-1"
                    >
                      n!
                    </Button>

                    {/* 第五行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("1")}
                      className="col-span-1"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("2")}
                      className="col-span-1"
                    >
                      2
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("3")}
                      className="col-span-1"
                    >
                      3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputOperator("%")}
                      className="col-span-1"
                    >
                      %
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performFunction("reciprocal")}
                      className="col-span-1"
                    >
                      1/x
                    </Button>
                    <Button
                      variant="default"
                      onClick={calculate}
                      className="col-span-1 row-span-2"
                    >
                      =
                    </Button>

                    {/* 第六行 */}
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("0")}
                      className="col-span-2"
                    >
                      0
                    </Button>
                    <Button
                      variant="outline"
                      onClick={inputDecimal}
                      className="col-span-1"
                    >
                      .
                    </Button>
                    <Button
                      variant="outline"
                      onClick={toggleSign}
                      className="col-span-1"
                    >
                      ±
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => inputNumber("00")}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCalculatorHistory}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      暂无计算记录
                    </p>
                  ) : (
                    history.map(
                      (
                        entry: { input: string; output: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground dark:text-slate-400"
                          onClick={() => setDisplay(entry.output)}
                        >
                          {entry.input} = {entry.output}
                        </div>
                      ),
                    )
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
