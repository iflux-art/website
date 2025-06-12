# Layout Components

这个目录包含了网站的核心布局组件，负责整体页面结构和布局的组织。

## 目录结构

```
layout/
├── home/                    # 主页相关布局组件
│   ├── config.ts
│   ├── constants.ts
│   ├── enhanced-background.tsx
│   ├── greeting.tsx
│   ├── home-hero.tsx
│   ├── search-box.tsx
│   ├── recommendation-tags.tsx
│   └── more-recommendation-tags.tsx
├── navbar/                  # 导航栏相关组件
│   ├── logo.tsx
│   ├── mobile-menu.tsx
│   ├── nav-link.tsx
│   ├── nav-menu.tsx
│   ├── navbar.tsx
│   ├── search-dialog.tsx
│   ├── search-icon.tsx
│   ├── theme-toggle.tsx
│   └── travel-button.tsx
├── admin-layout.tsx         # 管理后台布局
├── AdminPageContentLayout.tsx
├── footer.tsx              # 页脚组件
└── tool-layout.tsx         # 工具页面布局
```

## 模块说明

### 主页布局 (/home)
包含主页特定的布局组件：

- `config.ts` - 主页配置
- `constants.ts` - 常量定义
- `enhanced-background.tsx` - 增强背景效果
- `greeting.tsx` - 欢迎语组件
- `home-hero.tsx` - 主页头部组件
- `search-box.tsx` - 搜索框组件
- `recommendation-tags.tsx` - 推荐标签
- `more-recommendation-tags.tsx` - 更多推荐标签

### 导航栏 (/navbar)
网站通用导航组件：

- `logo.tsx` - Logo 组件
- `mobile-menu.tsx` - 移动端菜单
- `nav-link.tsx` - 导航链接
- `nav-menu.tsx` - 导航菜单
- `navbar.tsx` - 导航栏主组件
- `search-dialog.tsx` - 搜索对话框
- `search-icon.tsx` - 搜索图标
- `theme-toggle.tsx` - 主题切换
- `travel-button.tsx` - 旅行按钮

### 主要布局组件
- `admin-layout.tsx` - 管理后台布局框架
- `AdminPageContentLayout.tsx` - 管理页面内容布局
- `footer.tsx` - 页面底部组件
- `tool-layout.tsx` - 工具页面布局框架

## 使用指南

### 基础布局
```tsx
// 页面基础布局
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer';

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

### 管理后台布局
```tsx
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminPageContentLayout } from '@/components/layout/AdminPageContentLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminPageContentLayout>
        {/* 页面内容 */}
      </AdminPageContentLayout>
    </AdminLayout>
  );
}
```

### 工具页面布局
```tsx
import { ToolLayout } from '@/components/layout/tool-layout';

export default function ToolPage() {
  return (
    <ToolLayout>
      {/* 工具内容 */}
    </ToolLayout>
  );
}
```

## 开发规范

### 布局组件原则

1. 响应式设计
   - 支持多种屏幕尺寸
   - 使用流式布局
   - 合理的断点设置

2. 性能优化
   - 避免不必要的渲染
   - 优化大型布局组件
   - 使用适当的性能优化技术

3. 可访问性
   - 语义化HTML结构
   - 适当的ARIA属性
   - 键盘导航支持

4. 可维护性
   - 清晰的组件结构
   - 一致的命名规范
   - 详细的注释说明

### 布局配置

布局组件应该支持：

- 自定义样式覆盖
- 灵活的内容插槽
- 响应式行为配置
- 主题定制

### 最佳实践

1. 使用 CSS Grid 和 Flexbox 进行布局
2. 实现响应式设计
3. 考虑性能影响
4. 保持代码整洁和可维护
5. 提供完整的类型定义
