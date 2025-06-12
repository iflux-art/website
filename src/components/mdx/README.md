# MDX Components

这个目录包含了用于增强 MDX 内容渲染的组件集合。这些组件用于构建富文本内容、文档系统和博客平台。

## 当前组件

### 内容渲染
- `markdown-renderer.tsx` - Markdown 渲染器
  - 支持标准 Markdown 语法
  - 自定义组件映射
  - 语法高亮
  - 表格渲染

- `mdx-content-wrapper.tsx` - MDX 内容包装器
  - 布局控制
  - 主题应用
  - TOC 生成
  - 元数据处理

- `mdx-server-renderer.tsx` - 服务端渲染组件
  - SSR 支持
  - 静态生成优化
  - 缓存策略
  - 性能优化

### 内联元素
- `inline-code.tsx` - 内联代码
  - 代码片段样式
  - 语法高亮
  - 复制功能

- `markdown-link.tsx` - Markdown 链接
  - 内外链处理
  - 链接验证
  - 图标集成
  - 新窗口打开

### 布局组件
- `friend-link-grid.tsx` - 友情链接网格
  - 响应式布局
  - 卡片展示
  - 链接管理

- `navigation-grid.tsx` - 导航网格
  - 分类导航
  - 自适应布局
  - 交互效果

## 组件规范

### MDX 组件接口
```tsx
interface MDXComponentProps {
  // 内容相关
  content: string;
  components?: Record<string, React.ComponentType>;
  
  // 配置选项
  options?: {
    highlight?: boolean;
    toc?: boolean;
    footnotes?: boolean;
  };
  
  // 元数据
  frontmatter?: Record<string, any>;
  
  // 样式配置
  className?: string;
  theme?: 'light' | 'dark';
}
```

### 使用示例

```tsx
import { MDXContentWrapper } from '@/components/mdx/mdx-content-wrapper';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

export function DocumentPage({ content, frontmatter }) {
  return (
    <MDXContentWrapper frontmatter={frontmatter}>
      <MarkdownRenderer content={content} />
    </MDXContentWrapper>
  );
}
```

## 功能支持

### 基础功能
1. Markdown 语法
   - 标题层级
   - 列表类型
   - 引用块
   - 代码块
   - 表格
   - 图片

2. MDX 增强
   - React 组件
   - JSX 语法
   - 动态内容
   - 交互元素

3. 代码处理
   - 语法高亮
   - 行号显示
   - 复制功能
   - 折叠支持

### 高级功能
1. 内容优化
   - 图片优化
   - 懒加载
   - 响应式图片
   - WebP 支持

2. 交互增强
   - 目录导航
   - 锚点链接
   - 页内跳转
   - 进度指示

3. SEO 支持
   - Meta 标签
   - 结构化数据
   - 规范链接
   - 图片 alt

## 样式指南

### 主题定制
```css
.mdx-content {
  /* 排版样式 */
  --mdx-font-base: system-ui, sans-serif;
  --mdx-line-height: 1.6;
  
  /* 颜色系统 */
  --mdx-text-primary: #1a1a1a;
  --mdx-text-secondary: #666666;
  --mdx-link-color: #0066cc;
  
  /* 间距系统 */
  --mdx-spacing-base: 1rem;
  --mdx-content-width: 65ch;
}
```

### 响应式设计
- 移动端优化
- 字体缩放
- 图片适配
- 表格处理

## 性能优化

### 渲染优化
- 组件懒加载
- 内容分块
- 虚拟滚动
- 图片优化

### 缓存策略
- 内容缓存
- 组件缓存
- 静态生成
- 增量更新

## 测试规范

### 单元测试
- 组件渲染
- Markdown 解析
- 样式应用
- 交互功能

### 集成测试
- 完整文档渲染
- 组件互操作
- 主题切换
- 响应式行为

### 视觉回归测试
- 布局一致性
- 主题渲染
- 组件样式
- 响应式断点

## 文档要求

### 组件文档
- 功能描述
- Props 定义
- 使用示例
- 注意事项

### 样式指南
- 主题变量
- 布局规则
- 响应式断点
- 自定义样式

### 最佳实践
- 性能优化
- SEO 建议
- 可访问性
- 内容组织

## 维护指南

### 版本控制
- 语义化版本
- 更新日志
- 破坏性变更
- 迁移指南

### 问题追踪
- Bug 报告
- 功能请求
- 性能问题
- 兼容性问题
