# Card Components

这个目录包含了所有独立的卡片展示组件。卡片组件用于以统一的格式展示各类内容。

## 当前组件

### NavigationCard
`navigation-card.tsx` - 导航卡片组件
- 用于展示导航链接和相关信息
- 支持图标和描述文本
- 包含悬停效果和交互状态

## 建议的卡片类型

我们建议在这个目录下添加以下类型的卡片组件：

### 内容卡片
- `article-card.tsx` - 文章预览卡片
- `product-card.tsx` - 产品展示卡片
- `profile-card.tsx` - 用户资料卡片
- `pricing-card.tsx` - 价格方案卡片

### 数据卡片
- `stats-card.tsx` - 统计数据卡片
- `analytics-card.tsx` - 分析数据卡片
- `metric-card.tsx` - 指标展示卡片

### 功能卡片
- `action-card.tsx` - 操作功能卡片
- `settings-card.tsx` - 设置选项卡片
- `feature-card.tsx` - 功能介绍卡片

## 卡片组件规范

### 基础要求

1. 响应式设计
   - 适应不同屏幕尺寸
   - 合理的内容布局
   - 清晰的视觉层次

2. 交互效果
   - 悬停状态
   - 点击反馈
   - 加载状态
   - 错误状态

3. 可访问性
   - 语义化结构
   - 键盘导航
   - 适当的颜色对比度
   - ARIA属性支持

### 代码规范

```tsx
interface CardProps {
  // 必要属性
  title: string;
  description?: string;
  
  // 可选的展示配置
  icon?: React.ComponentType<IconProps>;
  image?: string;
  
  // 交互属性
  onClick?: () => void;
  href?: string;
  
  // 样式定制
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}
```

### 使用示例

```tsx
import { NavigationCard } from '@/components/cards/navigation-card';

export function MyComponent() {
  return (
    <NavigationCard
      title="开发文档"
      description="查看详细的开发文档和API参考"
      icon={DocumentIcon}
      href="/docs"
    />
  );
}
```

## 样式指南

### 设计原则
- 保持视觉一致性
- 清晰的信息层次
- 适当的空白和间距
- 响应式布局适配

### 推荐的样式属性
```css
.card {
  /* 基础样式 */
  border-radius: 0.5rem;
  padding: 1rem;
  
  /* 阴影效果 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  /* 过渡动画 */
  transition: all 0.2s ease;
  
  /* 悬停效果 */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

## 测试要求

每个卡片组件都应该包含：

1. 单元测试
   - 渲染测试
   - 属性验证
   - 交互测试

2. 集成测试
   - 与其他组件的配合
   - 路由跳转
   - 数据流处理

3. 快照测试
   - 视觉回归测试
   - 响应式布局测试

## 性能考虑

- 使用适当的缓存策略
- 实现懒加载
- 优化渲染性能
- 减少不必要的重渲染

## 文档要求

每个卡片组件都应该包含：

- 组件说明
- Props 定义
- 使用示例
- 注意事项
