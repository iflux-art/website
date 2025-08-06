# GlobalDocsSidebar 组件使用示例

## 基本用法

### 服务器端渲染（推荐）

```tsx
import { getAllDocsStructure } from "@/lib/global-docs";
import { GlobalDocsSidebar } from "@/components/content/global-docs-sidebar";

export default function MyPage() {
  // 在服务器端获取数据
  const structure = getAllDocsStructure();

  return (
    <div className="flex">
      <aside className="w-80">
        <GlobalDocsSidebar
          structure={structure}
          currentDoc="/docs/ai/ai-tools-comparison"
          className="max-h-screen overflow-y-auto"
        />
      </aside>
      <main className="flex-1">{/* 主要内容 */}</main>
    </div>
  );
}
```

### 客户端渲染

```tsx
import { GlobalDocsSidebarWrapper } from "@/components/content/global-docs-sidebar-wrapper";

export default function MyClientPage() {
  return (
    <div className="flex">
      <aside className="w-80">
        <GlobalDocsSidebarWrapper
          currentDoc="/docs/ai/ai-tools-comparison"
          className="max-h-screen overflow-y-auto"
        />
      </aside>
      <main className="flex-1">{/* 主要内容 */}</main>
    </div>
  );
}
```

## 功能特性

- ✅ 显示所有文档分类和文档的完整导航结构
- ✅ 使用 `getAllDocsStructure()` 函数获取数据
- ✅ 支持多级嵌套结构和跨分类导航
- ✅ 当前文档高亮显示
- ✅ 分类折叠/展开状态的 localStorage 持久化
- ✅ 响应式设计和无障碍访问支持

## API 端点

组件使用以下API端点获取数据：

- `GET /api/docs/global-structure` - 获取全局文档结构

## 相关文件

- `src/components/content/global-docs-sidebar.tsx` - 主组件
- `src/components/content/global-docs-sidebar-wrapper.tsx` - 客户端包装组件
- `src/hooks/use-global-docs.ts` - 数据获取钩子
- `src/app/api/docs/global-structure/route.ts` - API端点
- `src/lib/global-docs.ts` - 数据处理函数
