# 模态对话框状态管理系统

本文档介绍了博客分类和标签模态对话框的状态管理系统，包括相关的 Hooks 和使用方法。

## 概述

模态对话框状态管理系统由以下几个 Hooks 组成：

1. **`useModal`** - 基础模态对话框状态管理
2. **`useModalWithFilter`** - 结合文章筛选的模态对话框管理
3. **`useModalErrorHandler`** - 错误处理工具
4. **`useArticleFilter`** - 文章筛选逻辑（已存在）

## Hooks 详细说明

### useModal

基础的模态对话框状态管理 Hook，提供模态对话框的开启、关闭和状态管理功能。

#### 功能特性

- 管理模态对话框的打开/关闭状态
- 管理当前选中的分类或标签信息
- 处理模态对话框标题的动态更新
- 实现错误状态的处理和显示
- 支持分类和标签的专门处理方法

#### 接口定义

```typescript
interface ModalState {
  isOpen: boolean;
  title: string;
  posts: BlogPost[];
  isLoading: boolean;
  error?: string;
  selectedCategory?: string;
  selectedTag?: string;
  filterType?: "category" | "tag";
}

interface UseModalReturn {
  modalState: ModalState;
  openModal: (title: string, posts: BlogPost[]) => void;
  openCategoryModal: (category: string, posts: BlogPost[]) => void;
  openTagModal: (tag: string, posts: BlogPost[]) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
  updatePosts: (posts: BlogPost[]) => void;
}
```

#### 使用示例

```typescript
import { useModal } from '@/hooks';

function CategoryPage() {
  const {
    modalState,
    openCategoryModal,
    closeModal,
    setLoading,
    setError,
  } = useModal();

  const handleCategoryClick = async (category: string) => {
    try {
      setLoading(true);
      const posts = await fetchPostsByCategory(category);
      openCategoryModal(category, posts);
    } catch (error) {
      setError('加载分类文章失败');
    }
  };

  return (
    <div>
      {/* 分类按钮 */}
      <button onClick={() => handleCategoryClick('技术')}>
        技术分类
      </button>

      {/* 模态对话框 */}
      {modalState.isOpen && (
        <Modal
          title={modalState.title}
          posts={modalState.posts}
          isLoading={modalState.isLoading}
          error={modalState.error}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
```

### useModalWithFilter

结合模态对话框和文章筛选功能的复合 Hook，提供一体化的解决方案。

#### 功能特性

- 集成模态对话框状态管理和文章筛选功能
- 自动处理筛选过程中的加载状态
- 统一的错误处理机制
- 智能缓存管理
- 动态标题更新

#### 接口定义

```typescript
interface UseModalWithFilterReturn {
  // Modal state
  modalState: ModalState;
  closeModal: () => void;
  clearError: () => void;

  // Filter actions
  openCategoryModal: (category: string, allPosts: BlogPost[]) => void;
  openTagModal: (tag: string, allPosts: BlogPost[]) => void;

  // Filter state
  isFiltering: boolean;
  cacheStats: {
    size: number;
    hitRate: number;
  };
  clearFilterCache: () => void;
}
```

#### 使用示例

```typescript
import { useModalWithFilter } from '@/hooks';

function BlogPage() {
  const {
    modalState,
    openCategoryModal,
    openTagModal,
    closeModal,
    isFiltering,
    cacheStats,
  } = useModalWithFilter();

  const allPosts = useBlogPosts(); // 假设这是获取所有文章的 Hook

  return (
    <div>
      {/* 分类按钮 */}
      <button onClick={() => openCategoryModal('技术', allPosts)}>
        技术分类
      </button>

      {/* 标签按钮 */}
      <button onClick={() => openTagModal('React', allPosts)}>
        React 标签
      </button>

      {/* 缓存信息 */}
      <div>
        缓存大小: {cacheStats.size}
        命中率: {(cacheStats.hitRate * 100).toFixed(1)}%
        {isFiltering && <span>筛选中...</span>}
      </div>

      {/* 模态对话框 */}
      {modalState.isOpen && (
        <ArticleModal
          modalState={modalState}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
```

