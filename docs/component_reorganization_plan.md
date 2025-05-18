# 组件重组计划

## 当前问题

经过分析，当前项目组件结构存在以下问题：

1. 组件结构混乱，存在重复目录和文件
   - 例如：`layout/page-layout.tsx` 和 `layout/page-layout/page-layout.tsx` 同时存在
   - 多个组件同时存在于根目录和子目录中（如 `features/search.tsx` 和 `features/search/search-dialog.tsx`）

2. 组件分类不够清晰，不利于复用
   - 部分功能组件混合在一起，没有按照功能或用途分类
   - 缺乏统一的组件导出模式

## 重组目标

1. 建立清晰的组件分类结构
2. 消除重复组件和目录
3. 统一组件导出模式
4. 确保重组不影响现有功能

## 组件分类方案

将组件重新分类为以下几个主要目录：

1. **common** - 通用组件
   - 跨多个功能区域使用的组件
   - 例如：`Avatar`、`Card`、`Button` 等基础UI组件

2. **layout** - 布局组件
   - 页面结构相关组件
   - 例如：`Navbar`、`Footer`、`PageLayout` 等

3. **features** - 功能组件
   - 特定功能的组件
   - 例如：`LanguageToggle`、`ThemeToggle`、`Search` 等

4. **content** - 内容展示组件
   - 博客、文档等内容展示相关组件
   - 例如：`PostCard`、`AuthorCard`、`TOC` 等

5. **ui** - 基础UI组件
   - 基于ShadcnUI的基础组件
   - 例如：`Button`、`Dialog`、`Sheet` 等

## 具体重组步骤

### 1. 统一组件导出模式

对于每个组件目录，采用以下导出模式：

- 每个组件在自己的目录中有一个主文件（与目录同名）
- 使用 `index.tsx` 统一导出组件

### 3. 重新组织目录结构

```
src/components/
├── common/           # 通用组件
│   ├── avatar/
│   └── card/
├── layout/           # 布局组件
│   ├── footer/
│   ├── navbar/
│   └── page-layout/
├── features/         # 功能组件
│   ├── language-toggle/
│   ├── search/
│   ├── theme-toggle/
│   └── travelling/
├── content/          # 内容展示组件
│   ├── blog/         # 博客相关组件
│   │   ├── post-card/
│   │   ├── author-card/
│   │   └── toc/
│   └── docs/         # 文档相关组件
│       ├── sidebar/
│       └── toc/
└── ui/              # 基础UI组件
    ├── button/
    ├── dialog/
    └── sheet/
```

## 实施注意事项

1. 确保更新所有组件引用路径
2. 保持组件API兼容性，避免破坏现有功能
3. 对于合并的组件，保留更完整的实现版本
4. 分阶段实施，先处理重复组件，再调整目录结构
5. 每个阶段后进行测试，确保功能正常

## 预期收益

1. 提高代码可维护性
2. 增强组件复用性
3. 简化开发流程
4. 提高项目可扩展性