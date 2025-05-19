# 渐进式项目重构指南

本文档提供了渐进式重构项目的指南，特别是组件的分类管理。渐进式重构允许我们在不影响项目正常运行的情况下，逐步改进代码结构和组织。

## 重构目标

1. **改进组件分类**：将组件分为 UI、功能和布局三大类
2. **标准化组件结构**：每个组件都有自己的目录和标准文件结构
3. **提高代码质量**：添加类型定义、注释和测试
4. **优化导入路径**：使导入路径更加一致和直观

## 重构工具

我们提供了以下工具脚本来帮助重构过程：

1. **组件审计**：`scripts/component-audit.js`
2. **单个组件重构**：`scripts/restructure-component.js`
3. **批量组件重构**：`scripts/batch-restructure.js`
4. **导入路径更新**：`scripts/update-imports.js`
5. **组件模板生成器**：`scripts/create-component.js`

## 渐进式重构步骤

### 步骤 1：组件审计

首先，运行组件审计脚本，了解当前组件的状态和问题：

```bash
node scripts/component-audit.js
```

这将生成一个审计报告，帮助你了解需要重构的组件和问题。

### 步骤 2：制定重构计划

根据审计报告，制定重构计划。将组件分为几个批次进行重构，每个批次包含相关的组件。例如：

- 批次 1：基础 UI 组件（Button, Card, Dialog 等）
- 批次 2：布局组件（Navbar, Footer, Sidebar 等）
- 批次 3：功能组件（ThemeToggle, SearchBar 等）

### 步骤 3：重构单个组件

对于每个组件，使用重构脚本将其移动到正确的目录结构：

```bash
node scripts/restructure-component.js src/components/Button.tsx ui
```

这将创建以下结构：

```
src/components/ui/button/
  ├── button.tsx
  ├── button.types.ts
  └── index.ts
```

### 步骤 4：批量重构组件

对于相关的组件组，可以使用批量重构脚本：

```bash
# 预演模式，不实际修改文件
node scripts/batch-restructure.js --dry-run --category=ui

# 实际执行重构
node scripts/batch-restructure.js --category=ui
```

### 步骤 5：更新导入路径

重构组件后，需要更新导入这些组件的文件中的导入路径：

```bash
# 预演模式，不实际修改文件
node scripts/update-imports.js --dry-run

# 实际执行更新
node scripts/update-imports.js
```

### 步骤 6：测试和验证

每完成一个批次的重构，都要进行测试和验证，确保项目仍然正常运行：

1. 运行单元测试（如果有）
2. 在开发环境中启动项目
3. 手动测试受影响的功能
4. 修复任何出现的问题

### 步骤 7：提交更改

确认一切正常后，提交更改：

```bash
git add .
git commit -m "refactor: restructure ui components"
```

## 创建新组件

对于新组件，使用组件模板生成器创建符合标准结构的组件：

```bash
# 创建基本组件
node scripts/create-component.js Button ui

# 创建带测试的组件
node scripts/create-component.js SearchBar features --with-test

# 创建带测试和故事的组件
node scripts/create-component.js Navbar layout --with-test --with-story
```

## 最佳实践

### 小步前进

- 一次只重构少量相关组件
- 每次重构后都进行测试和验证
- 发现问题立即修复，不要积累技术债务

### 保持向后兼容

- 在完全迁移之前，保留原始组件文件
- 使用重定向导出，确保现有导入路径仍然有效
- 在确认所有导入都已更新后，再删除原始文件

### 沟通和协作

- 告知团队成员正在进行的重构工作
- 记录重构过程和决策
- 鼓励团队成员遵循新的组件结构标准

## 常见问题

### 如何处理循环依赖？

如果重构导致循环依赖，可以：

1. 将共享逻辑提取到单独的工具函数
2. 重新考虑组件的职责划分
3. 使用依赖注入或上下文API

### 如何处理大型复杂组件？

对于大型复杂组件：

1. 先分析组件的职责
2. 将其拆分为多个小型组件
3. 逐个重构这些小型组件
4. 最后重构主组件

### 如何确保不破坏现有功能？

1. 编写或更新测试
2. 使用预演模式（--dry-run）查看将要进行的更改
3. 在开发环境中彻底测试
4. 逐步推进，而不是一次性大规模更改
