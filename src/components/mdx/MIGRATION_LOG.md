# 组件迁移日志

## 2025-06-08 组件迁移

### 已移动到 UI 目录的组件
1. heading-with-anchor.tsx
   - 状态：已移至备份目录
   - 原因：与 UI 目录中的版本重复
   - 主要变化：无功能变化

2. markdown-renderer.tsx
   - 状态：待移动
   - 原因：与 UI 目录中的版本重复
   - 主要变化：导入路径从 components/cards/ 更新为 components/ui/

3. mdx-content-wrapper.tsx
   - 状态：待移动
   - 原因：与 UI 目录中的版本重复
   - 主要变化：待确认

4. mdx-server-renderer.tsx
   - 状态：待移动
   - 原因：与 UI 目录中的版本重复
   - 主要变化：待确认

### 保留在 MDX 目录的组件
1. friend-link-grid.tsx
   - 状态：保留
   - 原因：MDX 特定功能组件

2. navigation-grid.tsx
   - 状态：保留
   - 原因：MDX 特定功能组件

### 注意事项
- 所有组件引用已更新为指向 UI 目录
- 原组件代码已备份到 backup-20250608 目录
- 迁移过程中保持了完整的功能兼容性
