# 网址解析功能模块

## 概述

这个模块集中管理所有与网址解析相关的功能，包括：

- 网站元数据解析
- URL 验证和标准化
- 图标和预览图生成
- React Hooks 集成

## 功能特性

### 核心功能

- **网站元数据解析**: 自动提取网站标题、描述、图标等信息
- **URL 验证**: 验证 URL 格式的有效性
- **错误处理**: 提供降级方案，确保功能稳定性
- **缓存支持**: API 层面支持缓存，提高性能
- **重试机制**: 网络请求失败时自动重试

### React 集成

- **useWebsiteParser Hook**: 提供 React 组件中使用的便捷接口
- **加载状态管理**: 自动管理解析过程中的加载状态
- **错误状态处理**: 统一的错误处理和状态管理

## 使用方法

### 基础使用

```typescript
import { parseWebsiteMetadata, isValidUrl } from "@/features/website-parser";

// 验证 URL
if (isValidUrl(url)) {
  // 解析网站元数据
  const result = await parseWebsiteMetadata(url);

  if (result.success) {
    console.log("网站信息:", result.data);
  } else {
    console.error("解析失败:", result.error);
  }
}
```

### React Hook 使用

```typescript
import { useWebsiteParser } from '@/features/website-parser';

function MyComponent() {
  const { parseWebsite, isLoading, error, lastResult } = useWebsiteParser();

  const handleParse = async () => {
    const metadata = await parseWebsite(url);
    if (metadata) {
      // 使用解析结果
      console.log(metadata);
    }
  };

  return (
    <div>
      <button onClick={handleParse} disabled={isLoading}>
        {isLoading ? '解析中...' : '解析网站'}
      </button>
      {error && <div>错误: {error}</div>}
      {lastResult && <div>标题: {lastResult.title}</div>}
    </div>
  );
}
```

## API 参考

### 类型定义

```typescript
interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  author?: string;
  siteName?: string;
  type?: string;
  url?: string;
  language?: string;
}

interface ParseOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  userAgent?: string;
}
```

### 主要函数

- `parseWebsiteMetadata(url, options?)`: 解析网站元数据
- `isValidUrl(url)`: 验证 URL 格式
- `normalizeUrl(url)`: 标准化 URL
- `extractDomainName(url)`: 提取域名
- `generateFaviconUrl(url)`: 生成图标 URL

## 迁移指南

### 从旧版本迁移

如果你之前使用的是 `@/utils/website-parser`，现在可以直接替换为：

```typescript
// 旧版本
import { parseWebsiteMetadata } from "@/utils/website-parser";

// 新版本
import { parseWebsiteMetadata } from "@/features/website-parser";
```

### 向后兼容

为了保持向后兼容性，`@/utils/index.ts` 中仍然导出了这些功能，但建议新代码直接使用新的模块路径。

## 配置

### 默认配置

```typescript
const DEFAULT_OPTIONS = {
  timeout: 10000, // 10秒超时
  retries: 3, // 重试3次
  retryDelay: 1000, // 重试间隔1秒
  userAgent: "Mozilla/5.0 ...", // 默认 User-Agent
};
```

### 自定义配置

```typescript
const result = await parseWebsiteMetadata(url, {
  timeout: 5000,
  retries: 1,
  retryDelay: 500,
});
```

## 错误处理

模块提供了完善的错误处理机制：

1. **URL 验证错误**: 返回格式错误信息
2. **网络请求错误**: 提供降级数据
3. **解析错误**: 返回基础域名信息
4. **超时错误**: 自动重试机制

## 性能优化

- **API 缓存**: 服务端缓存解析结果30分钟
- **请求去重**: 避免重复请求相同 URL
- **超时控制**: 防止长时间等待
- **降级方案**: 确保始终有可用数据

## 扩展性

模块设计考虑了扩展性：

- **插件化架构**: 可以轻松添加新的解析器
- **配置化选项**: 支持自定义解析行为
- **类型安全**: 完整的 TypeScript 类型定义
- **测试友好**: 易于单元测试和集成测试
