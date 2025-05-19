import React from "react";
import { CheckboxDemo } from "@/components/examples/checkbox-demo";

/**
 * Checkbox 示例页面
 */
export default function CheckboxPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Checkbox 组件示例</h1>
      <p className="text-muted-foreground mb-8">
        Checkbox 组件是一个可访问的复选框组件，用于选择多个选项。
      </p>
      
      <div className="max-w-2xl mx-auto">
        <CheckboxDemo />
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">使用说明</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Checkbox 组件是一个简单的复选框组件，它扩展了 Radix UI 的 Checkbox 组件，并添加了一些样式和功能。
          </p>
          
          <p>
            要使用 Checkbox 组件，首先需要导入它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Checkbox } from "@/components/ui/checkbox";`}</code>
          </pre>
          
          <p>
            然后，可以按照以下方式使用它：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label
    htmlFor="terms"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    接受条款和条件
  </label>
</div>`}</code>
          </pre>
          
          <p>
            可以通过设置 checked 和 onCheckedChange 属性来创建受控组件：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`const [checked, setChecked] = useState(false);

<Checkbox
  id="controlled"
  checked={checked}
  onCheckedChange={setChecked}
/>`}</code>
          </pre>
          
          <p>
            更多详细信息和示例，请参阅<a href="/docs/components/checkbox" className="text-primary hover:underline">Checkbox 组件文档</a>。
          </p>
        </div>
      </div>
    </div>
  );
}
