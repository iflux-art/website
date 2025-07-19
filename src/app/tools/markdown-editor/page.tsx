"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Eye,
  Edit,
  FileText,
  RotateCcw,
  FileDown,
  Columns,
  ArrowLeft,
} from "lucide-react"; // Added Columns as a placeholder for split view
import { ToolLayout } from "packages/src/ui/components/tools/tool-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "packages/src/ui/components/shared-ui/card";
import { Button } from "packages/src/ui/components/shared-ui/button";
import Link from "next/link";

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "split",
  );
  const [copied, setCopied] = useState<string | null>(null);

  // 简单的 Markdown 转 HTML 函数
  const markdownToHtml = (md: string): string => {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // 标题
    html = html.replace(/^### (.*)$/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gim, "<h1>$1</h1>");

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // 代码
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/```([^`]+)```/g, "<pre><code>$1</code></pre>");

    // 链接
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // 图片
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" style="max-width:100%;height:auto;"/>',
    );

    // 列表
    html = html.replace(/^\* (.+)$/gim, "<li>$1</li>");
    html = html.replace(/^\d+\. (.+)$/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");

    // 引用
    html = html.replace(/^> (.+)$/gim, "<blockquote>$1</blockquote>");

    // 水平线
    html = html.replace(/^---$/gim, "<hr/>");

    // 段落处理（优化版）
    html = html
      .split("\n\n")
      .map((p) => (p.trim() ? `<p>${p}</p>` : ""))
      .join("");

    // 清理空标签
    const cleanupPatterns = [
      /<p><\/p>/g,
      /<p>(<(h[1-6]|ul|blockquote|hr))/g,
      // eslint-disable-next-line no-useless-escape
      /(<\/(h[1-6]|ul|blockquote)>)<\/p>/g,
    ];

    cleanupPatterns.forEach((pattern) => {
      html = html.replace(pattern, (_, g) => g || "");
    });

    return html;
  };

  // 复制内容
  const copyContent = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 下载文件
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 插入 Markdown 语法
  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText = "";
    switch (syntax) {
      case "bold":
        newText = `**${selectedText || "粗体文本"}**`;
        break;
      case "italic":
        newText = `*${selectedText || "斜体文本"}*`;
        break;
      case "code":
        newText = `\`${selectedText || "代码"}\``;
        break;
      case "link":
        newText = `[${selectedText || "链接文本"}](URL)`;
        break;
      case "image":
        newText = `![${selectedText || "图片描述"}](图片URL)`;
        break;
      case "h1":
        newText = `# ${selectedText || "一级标题"}`;
        break;
      case "h2":
        newText = `## ${selectedText || "二级标题"}`;
        break;
      case "h3":
        newText = `### ${selectedText || "三级标题"}`;
        break;
      case "ul":
        newText = `* ${selectedText || "列表项"}`;
        break;
      case "ol":
        newText = `1. ${selectedText || "列表项"}`;
        break;
      case "quote":
        newText = `> ${selectedText || "引用文本"}`;
        break;
      case "hr":
        newText = "---";
        break;
      case "table":
        newText = `| 标题1 | 标题2 | 标题3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |`;
        break;
    }

    const newMarkdown =
      markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(newMarkdown);
  };

  // 加载示例
  const loadExample = () => {
    const example = `# Markdown 编辑器示例

## 这是二级标题

### 这是三级标题

这是一个段落，包含**粗体文本**和*斜体文本*。

## 代码示例

行内代码：\`console.log('Hello World')\`

代码块：
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## 列表

### 无序列表
* 第一项
* 第二项
* 第三项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 链接和图片

[这是一个链接](https://example.com)

![这是图片描述](https://via.placeholder.com/300x200)

## 引用

> 这是一个引用文本
> 可以跨越多行

## 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |

## 分隔线

---

这就是 Markdown 的基本语法示例！`;
    setMarkdown(example);
  };

  const clearContent = () => {
    setMarkdown("");
  };

  const htmlContent = markdownToHtml(markdown);

  // 1. 在 actions 定义时为所有 action 显式加 disabled: false，保证类型安全
  const actions = [
    {
      label: "编辑模式",
      onClick: () => setViewMode("edit"),
      icon: Edit,
      variant:
        viewMode === "edit" ? ("default" as const) : ("outline" as const),
      disabled: false,
    },
    {
      label: "预览模式",
      onClick: () => setViewMode("preview"),
      icon: Eye,
      variant:
        viewMode === "preview" ? ("default" as const) : ("outline" as const),
      disabled: false,
    },
    {
      label: "分屏模式",
      onClick: () => setViewMode("split"),
      icon: Columns,
      variant:
        viewMode === "split" ? ("default" as const) : ("outline" as const),
      disabled: false,
    },
    {
      label: "加载示例",
      onClick: loadExample,
      icon: FileDown,
      variant: "outline" as const,
      disabled: false,
    },
    {
      label: "清空",
      onClick: clearContent,
      icon: RotateCcw,
      variant: "outline" as const,
      disabled: false,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium">基础语法</h4>
        <ul className="space-y-1 text-sm text-muted-foreground dark:text-slate-400">
          <li>
            • <code># 标题</code> - 一级标题
          </li>
          <li>
            • <code>## 标题</code> - 二级标题
          </li>
          <li>
            • <code>**粗体**</code> - 粗体文本
          </li>
          <li>
            • <code>*斜体*</code> - 斜体文本
          </li>
          <li>
            • <code>`代码`</code> - 行内代码
          </li>
          <li>
            • <code>[链接](URL)</code> - 链接
          </li>
          <li>
            • <code>![图片](URL)</code> - 图片
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-2 font-medium">高级语法</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            • <code>* 列表项</code> - 无序列表
          </li>
          <li>
            • <code>1. 列表项</code> - 有序列表
          </li>
          <li>
            • <code>{">"} 引用</code> - 引用文本
          </li>
          <li>
            • <code>---</code> - 分隔线
          </li>
          <li>
            • <code>```代码块```</code> - 代码块
          </li>
          <li>
            • <code>| 表格 | 语法 |</code> - 表格
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
            <h1 className="text-3xl font-bold tracking-tight">
              Markdown编辑器
            </h1>
            <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              在线Markdown编辑器，支持实时预览、语法高亮、导出PDF、图片上传
            </p>
          </div>
        </div>
      </div>
      <ToolLayout
        title="Markdown 编辑器"
        description="支持实时预览、语法高亮、导出、复制等功能"
        icon={FileText}
        actions={
          <div className="flex gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant={action.variant}
                {...(typeof action.disabled !== "undefined"
                  ? { disabled: action.disabled }
                  : {})}
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
        {/* 工具栏 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 border-b bg-background p-2 dark:border-slate-800 dark:bg-slate-900">
              {/* Markdown 语法按钮 */}
              <Button
                className="rounded-md p-2 text-muted-foreground hover:bg-accent dark:text-slate-400 dark:hover:bg-slate-800"
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("bold")}
              >
                <strong>B</strong>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("italic")}
              >
                <em>I</em>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("code")}
              >
                {"</>"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("link")}
              >
                🔗
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("image")}
              >
                🖼️
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("h1")}
              >
                H1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("h2")}
              >
                H2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("ul")}
              >
                • 列表
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("quote")}
              >
                " 引用
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertMarkdown("table")}
              >
                📊 表格
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => copyContent(markdown, "markdown")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                {copied === "markdown" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                复制 Markdown
              </Button>
              <Button
                onClick={() => copyContent(htmlContent, "html")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied === "html" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                复制 HTML
              </Button>
              <Button
                onClick={() =>
                  downloadFile(markdown, "document.md", "text/markdown")
                }
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                下载 MD
              </Button>
              <Button
                onClick={() =>
                  downloadFile(htmlContent, "document.html", "text/html")
                }
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                下载 HTML
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 编辑器主体 */}
        <div className="grid h-[calc(100vh-12rem)] grid-cols-2 gap-4 rounded-lg bg-background p-4 dark:bg-slate-900">
          {/* 编辑区域 */}
          {(viewMode === "edit" || viewMode === "split") && (
            <Card className={viewMode === "split" ? "" : "lg:col-span-2"}>
              <CardHeader>
                <CardTitle>Markdown 编辑</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="在此输入 Markdown 内容..."
                  className="h-full w-full resize-none rounded-lg border bg-background p-4 font-mono text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:bg-slate-900 dark:text-slate-50"
                />
              </CardContent>
            </Card>
          )}

          {/* 预览区域 */}
          {(viewMode === "preview" || viewMode === "split") && (
            <Card className={viewMode === "split" ? "" : "lg:col-span-2"}>
              <CardHeader>
                <CardTitle>预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose h-full w-full overflow-auto rounded-lg border p-4 dark:bg-slate-900 dark:text-slate-50 dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html:
                      htmlContent ||
                      '\u003cp class="text-muted-foreground"\u003e预览内容将显示在这里...\u003c/p\u003e',
                  }}
                  style={{
                    lineHeight: "1.6",
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
    </div>
  );
}
