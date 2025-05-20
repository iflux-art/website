# 性能优化指南

## 1. 性能优化目标

本指南详细说明如何优化项目性能，提升用户体验，减少加载时间和交互延迟。

### 1.1 主要目标

- **减少首屏加载时间**：优化初始加载性能
- **提高交互响应速度**：减少交互延迟
- **优化资源加载**：减少资源大小和加载时间
- **提升渲染性能**：优化组件渲染效率

### 1.2 性能指标

我们将关注以下核心性能指标：

- **FCP (First Contentful Paint)**：首次内容绘制时间 < 1.8秒
- **LCP (Largest Contentful Paint)**：最大内容绘制时间 < 2.5秒
- **TTI (Time to Interactive)**：可交互时间 < 3.8秒
- **TBT (Total Blocking Time)**：总阻塞时间 < 200毫秒
- **CLS (Cumulative Layout Shift)**：累积布局偏移 < 0.1

## 2. Next.js 性能优化

### 2.1 路由和页面优化

#### 2.1.1 App Router 优化

- 使用 Next.js 15 的 App Router 架构
- 实现路由级别的代码分割
- 利用并行路由提高加载效率

```tsx
// 示例：使用并行路由
// app/layout.tsx
export default function Layout({ children, dashboard }) {
  return (
    <div className="container">
      <main>{children}</main>
      <aside>{dashboard}</aside>
    </div>
  );
}
```

#### 2.1.2 静态生成与增量静态再生成

- 尽可能使用静态生成 (SSG)
- 对于需要频繁更新的页面，使用增量静态再生成 (ISR)

```tsx
// 示例：使用ISR
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 每小时重新验证一次

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  return <BlogPostComponent post={post} />;
}
```

### 2.2 图片优化

#### 2.2.1 使用 Next.js Image 组件

- 替换所有 `<img>` 标签为 `<Image>` 组件
- 配置适当的图片尺寸和质量
- 启用图片自动优化

```tsx
// 示例：使用Next.js Image组件
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority={true} // 对于LCP图片设置优先级
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

#### 2.2.2 响应式图片

- 使用 `sizes` 属性配置响应式图片
- 为不同设备提供不同尺寸的图片

```tsx
// 示例：响应式图片
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>
```

### 2.3 字体优化

#### 2.3.1 使用 next/font

- 使用 `next/font` 加载和优化字体
- 启用字体子集化
- 实现字体预加载

```tsx
// 示例：使用next/font
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hans" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

## 3. React 性能优化

### 3.1 组件优化

#### 3.1.1 组件懒加载

- 使用 `React.lazy` 和 `Suspense` 懒加载组件
- 对大型组件和不在首屏的组件应用懒加载

```tsx
// 示例：组件懒加载
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/heavy-component'));

export function LazyLoadedSection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

#### 3.1.2 组件记忆化

- 使用 `React.memo` 记忆化组件
- 使用 `useMemo` 和 `useCallback` 优化计算和回调

```tsx
// 示例：组件记忆化
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onAction }) {
  // 组件实现
  return <div>{/* 内容 */}</div>;
});

export function ParentComponent() {
  const data = useMemo(() => processData(rawData), [rawData]);
  const handleAction = useCallback(() => {
    // 处理操作
  }, []);

  return <ExpensiveComponent data={data} onAction={handleAction} />;
}
```

### 3.2 状态管理优化

#### 3.2.1 状态分割

- 将全局状态分割为更小的独立状态
- 避免不必要的组件重新渲染

```tsx
// 示例：状态分割
// 不好的做法
const [state, setState] = useState({ user: null, posts: [], comments: [] });

// 好的做法
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [comments, setComments] = useState([]);
```

#### 3.2.2 使用 Context 优化

- 创建多个专用 Context 而非单一大型 Context
- 使用 Context 选择器减少重新渲染

```tsx
// 示例：优化Context
// context.tsx
export const UserContext = createContext(null);
export const PostsContext = createContext(null);

// app.tsx
export function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  return (
    <UserContext.Provider value={user}>
      <PostsContext.Provider value={posts}>
        <MainContent />
      </PostsContext.Provider>
    </UserContext.Provider>
  );
}
```

## 4. JavaScript 和 CSS 优化

### 4.1 JavaScript 优化

#### 4.1.1 代码分割

- 使用动态导入分割代码
- 配置 webpack 优化分包策略

```tsx
// 示例：动态导入
const DynamicChart = dynamic(() => import('@/components/chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // 对于客户端组件禁用SSR
});
```

#### 4.1.2 Tree Shaking

- 使用 ES 模块语法启用 tree shaking
- 避免导入整个库，只导入需要的部分

```tsx
// 不好的做法
import * as LucideIcons from 'lucide-react';

// 好的做法
import { Home, Settings, User } from 'lucide-react';
```

### 4.2 CSS 优化

#### 4.2.1 TailwindCSS 优化

- 配置 TailwindCSS 的 purge 选项移除未使用的样式
- 使用 JIT 模式减少 CSS 文件大小

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  // 其他配置
};
```

#### 4.2.2 CSS 加载优化

- 使用 CSS Modules 或 CSS-in-JS 实现样式隔离
- 避免全局 CSS，减少样式冲突

## 5. 资源加载优化

### 5.1 预加载和预获取

- 使用 `<link rel="preload">` 预加载关键资源
- 使用 `<link rel="prefetch">` 预获取未来可能需要的资源

```tsx
// 示例：在Next.js中预加载资源
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hans">
      <head>
        <link
          rel="preload"
          href="/fonts/custom-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 5.2 资源压缩和缓存

- 启用 Gzip 或 Brotli 压缩
- 配置适当的缓存策略
- 使用内容哈希实现长期缓存

## 6. 服务器端优化

### 6.1 API 路由优化

- 实现 API 路由缓存
- 优化数据获取逻辑

```tsx
// 示例：API路由缓存
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // 缓存1小时

export async function GET() {
  const posts = await fetchPosts();
  return NextResponse.json(posts);
}
```

### 6.2 数据预取和缓存

- 使用 React Server Components 减少客户端 JavaScript
- 实现数据缓存策略

```tsx
// 示例：使用React Server Components
// app/posts/page.tsx
export const revalidate = 3600;

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 7. 性能监控和分析

### 7.1 性能监控工具

- 使用 Lighthouse 进行性能审计
- 集成 Web Vitals 监控
- 使用 Chrome DevTools 分析性能瓶颈

### 7.2 性能分析流程

1. 建立性能基准
2. 识别性能瓶颈
3. 实施优化措施
4. 测量优化效果
5. 持续监控和改进

## 8. 实施计划

### 8.1 优先级排序

1. **高优先级**：
   - 图片优化
   - 组件懒加载
   - 关键路径CSS优化

2. **中优先级**：
   - 状态管理优化
   - JavaScript代码分割
   - 服务器端优化

3. **低优先级**：
   - 预加载和预获取
   - 高级缓存策略
   - 性能监控系统

### 8.2 实施步骤

1. 进行性能基准测试
2. 实施高优先级优化
3. 测量优化效果
4. 实施中优先级优化
5. 再次测量优化效果
6. 实施低优先级优化
7. 建立持续性能监控

## 9. 结论

通过实施本指南中的性能优化策略，我们可以显著提升应用性能，改善用户体验。性能优化是一个持续的过程，我们应该定期评估和改进应用性能，确保它始终保持在最佳状态。
