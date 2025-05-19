import React from "react";
import { TextareaDemo } from "@/components/examples/textarea-demo";

/**
 * Textarea 示例页面
 */
export default function TextareaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Textarea 组件示例</h1>
      <p className="text-muted-foreground mb-8">
        Textarea 组件用于多行文本输入，如评论、消息或其他需要输入大量文本的场景。
      </p>
      
      <div className="max-w-2xl mx-auto">
        <TextareaDemo />
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">使用说明</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Textarea 组件是一个简单的多行文本输入组件，它扩展了原生的 HTML textarea 元素，并添加了一些样式和功能。
          </p>
          
          <p>
            要使用 Textarea 组件，首先需要导入它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Textarea } from "@/components/ui/textarea";`}</code>
          </pre>
          
          <p>
            然后，可以按照以下方式使用它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<Textarea placeholder="在此输入您的消息..." />`}</code>
          </pre>
          
          <p>
            Textarea 组件接受所有标准的 HTML textarea 属性，如 placeholder、disabled、rows 等。
          </p>
          
          <p>
            通常，Textarea 组件与 Label 组件一起使用，以提供更好的可访问性：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<div className="grid w-full gap-1.5">
  <Label htmlFor="message">消息</Label>
  <Textarea id="message" placeholder="在此输入您的消息..." />
</div>`}</code>
          </pre>
          
          <p>
            更多详细信息和示例，请参阅<a href="/docs/components/textarea" className="text-primary hover:underline">Textarea 组件文档</a>。
          </p>
        </div>
      </div>
    </div>
  );
}
