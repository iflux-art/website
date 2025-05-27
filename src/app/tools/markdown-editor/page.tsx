'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Edit, FileText, RotateCcw, FileDown } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { ToolActions } from '@/components/ui/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [copied, setCopied] = useState<string | null>(null);

  // 简单的 Markdown 转 HTML 函数
  const markdownToHtml = (md: string): string => {
    let html = md;

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;" />');

    // 列表
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // 引用
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // 水平线
    html = html.replace(/^---$/gim, '<hr>');

    // 段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // 清理空段落
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    return html;
  };

  // 复制内容
  const copyContent = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 下载文件
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 插入 Markdown 语法
  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText = '';
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || '斜体文本'}*`;
        break;
      case 'code':
        newText = `\`${selectedText || '代码'}\``;
        break;
      case 'link':
        newText = `[${selectedText || '链接文本'}](URL)`;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](图片URL)`;
        break;
      case 'h1':
        newText = `# ${selectedText || '一级标题'}`;
        break;
      case 'h2':
        newText = `## ${selectedText || '二级标题'}`;
        break;
      case 'h3':
        newText = `### ${selectedText || '三级标题'}`;
        break;
      case 'ul':
        newText = `* ${selectedText || '列表项'}`;
        break;
      case 'ol':
        newText = `1. ${selectedText || '列表项'}`;
        break;
      case 'quote':
        newText = `> ${selectedText || '引用文本'}`;
        break;
      case 'hr':
        newText = '---';
        break;
      case 'table':
        newText = `| 标题1 | 标题2 | 标题3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |`;
        break;
    }

    const newMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
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
    setMarkdown('');
  };

  const htmlContent = markdownToHtml(markdown);

  const actions = [
    {
      label: '编辑模式',
      onClick: () => setViewMode('edit'),
      icon: Edit,
      variant: viewMode === 'edit' ? 'default' : 'outline' as const,
    },
    {
      label: '预览模式',
      onClick: () => setViewMode('preview'),
      icon: Eye,
      variant: viewMode === 'preview' ? 'default' : 'outline' as const,
    },
    {
      label: '分屏模式',
      onClick: () => setViewMode('split'),
      variant: viewMode === 'split' ? 'default' : 'outline' as const,
    },
    {
      label: '加载示例',
      onClick: loadExample,
      icon: FileDown,
      variant: 'outline' as const,
    },
    {
      label: '清空',
      onClick: clearContent,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">基础语法</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <code># 标题</code> - 一级标题</li>
          <li>• <code>## 标题</code> - 二级标题</li>
          <li>• <code>**粗体**</code> - 粗体文本</li>
          <li>• <code>*斜体*</code> - 斜体文本</li>
          <li>• <code>`代码`</code> - 行内代码</li>
          <li>• <code>[链接](URL)</code> - 链接</li>
          <li>• <code>![图片](URL)</code> - 图片</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">高级语法</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <code>* 列表项</code> - 无序列表</li>
          <li>• <code>1. 列表项</code> - 有序列表</li>
          <li>• <code>> 引用</code> - 引用文本</li>
          <li>• <code>---</code> - 分隔线</li>
          <li>• <code>```代码块```</code> - 代码块</li>
          <li>• <code>| 表格 | 语法 |</code> - 表格</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Markdown 编辑器"
      description="在线 Markdown 编辑器，支持实时预览和语法高亮"
      icon={FileText}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >

      {/* 工具栏 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* 视图模式 */}
            <div className="flex gap-1 mr-4">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('edit')}
              >
                <Edit className="h-4 w-4 mr-1" />
                编辑
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4 mr-1" />
                预览
              </Button>
              <Button
                variant={viewMode === 'split' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('split')}
              >
                分屏
              </Button>
            </div>

            {/* Markdown 语法按钮 */}
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('bold')}>
              <strong>B</strong>
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('italic')}>
              <em>I</em>
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('code')}>
              {'</>'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('link')}>
              🔗
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('image')}>
              🖼️
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('h1')}>
              H1
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('h2')}>
              H2
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('ul')}>
              • 列表
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('quote')}>
              " 引用
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertMarkdown('table')}>
              📊 表格
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={loadExample} variant="outline" size="sm">
              加载示例
            </Button>
            <Button onClick={clearContent} variant="outline" size="sm">
              清空
            </Button>
            <Button
              onClick={() => copyContent(markdown, 'markdown')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied === 'markdown' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              复制 Markdown
            </Button>
            <Button
              onClick={() => copyContent(htmlContent, 'html')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied === 'html' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              复制 HTML
            </Button>
            <Button
              onClick={() => downloadFile(markdown, 'document.md', 'text/markdown')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              下载 MD
            </Button>
            <Button
              onClick={() => downloadFile(htmlContent, 'document.html', 'text/html')}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 编辑区域 */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <Card className={viewMode === 'split' ? '' : 'lg:col-span-2'}>
            <CardHeader>
              <CardTitle>Markdown 编辑</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在此输入 Markdown 内容..."
                className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </CardContent>
          </Card>
        )}

        {/* 预览区域 */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <Card className={viewMode === 'split' ? '' : 'lg:col-span-2'}>
            <CardHeader>
              <CardTitle>预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none h-96 overflow-y-auto p-3 border border-border rounded-lg bg-muted/50"
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-muted-foreground">预览内容将显示在这里...</p>' }}
                style={{
                  lineHeight: '1.6',
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

    </ToolLayout>
  );
}
