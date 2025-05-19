import React from "react";
import { ToggleDemo } from "@/components/examples/toggle-demo";

/**
 * Toggle 示例页面
 */
export default function TogglePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Toggle 组件示例</h1>
      <p className="text-muted-foreground mb-8">
        Toggle 组件用于切换开关状态，通常用于表示某个功能的启用或禁用状态。
      </p>
      
      <div className="max-w-2xl mx-auto">
        <ToggleDemo />
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">使用说明</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Toggle 组件是一个简单的开关组件，它扩展了 Radix UI 的 Toggle 组件，并添加了一些样式和功能。
          </p>
          
          <p>
            要使用 Toggle 组件，首先需要导入它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Toggle } from "@/components/ui/toggle";`}</code>
          </pre>
          
          <p>
            然后，可以按照以下方式使用它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<Toggle>切换</Toggle>`}</code>
          </pre>
          
          <p>
            Toggle 组件支持不同的变体和尺寸：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<Toggle variant="outline" size="sm">小型轮廓</Toggle>`}</code>
          </pre>
          
          <p>
            可以通过设置 pressed 和 onPressedChange 属性来创建受控组件：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`const [pressed, setPressed] = useState(false);

<Toggle 
  pressed={pressed} 
  onPressedChange={setPressed}
>
  {pressed ? "开启" : "关闭"}
</Toggle>`}</code>
          </pre>
          
          <p>
            更多详细信息和示例，请参阅<a href="/docs/components/toggle" className="text-primary hover:underline">Toggle 组件文档</a>。
          </p>
        </div>
      </div>
    </div>
  );
}