### useModalErrorHandler

专门用于处理模态对话框错误的工具 Hook。

#### 功能特性

- 统一的错误类型定义和处理
- 用户友好的错误信息生成
- 错误重试机制支持
- 本地化错误消息

#### 错误类型

```typescript
interface ModalError {
  type: "network" | "filter" | "data" | "timeout" | "unknown";
  message: string;
  details?: string;
  retryable: boolean;
}
```

#### 使用示例

```typescript
import { useModalErrorHandler } from "@/hooks";

function ErrorHandlingExample() {
  const { createError, getErrorMessage, getRetryMessage, isRetryable } =
    useModalErrorHandler();

  const handleNetworkError = () => {
    const error = createError("network", "连接超时");
    const message = getErrorMessage(error); // "网络连接失败，请检查网络后重试: 连接超时"
    const retryMessage = getRetryMessage(error); // "点击重试重新加载"
    const canRetry = isRetryable(error); // true

    // 显示错误信息和重试按钮
    showErrorDialog(message, canRetry ? retryMessage : "");
  };
}
```

## 最佳实践

### 1. 错误处理

```typescript
const handleCategoryClick = async (category: string) => {
  const { createError, getErrorMessage } = useModalErrorHandler();

  try {
    setLoading(true);
    const posts = await fetchPostsByCategory(category);
    openCategoryModal(category, posts);
  } catch (error) {
    const modalError = createError("network", error.message);
    setError(getErrorMessage(modalError));
  }
};
```

### 2. 缓存管理

```typescript
// 定期清理缓存
useEffect(() => {
  const interval = setInterval(() => {
    if (cacheStats.size > 100) {
      clearFilterCache();
    }
  }, 300000); // 每5分钟检查一次

  return () => clearInterval(interval);
}, [cacheStats.size, clearFilterCache]);
```

### 3. 性能优化

```typescript
// 使用 useMemo 优化分类和标签列表
const categories = useMemo(() => {
  return Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  );
}, [posts]);

const tags = useMemo(() => {
  const allTags = posts.flatMap((post) => post.tags || []);
  return Array.from(new Set(allTags));
}, [posts]);
```

### 4. 可访问性

```typescript
// 确保模态对话框的可访问性
const handleKeyDown = useCallback(
  (event: KeyboardEvent) => {
    if (event.key === "Escape" && modalState.isOpen) {
      closeModal();
    }
  },
  [modalState.isOpen, closeModal],
);

useEffect(() => {
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [handleKeyDown]);
```

## 测试

系统包含完整的单元测试，覆盖以下场景：

- 模态对话框状态的正确初始化
- 分类和标签模态对话框的打开
- 错误状态的处理
- 加载状态的管理
- 文章列表的更新
- 错误处理工具的功能

运行测试：

```bash
npm test -- --run src/hooks/__tests__/use-modal.test.ts
npm test -- --run src/hooks/__tests__/use-modal-error-handler.test.ts
```

## 示例组件

查看 `src/hooks/examples/modal-state-example.tsx` 文件，了解完整的使用示例。

## 相关需求

此实现满足以下需求：

- **需求 1.4**: 分类按钮点击后关闭对话框并返回分类选择页面
- **需求 2.4**: 标签点击后关闭对话框并返回标签选择页面
- **需求 5.4**: 文章数据未缓存时显示加载状态指示器
- **需求 5.5**: 快速切换分类/标签时取消之前的请求避免竞态条件

## 注意事项

1. **内存管理**: 缓存会自动清理，但在大量使用时建议手动清理
2. **错误边界**: 建议在组件树中添加错误边界来捕获未处理的错误
3. **性能监控**: 可以通过 `cacheStats` 监控缓存性能
4. **类型安全**: 所有 Hooks 都提供完整的 TypeScript 类型支持
