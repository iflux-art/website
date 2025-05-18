# 项目重构实施计划

## 1. 移除所有国际化元素，只保留中文

### 需要执行的操作：

1. **移除多语言路由结构**
   - 删除 `src/app/[lang]` 目录结构，将内容直接放在 `src/app` 下
   - 修改 `src/app/layout.tsx` 中的 `lang` 属性，确保固定为 `zh-Hans`

2. **移除国际化工具和内容**
   - 删除 `src/lib/i18n.ts`（已确认不存在）
   - 删除 `src/content/en` 目录，只保留 `src/content/zh`
   - 删除 `scripts/translate-content.ts` 翻译脚本

3. **移除组件中的国际化逻辑**
   - 修改 `src/components/layout/navbar/nav-items.tsx` 中的 `labelKey` 为直接的中文文本
   - 检查并移除其他组件中的国际化逻辑

## 2. 规范组件命名

### 需要执行的操作：

1. **统一组件命名规范**
   - 所有组件文件使用 kebab-case 命名（如 `theme-toggle.tsx`）
   - 所有组件使用 PascalCase 命名（如 `ThemeToggle`）
   - 移除重复导出和别名导出（如 `ThemeToggle` 和 `ModeToggle`）

2. **修改不规范的组件名称**
   - 检查所有组件名称，确保符合规范
   - 更新所有引用这些组件的地方

## 3. 优化组件目录结构

### 需要执行的操作：

1. **重新组织组件目录**
   - 保持 `ui`、`features`、`layout` 的主要分类
   - 将 `blog`、`docs`、`friends` 等业务组件移至 `features` 下的对应子目录
   - 将 `markdown` 相关组件移至 `ui` 下的 `markdown` 子目录
   - 将 `navigation` 相关组件移至 `layout` 下的 `navigation` 子目录

2. **整理重复或冗余的组件**
   - 合并功能相似的组件
   - 删除未使用的组件

## 4. 统一所有组件的导出方式，使用单独的 index.ts 导出

### 需要执行的操作：

1. **为每个组件目录创建 index.ts 文件**
   - 检查所有组件目录，确保每个目录都有 index.ts 文件
   - 对于没有 index.ts 的目录，创建新的 index.ts 文件

2. **统一导出格式**
   - 使用命名导出（如 `export { Button } from './button'`）
   - 避免默认导出
   - 避免直接导出组件文件（如 `export * from './button'`）

3. **更新根 index.ts**
   - 更新 `src/components/index.ts`，确保正确导出所有组件

## 5. 集中管理类型定义

### 需要执行的操作：

1. **整理现有类型定义**
   - 检查 `src/types` 目录下的类型定义
   - 收集分散在各个组件文件中的类型定义

2. **创建分类明确的类型文件**
   - 按功能和用途分类创建类型文件（如 `ui-types.ts`、`feature-types.ts` 等）
   - 将相关类型移至对应文件

3. **更新类型导入**
   - 更新所有组件中的类型导入，指向集中管理的类型文件

## 6. 增强 ESLint 配置

### 需要执行的操作：

1. **更新 ESLint 配置文件**
   - 增强 `eslint.config.mjs` 中的规则
   - 添加更多针对 React、TypeScript 和可访问性的规则

2. **添加 Prettier 集成**
   - 确保 ESLint 和 Prettier 配置不冲突
   - 添加 Prettier 相关插件

3. **添加自定义规则**
   - 添加项目特定的自定义规则
   - 确保规则符合项目的代码风格要求

## 实施顺序

为了确保重构过程顺利进行，建议按以下顺序执行上述操作：

1. 首先增强 ESLint 配置，为后续重构提供规范指导
2. 移除国际化元素，简化项目结构
3. 集中管理类型定义，为组件重构提供类型支持
4. 规范组件命名，为目录结构优化做准备
5. 优化组件目录结构，重新组织组件
6. 统一组件导出方式，完成最终的代码规范化

每个步骤完成后，应该运行测试和构建，确保项目正常运行。