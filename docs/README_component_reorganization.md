# 组件重组指南

## 概述

本项目需要对 `src/components` 目录下的组件进行重新分类和重组，以使其结构更加合理，便于复用，同时确保不影响项目的正常运行。

## 当前问题

经过分析，当前组件结构存在以下问题：

1. **重复的组件和目录**：如 `layout/page-layout.tsx` 和 `layout/page-layout/page-layout.tsx` 同时存在
2. **组件分类不清晰**：缺乏统一的组织方式
3. **导出模式不一致**：有的组件直接导出，有的通过 index.tsx 导出

## 重组文档

我们已经创建了以下文档来指导组件重组过程：

1. [组件重组计划](./component_reorganization_plan.md) - 详细的重组计划和目标
2. [组件重组实施指南](./component_reorganization_implementation.md) - 具体的实施步骤和示例代码

## 重组脚本

我们还提供了一个指导脚本，帮助您按照计划执行重组操作：

- [组件重组脚本](../scripts/reorganize-components.js) - 提供重组步骤的指导（不会自动执行）

## 新的组件结构

重组后，组件将按照以下结构组织：

```
src/components/
├── common/           # 通用组件
├── layout/           # 布局组件
├── features/         # 功能组件
├── content/          # 内容展示组件
│   ├── blog/         # 博客相关组件
│   └── docs/         # 文档相关组件
└── ui/              # 基础UI组件
```

## 实施建议

1. 分阶段实施，每完成一个小步骤就提交代码
2. 保持组件API兼容性，避免破坏现有功能
3. 优先处理重复组件，再调整目录结构
4. 使用IDE的重构功能更新导入路径，减少手动错误
5. 在每个主要步骤后测试项目，确保功能正常

## 执行重组

请按照 [组件重组实施指南](./component_reorganization_implementation.md) 中的步骤执行重组操作。如有任何问题，请参考详细文档或联系项目维护者。