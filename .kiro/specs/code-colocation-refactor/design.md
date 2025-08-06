# 设计文档

## 概述

本设计文档详细描述了如何对整个项目进行极致的代码就近管理（colocation）重构。通过分析当前的代码结构和依赖关系，我们将制定一个系统性的方案，将所有只属于特定页面或组件的代码迁移到对应的内部，实现每个页面和组件的完全独立性。

### 当前项目结构分析

项目采用 Next.js App Router 架构，主要包含：

- `src/app/` - 页面路由（约 15+ 个页面和 API 路由）
- `src/components/` - 组件库（约 50+ 个组件，分为 10 个主要类别）
- `src/types/` - 全局类型定义（9 个类型文件）
- `src/utils/` - 全局工具函数（3 个工具文件）
- `src/lib/` - 全局库函数（6 个库文件）
- `src/config/` - 全局配置（4 个配置文件）
- `src/hooks/` - 全局 hooks（20+ 个 hook 文件）

### 重构目标

1. **页面独立性**：每个 `src/app` 下的页面只依赖自己内部的代码和真正共享的全局代码
2. **组件独立性**：每个 `src/components` 下的组件只依赖自己内部的代码和真正共享的全局代码
3. **最小化全局依赖**：只保留真正被多个不相关模块使用的代码在全局目录
4. **代码就近原则**：相关代码放在一起，提高可维护性

## 架构

### 重构后的目录结构

#### 页面结构（以 blog 页面为例）

```
src/app/blog/
├── page.tsx                 # 主页面组件
├── [...slug]/
│   ├── page.tsx            # 动态路由页面
│   ├── types.ts            # 页面特定类型
│   ├── utils.ts            # 页面特定工具函数
│   └── hooks.ts            # 页面特定 hooks
├── tags/
│   └── page.tsx
├── types.ts                # blog 相关类型
├── utils.ts                # blog 相关工具函数
├── hooks.ts                # blog 相关 hooks
└── config.ts               # blog 相关配置
```

#### 组件结构（以 admin 组件为例）

```
src/components/admin/
├── admin-layout.tsx        # 主组件
├── admin-actions.tsx       # 子组件
├── admin-menu.tsx          # 子组件
├── types.ts                # admin 组件特定类型
├── utils.ts                # admin 组件特定工具函数
├── hooks.ts                # admin 组件特定 hooks
└── config.ts               # admin 组件特定配置
```

#### 保留的全局结构

```
src/
├── types/
│   └── shared-types.ts     # 真正共享的类型
├── utils/
│   └── shared-utils.ts     # 真正共享的工具函数
├── lib/
│   └── shared-lib.ts       # 真正共享的库函数
├── config/
│   └── shared-config.ts    # 真正共享的配置
└── hooks/
    └── shared-hooks.ts     # 真正共享的 hooks
```

### 依赖分析策略

#### 1. 使用频率分析

- **单一使用**：只被一个页面或组件使用的代码 → 迁移到对应内部
- **局部共享**：只被同一页面/组件目录下多个文件使用 → 迁移到目录内部
- **真正共享**：被多个不相关页面/组件使用 → 保留在全局

#### 2. 依赖关系映射

基于当前分析，主要依赖关系包括：

- **类型依赖**：`@/types/*` 被广泛使用
- **工具函数依赖**：`@/utils/*` 主要是 `cn` 函数被 UI 组件大量使用
- **配置依赖**：`@/config/*` 被页面和组件使用
- **Hooks 依赖**：`@/hooks/*` 被页面组件使用
- **库函数依赖**：`@/lib/*` 被页面和 API 路由使用

## 组件和接口

### 1. 依赖分析器（Dependency Analyzer）

```typescript
interface DependencyAnalyzer {
  // 分析文件的导入依赖
  analyzeImports(filePath: string): ImportDependency[];

  // 分析全局目录中每个文件的使用情况
  analyzeGlobalUsage(globalDir: string): UsageMap;

  // 确定哪些代码应该迁移
  determineColocationCandidates(): ColocationPlan;
}

interface ImportDependency {
  source: string; // 导入源路径
  imports: string[]; // 导入的具体内容
  filePath: string; // 使用该导入的文件路径
}

interface UsageMap {
  [fileName: string]: {
    usedBy: string[]; // 使用该文件的所有文件路径
    exports: string[]; // 该文件导出的内容
    canRelocate: boolean; // 是否可以重新定位
  };
}
```

### 2. 代码迁移器（Code Migrator）

```typescript
interface CodeMigrator {
  // 迁移类型定义
  migrateTypes(plan: TypeMigrationPlan): MigrationResult;

  // 迁移工具函数
  migrateUtils(plan: UtilsMigrationPlan): MigrationResult;

  // 迁移配置
  migrateConfig(plan: ConfigMigrationPlan): MigrationResult;

  // 迁移 hooks
  migrateHooks(plan: HooksMigrationPlan): MigrationResult;

  // 迁移库函数
  migrateLib(plan: LibMigrationPlan): MigrationResult;
}

interface MigrationPlan {
  sourceFile: string; // 源文件路径
  targetLocation: string; // 目标位置
  exports: string[]; // 要迁移的导出内容
  affectedFiles: string[]; // 受影响的文件列表
}
```

