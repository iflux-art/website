import React from "react";
import { TabsDemo } from "@/components/examples/tabs-demo";

/**
 * Tabs 示例页面
 */
export default function TabsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tabs 组件示例</h1>
      <p className="text-muted-foreground mb-8">
        Tabs 组件允许用户在同一区域内切换不同内容，提供了一种节省空间的方式来组织内容。
      </p>
      
      <div className="flex justify-center">
        <TabsDemo />
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">使用说明</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Tabs 组件由四个主要部分组成：
          </p>
          <ul>
            <li><code>Tabs</code> - 主容器组件，包含所有标签页相关元素</li>
            <li><code>TabsList</code> - 包含所有标签触发器的容器</li>
            <li><code>TabsTrigger</code> - 用于切换标签内容的按钮</li>
            <li><code>TabsContent</code> - 显示标签内容的容器</li>
          </ul>
          
          <p>
            要使用 Tabs 组件，首先需要导入相关组件：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";`}</code>
          </pre>
          
          <p>
            然后，可以按照以下结构创建标签页：
          </p>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签1</TabsTrigger>
    <TabsTrigger value="tab2">标签2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    标签1的内容
  </TabsContent>
  <TabsContent value="tab2">
    标签2的内容
  </TabsContent>
</Tabs>`}</code>
          </pre>
          
          <p>
            更多详细信息和示例，请参阅<a href="/docs/components/tabs" className="text-primary hover:underline">Tabs 组件文档</a>。
          </p>
        </div>
      </div>
    </div>
  );
}
