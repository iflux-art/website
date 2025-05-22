# 组件性能与可访问性优化指南

## 性能优化策略

### 1. 组件优化

#### React.memo 使用指南

对于纯展示型组件或接收简单 props 的组件，使用 `React.memo` 避免不必要的重渲染：

```tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
};

// 使用 React.memo 包装组件
const Card = React.memo(({ title, description }: CardProps) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
});

export default Card;
```

#### useMemo 和 useCallback 使用场景

- **useMemo**：用于缓存计算结果，避免在每次渲染时重复执行昂贵的计算

```tsx
const filteredItems = useMemo(() => {
  console.log('过滤数据...');
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);
```

- **useCallback**：用于缓存函数引用，特别是传递给子组件的回调函数

```tsx
const handleItemClick = useCallback((id: string) => {
  console.log('处理点击事件...');
  setSelectedId(id);
}, [setSelectedId]);
```

### 2. 懒加载实现

#### 组件懒加载

使用 `React.lazy` 和 `Suspense` 实现组件懒加载：

```tsx
import React, { Suspense } from 'react';

// 懒加载组件
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

#### 图片懒加载

使用 Next.js 的 Image 组件自动实现图片懒加载：

```tsx
import Image from 'next/image';

function Gallery() {
  return (
    <div>
      <Image
        src="/images/large-image.jpg"
        alt="大图片"
        width={800}
        height={600}
        loading="lazy"
      />
    </div>
  );
}
```

### 3. 代码分割

利用 Next.js 的动态导入功能实现代码分割：

```tsx
import dynamic from 'next/dynamic';

// 动态导入组件
const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>加载中...</p>,
  ssr: false, // 如果组件不需要服务端渲染，可以设置为 false
});

export default function Page() {
  return (
    <div>
      <h1>带有动态组件的页面</h1>
      <DynamicComponent />
    </div>
  );
}
```

## 可访问性优化指南

### 1. 语义化 HTML

使用语义化标签提高可访问性：

```tsx
// 不推荐
<div onClick={handleClick}>点击我</div>

// 推荐
<button onClick={handleClick}>点击我</button>
```

### 2. ARIA 属性使用

为交互元素添加适当的 ARIA 属性：

```tsx
// 标签与表单控件关联
<label htmlFor="username">用户名</label>
<input
  id="username"
  name="username"
  aria-required="true"
  aria-invalid={errors.username ? "true" : "false"}
  aria-describedby="username-error"
/>
{errors.username && (
  <span id="username-error" role="alert">{errors.username.message}</span>
)}
```

### 3. 键盘导航支持

确保所有交互元素可通过键盘访问：

```tsx
function NavigationMenu() {
  return (
    <nav>
      <ul role="menubar">
        <li role="none">
          <a href="/" role="menuitem" tabIndex={0}>首页</a>
        </li>
        <li role="none">
          <a href="/about" role="menuitem" tabIndex={0}>关于</a>
        </li>
      </ul>
    </nav>
  );
}
```

### 4. 颜色对比度

确保文本与背景之间有足够的对比度：

```tsx
// 不推荐 - 低对比度
<p className="text-[oklch(0.8_0_0)] bg-[oklch(0.95_0_0)]">这段文字对比度不足</p>

// 推荐 - 高对比度
<p className="text-foreground bg-background">这段文字对比度充足</p>
```

### 5. 焦点管理

为交互元素提供清晰的焦点状态：

```tsx
// 在全局样式中定义焦点样式
// globals.css
:focus-visible {
  outline: 2px solid oklch(0.5 0.2 240);
  outline-offset: 2px;
}

// 组件中使用
<button className="focus:ring-2 focus:ring-primary focus:outline-none">
  可聚焦按钮
</button>
```

## 性能测试与监控

### 1. Lighthouse 审计

定期使用 Lighthouse 进行性能和可访问性审计：

```bash
# 使用 Lighthouse CLI
npx lighthouse https://your-site.com --view
```

### 2. React DevTools Profiler

使用 React DevTools Profiler 分析组件渲染性能：

1. 安装 React DevTools 浏览器扩展
2. 打开开发者工具，切换到 Profiler 标签
3. 点击 "Record" 按钮开始记录
4. 执行需要分析的操作
5. 停止记录并分析结果

### 3. Jest 性能测试

编写测试用例验证关键组件的渲染性能：

```tsx
import { render } from '@testing-library/react';
import { perf, wait } from 'react-performance-testing';
import HeavyComponent from './HeavyComponent';

test('HeavyComponent 渲染性能测试', async () => {
  const { renderCount } = perf(React);

  render(<HeavyComponent />);

  // 等待所有异步操作完成
  await wait(() => expect(renderCount.current.HeavyComponent).toBe(1));

  // 验证组件只渲染了一次
  expect(renderCount.current.HeavyComponent).toBe(1);
});
```

## 最佳实践检查清单

### 性能检查项

- [ ] 使用 React.memo 优化纯展示组件
- [ ] 合理使用 useMemo 和 useCallback
- [ ] 实现组件和图片懒加载
- [ ] 使用代码分割减小初始加载体积
- [ ] 避免不必要的状态更新和重渲染
- [ ] 优化列表渲染（使用唯一且稳定的 key）
- [ ] 使用 Web Workers 处理复杂计算

### 可访问性检查项

- [ ] 使用语义化 HTML 标签
- [ ] 添加适当的 ARIA 属性
- [ ] 确保键盘可访问性
- [ ] 维持足够的颜色对比度
- [ ] 提供替代文本（如图片的 alt 属性）
- [ ] 实现正确的表单标签关联
- [ ] 确保动态内容变化时通知屏幕阅读器