### 3. 导入更新器（Import Updater）

```typescript
interface ImportUpdater {
  // 更新文件中的导入语句
  updateImports(filePath: string, importMap: ImportMap): void;

  // 批量更新多个文件的导入
  batchUpdateImports(updatePlan: ImportUpdatePlan[]): void;

  // 验证导入更新的正确性
  validateImports(filePaths: string[]): ValidationResult;
}

interface ImportMap {
  [oldImportPath: string]: string; // 新的导入路径
}
```

## 数据模型

### 1. 文件分类模型

```typescript
enum FileCategory {
  PAGE = "page",
  COMPONENT = "component",
  API_ROUTE = "api-route",
  GLOBAL_SHARED = "global-shared",
}

interface FileInfo {
  path: string;
  category: FileCategory;
  dependencies: string[];
  exports: string[];
  parentModule?: string; // 所属的页面或组件模块
}
```

### 2. 迁移计划模型

```typescript
interface ColocationPlan {
  typeMigrations: TypeMigrationPlan[];
  utilsMigrations: UtilsMigrationPlan[];
  configMigrations: ConfigMigrationPlan[];
  hooksMigrations: HooksMigrationPlan[];
  libMigrations: LibMigrationPlan[];
}

interface BaseMigrationPlan {
  sourceFile: string;
  targetLocation: string;
  exports: string[];
  strategy: MigrationStrategy;
}

enum MigrationStrategy {
  INLINE = "inline", // 内联到使用文件中
  LOCAL_FILE = "local-file", // 创建本地文件
  KEEP_GLOBAL = "keep-global", // 保留在全局
}
```

## 错误处理

### 1. 依赖循环检测

- 检测并报告可能的循环依赖
- 提供解决循环依赖的建议

### 2. 类型检查验证

- 在每次迁移后运行 TypeScript 类型检查
- 确保所有类型引用正确解析

### 3. 导入路径验证

- 验证所有导入路径的有效性
- 检测并修复损坏的导入引用

### 4. 回滚机制

- 为每个迁移步骤创建备份
- 提供快速回滚到之前状态的能力

## 测试策略

### 1. 单元测试保持

- 确保所有现有单元测试在重构后仍然通过
- 更新测试文件中的导入路径

### 2. 集成测试验证

- 运行完整的应用程序测试套件
- 验证页面和组件功能完整性

### 3. 构建验证

- 确保 Next.js 构建过程成功
- 验证生产构建的正确性

### 4. 类型检查

- 运行 TypeScript 编译器检查
- 确保没有类型错误

## 实施阶段

### 阶段 1：依赖分析和计划制定

1. 分析所有文件的导入依赖关系
2. 识别可以重新定位的代码
3. 制定详细的迁移计划
4. 创建迁移优先级排序

### 阶段 2：类型定义迁移

1. 迁移页面特定的类型定义
2. 迁移组件特定的类型定义
3. 更新所有相关的导入引用
4. 验证类型检查通过

### 阶段 3：工具函数迁移

1. 分析工具函数的使用模式
2. 迁移页面和组件特定的工具函数
3. 处理 `cn` 函数等高频使用的工具
4. 更新导入引用

### 阶段 4：配置和 Hooks 迁移

1. 迁移页面特定的配置
2. 迁移组件特定的配置
3. 迁移页面和组件特定的 hooks
4. 更新所有相关引用

### 阶段 5：库函数迁移

1. 迁移页面特定的库函数
2. 迁移组件特定的库函数
3. 保留真正共享的库函数
4. 最终验证和清理

### 阶段 6：验证和优化

1. 运行完整的测试套件
2. 执行类型检查和构建验证
3. 性能测试和优化
4. 文档更新

## 特殊考虑

### 1. 高频使用的工具函数

- `cn` 函数被大量 UI 组件使用，考虑保留在全局或创建多个副本
- 日期格式化、文本处理等通用工具函数的处理策略

### 2. 类型定义的层次结构

- 基础类型定义的继承关系处理
- 避免类型定义的重复和不一致

### 3. API 路由的特殊性

- API 路由可能需要特殊的处理策略
- 考虑 API 路由与页面组件的关联性

### 4. 第三方库集成

- 确保第三方库的集成不受影响
- 处理可能的路径解析问题

## 性能影响

### 1. 构建时间

- 重构可能影响 TypeScript 编译时间
- 优化导入路径以减少编译开销

### 2. 运行时性能

- 代码分割和懒加载的影响
- 确保重构不影响应用性能

### 3. 开发体验

- IDE 的智能提示和导航功能
- 热重载和开发服务器性能

## 维护和扩展

### 1. 新代码的组织原则

- 建立代码就近管理的开发规范
- 提供代码组织的最佳实践指南

### 2. 持续重构

- 定期审查和优化代码组织
- 自动化工具来维护代码结构

### 3. 团队协作

- 更新开发流程和代码审查标准
- 培训团队成员新的代码组织方式
