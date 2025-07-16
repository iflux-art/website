"use client";

import React, { useState } from "react";
import { Button } from "packages/src/ui/components/shared-ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "packages/src/ui/components/shared-ui/card";
import { ArrowLeft, Copy, Check, Box, Zap, Grid3X3 } from "lucide-react";
import Link from "next/link";

export default function CssToolkitPage() {
  const [activeTab, setActiveTab] = useState<
    "shadow" | "border" | "animation" | "flexbox" | "grid"
  >("shadow");
  const [copied, setCopied] = useState<string | null>(null);

  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 阴影生成器
  const ShadowGenerator = () => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(4);
    const [blurRadius, setBlurRadius] = useState(8);
    const [spreadRadius, setSpreadRadius] = useState(0);
    const [color, setColor] = useState("#000000");
    const [opacity, setOpacity] = useState(0.25);

    const generateShadow = () => {
      const rgba = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16,
      )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
      return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgba}`;
    };

    const cssCode = `box-shadow: ${generateShadow()};`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>阴影生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                  水平偏移 (px)
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {offsetX}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  垂直偏移 (px)
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {offsetY}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  模糊半径 (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {blurRadius}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  扩展半径 (px)
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={spreadRadius}
                  onChange={(e) => setSpreadRadius(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {spreadRadius}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">颜色</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-md border bg-background p-3 dark:bg-slate-900 dark:text-slate-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">透明度</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">{opacity}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">预览</label>
                <div className="flex h-48 items-center justify-center rounded-lg border bg-background p-4 dark:bg-slate-900 dark:text-slate-50">
                  <div
                    className="h-24 w-24 rounded-lg bg-white"
                    style={{ boxShadow: generateShadow() }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  CSS代码
                </label>
                <div className="relative">
                  <pre className="w-full rounded-md border bg-background p-4 font-mono text-sm dark:bg-slate-900 dark:text-slate-50">
                    <code>{cssCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(cssCode, "shadow")}
                  >
                    {copied === "shadow" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 圆角生成器
  const BorderRadiusGenerator = () => {
    const [topLeft, setTopLeft] = useState(8);
    const [topRight, setTopRight] = useState(8);
    const [bottomRight, setBottomRight] = useState(8);
    const [bottomLeft, setBottomLeft] = useState(8);

    const generateBorderRadius = () => {
      return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
    };

    const cssCode = `border-radius: ${generateBorderRadius()};`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>圆角生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  左上角 (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={topLeft}
                  onChange={(e) => setTopLeft(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {topLeft}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  右上角 (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={topRight}
                  onChange={(e) => setTopRight(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {topRight}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  右下角 (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={bottomRight}
                  onChange={(e) => setBottomRight(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {bottomRight}px
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  左下角 (px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={bottomLeft}
                  onChange={(e) => setBottomLeft(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {bottomLeft}px
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTopLeft(8);
                    setTopRight(8);
                    setBottomRight(8);
                    setBottomLeft(8);
                  }}
                >
                  重置
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTopLeft(25);
                    setTopRight(25);
                    setBottomRight(25);
                    setBottomLeft(25);
                  }}
                >
                  圆形
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">预览</label>
                <div className="flex h-48 items-center justify-center rounded-lg bg-muted/50">
                  <div
                    className="h-24 w-32 bg-blue-500"
                    style={{ borderRadius: generateBorderRadius() }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  CSS代码
                </label>
                <div className="relative">
                  <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">
                    <code>{cssCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(cssCode, "border")}
                  >
                    {copied === "border" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Flexbox生成器
  const FlexboxGenerator = () => {
    const [direction, setDirection] = useState<
      "row" | "row-reverse" | "column" | "column-reverse"
    >("row");
    const [justify, setJustify] = useState<
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly"
    >("center");
    const [align, setAlign] = useState<
      "stretch" | "flex-start" | "flex-end" | "center" | "baseline"
    >("center");
    const [wrap, setWrap] = useState<"nowrap" | "wrap" | "wrap-reverse">(
      "nowrap",
    );

    const cssCode = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Flexbox生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  方向 (flex-direction)
                </label>
                <select
                  value={direction}
                  onChange={(e) =>
                    setDirection(e.target.value as typeof direction)
                  }
                  className="w-full rounded-md border bg-background p-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-900 dark:text-slate-50"
                >
                  <option value="row">row</option>
                  <option value="row-reverse">row-reverse</option>
                  <option value="column">column</option>
                  <option value="column-reverse">column-reverse</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  主轴对齐 (justify-content)
                </label>
                <select
                  value={justify}
                  onChange={(e) => setJustify(e.target.value as typeof justify)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="space-between">space-between</option>
                  <option value="space-around">space-around</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  交叉轴对齐 (align-items)
                </label>
                <select
                  value={align}
                  onChange={(e) => setAlign(e.target.value as typeof align)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="stretch">stretch</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  换行 (flex-wrap)
                </label>
                <select
                  value={wrap}
                  onChange={(e) => setWrap(e.target.value as typeof wrap)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="nowrap">nowrap</option>
                  <option value="wrap">wrap</option>
                  <option value="wrap-reverse">wrap-reverse</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">预览</label>
                <div
                  className="h-48 rounded-lg border-2 border-dashed border-border bg-muted/50"
                  style={{
                    display: "flex",
                    flexDirection: direction,
                    justifyContent: justify,
                    alignItems: align,
                    flexWrap: wrap,
                  }}
                >
                  <div className="m-1 h-8 w-8 rounded bg-red-400"></div>
                  <div className="m-1 h-8 w-8 rounded bg-green-400"></div>
                  <div className="m-1 h-8 w-8 rounded bg-blue-400"></div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  CSS代码
                </label>
                <div className="relative">
                  <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">
                    <code>{cssCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(cssCode, "flexbox")}
                  >
                    {copied === "flexbox" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 动画生成器
  const AnimationGenerator = () => {
    const [animationType, setAnimationType] = useState("fadeIn");
    const [duration, setDuration] = useState("1");
    const [timing, setTiming] = useState("ease");
    const [delay, setDelay] = useState("0");
    const [iteration, setIteration] = useState("1");

    const animations = {
      fadeIn: {
        name: "淡入",
        keyframes: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
      },
      fadeOut: {
        name: "淡出",
        keyframes: `@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`,
      },
      slideInLeft: {
        name: "左滑入",
        keyframes: `@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}`,
      },
      slideInRight: {
        name: "右滑入",
        keyframes: `@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}`,
      },
      slideInUp: {
        name: "上滑入",
        keyframes: `@keyframes slideInUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}`,
      },
      slideInDown: {
        name: "下滑入",
        keyframes: `@keyframes slideInDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}`,
      },
      bounce: {
        name: "弹跳",
        keyframes: `@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
}`,
      },
      pulse: {
        name: "脉冲",
        keyframes: `@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`,
      },
      rotate: {
        name: "旋转",
        keyframes: `@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
      },
      shake: {
        name: "摇摆",
        keyframes: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`,
      },
    };

    const cssCode = `${animations[animationType as keyof typeof animations].keyframes}

.animated-element {
  animation: ${animationType} ${duration}s ${timing} ${delay}s ${
    iteration === "infinite" ? "infinite" : iteration
  };
}`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>CSS动画生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  动画类型
                </label>
                <select
                  value={animationType}
                  onChange={(e) => setAnimationType(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  {Object.entries(animations).map(([key, anim]) => (
                    <option key={key} value={key}>
                      {anim.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  持续时间 (秒)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  缓动函数
                </label>
                <select
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="ease">ease</option>
                  <option value="ease-in">ease-in</option>
                  <option value="ease-out">ease-out</option>
                  <option value="ease-in-out">ease-in-out</option>
                  <option value="linear">linear</option>
                  <option value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">
                    cubic-bezier
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  延迟 (秒)
                </label>
                <input
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  重复次数
                </label>
                <select
                  value={iteration}
                  onChange={(e) => setIteration(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="1">1次</option>
                  <option value="2">2次</option>
                  <option value="3">3次</option>
                  <option value="infinite">无限</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">预览</label>
                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg bg-muted/50">
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        animations[animationType as keyof typeof animations]
                          .keyframes,
                    }}
                  />
                  <div
                    className="h-16 w-16 rounded-lg bg-blue-500"
                    style={{
                      animation: `${animationType} ${duration}s ${timing} ${delay}s ${
                        iteration === "infinite" ? "infinite" : iteration
                      }`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  CSS代码
                </label>
                <div className="relative">
                  <pre className="max-h-64 overflow-x-auto rounded bg-muted p-3 text-sm">
                    <code>{cssCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(cssCode, "animation")}
                  >
                    {copied === "animation" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Grid生成器
  const GridGenerator = () => {
    const [columns, setColumns] = useState("3");
    const [rows, setRows] = useState("3");
    const [gap, setGap] = useState("1rem");
    const [templateColumns, setTemplateColumns] = useState("1fr 1fr 1fr");
    const [templateRows, setTemplateRows] = useState("1fr 1fr 1fr");

    const cssCode = `display: grid;
grid-template-columns: ${templateColumns};
grid-template-rows: ${templateRows};
gap: ${gap};`;

    const updateTemplate = (type: "columns" | "rows", count: string) => {
      const num = parseInt(count);
      if (isNaN(num) || num < 1) return;

      const template = Array(num).fill("1fr").join(" ");
      if (type === "columns") {
        setTemplateColumns(template);
      } else {
        setTemplateRows(template);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>CSS Grid生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">列数</label>
                <input
                  type="number"
                  value={columns}
                  onChange={(e) => {
                    setColumns(e.target.value);
                    updateTemplate("columns", e.target.value);
                  }}
                  min="1"
                  max="12"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">行数</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => {
                    setRows(e.target.value);
                    updateTemplate("rows", e.target.value);
                  }}
                  min="1"
                  max="12"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">间距</label>
                <select
                  value={gap}
                  onChange={(e) => setGap(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2"
                >
                  <option value="0">无间距</option>
                  <option value="0.5rem">0.5rem</option>
                  <option value="1rem">1rem</option>
                  <option value="1.5rem">1.5rem</option>
                  <option value="2rem">2rem</option>
                  <option value="3rem">3rem</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">列模板</label>
                <input
                  type="text"
                  value={templateColumns}
                  onChange={(e) => setTemplateColumns(e.target.value)}
                  placeholder="1fr 1fr 1fr"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">行模板</label>
                <input
                  type="text"
                  value={templateRows}
                  onChange={(e) => setTemplateRows(e.target.value)}
                  placeholder="1fr 1fr 1fr"
                  className="w-full rounded border border-border bg-background p-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">预览</label>
                <div
                  className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-4"
                  style={{
                    display: "grid",
                    gridTemplateColumns: templateColumns,
                    gridTemplateRows: templateRows,
                    gap: gap,
                    minHeight: "200px",
                  }}
                >
                  {Array.from(
                    { length: parseInt(columns) * parseInt(rows) },
                    (_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center rounded bg-blue-400 text-sm font-medium text-white"
                      >
                        {i + 1}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  CSS代码
                </label>
                <div className="relative">
                  <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">
                    <code>{cssCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(cssCode, "grid")}
                  >
                    {copied === "grid" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: "shadow", name: "阴影", icon: Box },
    { key: "border", name: "圆角", icon: Box },
    { key: "animation", name: "动画", icon: Zap },
    { key: "flexbox", name: "Flexbox", icon: Grid3X3 },
    { key: "grid", name: "Grid", icon: Grid3X3 },
  ] as const;

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
            <h1 className="text-3xl font-bold tracking-tight">CSS工具箱</h1>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              前端开发必备的CSS工具集，包含阴影生成器、渐变编辑器、动画预览、布局工具
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    activeTab === tab.key
                      ? "rounded-md bg-primary px-4 py-2 text-primary-foreground dark:bg-slate-700"
                      : "rounded-md px-4 py-2 hover:bg-accent dark:hover:bg-slate-800"
                  }
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {activeTab === "shadow" && <ShadowGenerator />}
      {activeTab === "border" && <BorderRadiusGenerator />}
      {activeTab === "animation" && <AnimationGenerator />}
      {activeTab === "flexbox" && <FlexboxGenerator />}
      {activeTab === "grid" && <GridGenerator />}
    </div>
  );
}
