import React from "react";
import { LabelDemo } from "@/components/examples/label-demo";

/**
 * Label 示例页面
 */
export default function LabelPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Label 组件示例</h1>
      <p className="text-muted-foreground mb-8">
        Label 组件是一个可访问的标签组件，用于表单控件。
      </p>
      
      <div className="max-w-2xl mx-auto">
        <LabelDemo />
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">使用说明</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Label 组件是一个简单的标签组件，它扩展了 Radix UI 的 Label 组件，并添加了一些样式和功能。
          </p>
          
          <p>
            要使用 Label 组件，首先需要导入它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Label } from "@/components/ui/label";`}</code>
          </pre>
          
          <p>
            然后，可以按照以下方式使用它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<Label htmlFor="email">电子邮箱</Label>`}</code>
          </pre>
          
          <p>
            Label 组件通常与表单控件一起使用，以提供更好的可访问性：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">电子邮箱</Label>
  <Input type="email" id="email" placeholder="输入您的电子邮箱" />
</div>`}</code>
          </pre>
          
          <p>
            更多详细信息和示例，请参阅<a href="/docs/components/label" className="text-primary hover:underline">Label 组件文档</a>。
          </p>
        </div>
      </div>
    </div>
  );
}
