# 懒加载和动画优化指南

## 概述

本指南介绍了网站中使用的懒加载和动画优化工具，帮助开发者理解如何正确使用这些工具来提高网站性能和用户体验。

## 懒加载工具库

懒加载工具库位于 `src/lib/lazy-loading.ts`，提供了以下功能：

### 1. 组件懒加载

```tsx
import { lazyLoadComponent } from "@/lib/lazy-loading";

// 创建懒加载组件
const LazyComponent = lazyLoadComponent(
  () => import("./HeavyComponent"),
  <div>加载中...</div> // 可选的加载占位符
);

// 使用懒加载组件
<LazyComponent prop1="value1" />
```

### 2. 懒加载容器

```tsx
import { createLazyContainer } from "@/lib/lazy-loading";

function MyComponent() {
  // 创建懒加载容器
  const { ref, inView, className, style } = createLazyContainer({
    triggerOnce: true,     // 是否只触发一次
    threshold: 0.1,        // 可见阈值 0-1
    fadeIn: true,          // 是否启用淡入效果
    fadeInDuration: 500,   // 淡入动画持续时间(ms)
    delayTime: 200         // 延迟加载时间(ms)
  });

  return (
    <div ref={ref} className={className} style={style}>
      {inView && <div>内容在视图中可见时显示</div>}
    </div>
  );
}
```

### 3. 图片懒加载

```tsx
import { getImageLoadingProps } from "@/lib/lazy-loading";

function MyImage({ index }) {
  // 获取图片加载属性
  const loadingProps = getImageLoadingProps(index);
  // loadingProps 包含 priority 和 loading 属性
  // index 为 0 的图片会优先加载

  return <Image src="/image.jpg" {...loadingProps} />;
}
```

## 内置懒加载组件

### 1. LazyImage 组件

```tsx
import { LazyImage } from "@/components/ui/lazy-image";

<LazyImage
  src="/image.jpg"
  alt="描述"
  width={300}
  height={200}
  index={0}                // 图片索引，影响加载优先级
  fadeIn={true}           // 是否启用淡入效果
  fadeInDuration={600}    // 淡入动画持续时间(ms)
  threshold={0.2}         // 可见阈值 0-1
  delayLoad={100}         // 延迟加载时间(ms)
  wrapperClassName=""     // 包装器类名
  placeholderClassName="" // 占位符类名
/>
```

### 2. LazyComponent 组件

```tsx
import { LazyComponent, createLazyComponent } from "@/components/ui/lazy-component";

// 方法 1: 直接使用 LazyComponent
<LazyComponent
  component={() => import("./HeavyComponent")}
  fallback={<div>加载中...</div>}
  fadeIn={true}
  fadeInDuration={500}
  delayLoad={200}
  threshold={0.1}
  className="my-class"
  props={{ prop1: "value1" }}
/>

// 方法 2: 使用 createLazyComponent 创建可重用的懒加载组件
const MyLazyComponent = createLazyComponent(
  () => import("./HeavyComponent"),
  <div>加载中...</div> // 默认加载占位符
);

// 使用创建的懒加载组件
<MyLazyComponent
  prop1="value1"
  fadeIn={true}
  fadeInDuration={500}
  delayLoad={200}
  threshold={0.1}
  className="my-class"
/>
```

## 性能优化最佳实践

1. **合理设置优先级**：首屏内容使用 `index={0}` 设置为优先加载
2. **延迟加载非关键内容**：使用 `delayLoad` 参数错开加载时间，减轻浏览器负担
3. **设置合适的阈值**：`threshold` 值越小，元素越早开始加载，建议值 0.1-0.3
4. **使用渐进式加载**：对于列表内容，使用 `delayLoad={index * 100}` 实现渐进式加载
5. **避免布局偏移**：为懒加载内容预设尺寸，避免加载时的布局偏移

## 注意事项

1. 懒加载组件应该在 `"use client"` 指令下使用，因为它们依赖于客户端交互
2. 对于 SEO 关键内容，考虑不使用懒加载或设置较低的阈值
3. 确保为所有图片设置正确的 `alt` 属性，提高可访问性
4. 使用 `createLazyContainer` 时，确保设置适当的最小高度，避免内容加载时的跳动