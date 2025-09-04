# 搜索功能模块

## 概述

这个模块集中管理所有搜索相关的功能，包括：

- 全站内容搜索
- 搜索结果处理
- 搜索建议
- React Hooks 集成

## 功能特性

### 核心功能

- **多类型搜索**: 支持链接、博客、文档的统一搜索
- **智能匹配**: 基于标题、描述、标签的模糊匹配
- **结果排序**: 按匹配度自动排序搜索结果
- **类型过滤**: 支持按内容类型过滤搜索结果

### React 集成

- **useSearch Hook**: 提供 React 组件中使用的便捷接口
- **加载状态管理**: 自动管理搜索过程中的加载状态
- **错误状态处理**: 统一的错误处理和状态管理
- **搜索建议**: 支持搜索建议功能（可扩展）

## 使用方法

### 基础使用

```typescript
import { performSearch } from '@/features/search';

// 执行搜索
const result = await performSearch('React', {
  type: 'all',
  limit: 10,
});

console.log('搜索结果:', result.results);
```

### React Hook 使用

```typescript
import { useSearch } from '@/features/search';

function SearchComponent() {
  const { search, results, isLoading, error, query } = useSearch();

  const handleSearch = async (searchQuery: string) => {
    await search(searchQuery, { type: 'all', limit: 10 });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />

      {isLoading && <div>搜索中...</div>}
      {error && <div>错误: {error}</div>}

      <div>
        {results.map((result, index) => (
          <div key={index}>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            <span>类型: {result.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API 参考

### 类型定义

```typescript
interface SearchResult {
  type: 'link' | 'blog' | 'doc';
  title: string;
  description?: string;
  url?: string;
  path?: string;
  tags?: string[];
}

interface SearchOptions {
  type?: 'all' | 'links' | 'blog' | 'doc';
  limit?: number;
  includeContent?: boolean;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  type: string;
}
```

### 主要函数

- `performSearch(query, options?)`: 执行搜索
- `getSearchSuggestions(query, limit?)`: 获取搜索建议
- `highlightSearchTerm(text, searchTerm)`: 高亮搜索关键词

## 搜索类型

### 支持的内容类型

1. **链接 (links)**: 搜索链接收藏中的网站
2. **博客 (blog)**: 搜索博客文章
3. **文档 (doc)**: 搜索文档内容
4. **全部 (all)**: 搜索所有类型的内容

### 搜索范围

- **标题匹配**: 优先匹配标题中的关键词
- **描述匹配**: 匹配描述中的关键词
- **标签匹配**: 匹配标签中的关键词
- **内容匹配**: 可选的全文内容匹配

## 配置选项

### 默认配置

```typescript
const defaultOptions = {
  type: 'all',
  limit: 10,
  includeContent: false,
};
```

### 自定义搜索

```typescript
// 只搜索博客文章
await search('React', { type: 'blog', limit: 5 });

// 搜索链接，包含内容
await search('JavaScript', {
  type: 'links',
  limit: 20,
  includeContent: true,
});
```

## 性能优化

- **缓存机制**: 内容缓存5分钟，减少重复加载
- **结果限制**: 默认限制返回结果数量
- **智能排序**: 按匹配度排序，提高相关性
- **异步加载**: 非阻塞的搜索执行

## 扩展功能

### 搜索建议

```typescript
import { getSearchSuggestions } from '@/features/search';

const suggestions = await getSearchSuggestions('Rea', 5);
// 返回: ['React', 'Redux', 'React Native', ...]
```

### 关键词高亮

```typescript
import { highlightSearchTerm } from '@/features/search';

const highlighted = highlightSearchTerm('React is a JavaScript library', 'React');
// 返回: '<mark>React</mark> is a JavaScript library'
```

## 错误处理

模块提供了完善的错误处理：

1. **网络错误**: 自动处理 API 请求失败
2. **空查询**: 返回空结果而不是错误
3. **无效参数**: 使用默认值处理无效参数
4. **服务器错误**: 提供友好的错误信息

## 集成指南

### 与现有 API 集成

搜索功能使用现有的 `/api/search` 端点：

```typescript
// API 调用示例
GET /api/search?q=React&type=all&limit=10
```

### 数据源

搜索功能整合了以下数据源：

- **博客数据**: 来自 `src/content/blog/**/*.mdx`
- **文档数据**: 来自 `src/content/docs/**/*.mdx`

## 未来扩展

计划中的功能扩展：

1. **全文搜索**: 支持 MDX 文件内容搜索
2. **搜索历史**: 记录和管理搜索历史
3. **高级过滤**: 支持日期、作者等高级过滤
4. **搜索分析**: 搜索行为分析和优化
5. **实时搜索**: 输入时实时显示结果
