# Components Directory Structure

这个目录包含了项目中所有的 React 组件。组件按照功能和用途进行分类，以保持代码的组织性和可维护性。

## 目录结构

```
components/
├── ui/          # 基础UI组件
├── features/    # 功能型组件
├── layout/      # 布局组件
├── admin/       # 管理后台组件
├── auth/        # 认证相关组件
├── cards/       # 卡片展示组件
└── mdx/         # MDX渲染组件
```

## 分类说明

### 1. UI Components (/ui)
- 基础的、可复用的UI组件
- 应该是无状态的或状态很简单的
- 例如：按钮、输入框、模态框等

### 2. Feature Components (/features)
- 实现具体业务功能的组件
- 可以包含复杂的状态管理和业务逻辑
- 例如：评论系统、搜索框、工具卡片等

### 3. Layout Components (/layout)
- 控制页面结构和布局的组件
- 通常在多个页面中共享
- 例如：导航栏、页脚、侧边栏等

### 4. Admin Components (/admin)
- 专门用于管理后台的组件
- 通常需要管理员权限
- 例如：数据表格、仪表盘、设置面板等

### 5. Auth Components (/auth)
- 处理用户认证相关的组件
- 包括登录、注册、密码重置等功能
- 例如：登录表单、注册表单等

### 6. Card Components (/cards)
- 以卡片形式展示内容的组件
- 用于展示结构化数据
- 例如：博客卡片、产品卡片等

### 7. MDX Components (/mdx)
- 用于增强MDX内容的组件
- 支持文档和博客功能
- 例如：代码块、警告框、目录等

## 开发规范

### 命名规范
- 文件名使用 kebab-case：`my-component.tsx`
- 组件名使用 PascalCase：`MyComponent`
- 文件夹名使用小写：`components/feature/`

### 文件结构
每个组件可能包含以下文件：
```
component-name/
├── index.ts           # 导出文件
├── component-name.tsx # 主组件文件
├── component-name.test.tsx  # 测试文件
└── component-name.module.css # 样式文件
```

### 文档要求
每个组件都应该包含：
- 组件描述
- Props 定义和类型说明
- 使用示例

### 最佳实践
1. 保持组件的单一职责
2. 使用 TypeScript 定义 Props 类型
3. 编写单元测试
4. 使用CSS Modules或Tailwind进行样式管理
5. 导出时使用具名导出而不是默认导出

## 组件开发流程

1. 确定组件类别
2. 在对应目录创建组件
3. 实现组件功能
4. 编写测试用例
5. 添加使用文档
6. 提交代码审查

详细的组件规范请参考 `components.json` 文件。
