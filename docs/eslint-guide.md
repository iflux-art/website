# ESLint 增强配置指南

本文档介绍了项目中增强的 ESLint 配置，包括如何使用、规则说明以及常见问题解决方法。

## 配置文件

项目中包含以下 ESLint 相关配置文件：

1. `eslint.config.mjs` - 当前使用的基本配置
2. `eslint.config.enhanced.mjs` - 增强的 ESLint 配置（新增）
3. `.eslintrc.json` - 用于 IDE 集成的传统格式配置（新增）

## 使用方法

### 命令行使用

项目提供了以下 lint 相关命令：

```bash
# 使用基本配置进行检查
pnpm lint

# 使用增强配置进行检查
pnpm lint:enhanced

# 使用基本配置进行检查并自动修复
pnpm lint:fix

# 使用增强配置进行检查并自动修复
pnpm lint:enhanced:fix
```

### IDE 集成

VSCode 用户可以安装 ESLint 插件，并使用项目中的 `.vscode/settings.json` 配置，以获得实时的代码检查和自动修复功能。

## 增强的规则集

增强配置添加了以下规则集：

### 1. 导入规则 (eslint-plugin-import)

优化导入语句的顺序和格式，确保导入语句的一致性和可读性。

主要规则：
- `import/first` - 确保所有导入语句位于文件顶部
- `import/no-duplicates` - 防止重复导入
- `import/order` - 按照指定的顺序组织导入语句

### 2. Promise 规则 (eslint-plugin-promise)

确保 Promise 的正确使用，避免常见的 Promise 相关错误。

主要规则：
- `promise/catch-or-return` - 确保 Promise 链中包含错误处理
- `promise/no-nesting` - 避免嵌套 Promise
- `promise/no-promise-in-callback` - 避免在回调中返回 Promise

### 3. 安全规则 (eslint-plugin-security)

检测潜在的安全问题，如不安全的正则表达式、eval 使用等。

主要规则：
- `security/detect-eval-with-expression` - 检测动态 eval 使用
- `security/detect-non-literal-regexp` - 检测动态正则表达式
- `security/detect-unsafe-regex` - 检测可能导致正则表达式拒绝服务攻击的模式

### 4. 代码质量规则 (eslint-plugin-sonarjs)

基于 SonarJS 的代码质量规则，检测代码中的潜在问题和复杂性。

主要规则：
- `sonarjs/no-identical-conditions` - 检测重复的条件判断
- `sonarjs/no-identical-expressions` - 检测重复的表达式
- `sonarjs/prefer-immediate-return` - 简化不必要的变量赋值后立即返回

### 5. 现代 JavaScript 规则 (eslint-plugin-unicorn)

鼓励使用现代 JavaScript 特性和最佳实践。

主要规则：
- `unicorn/better-regex` - 简化正则表达式
- `unicorn/error-message` - 确保错误对象包含消息
- `unicorn/prefer-includes` - 使用 includes 代替 indexOf 检查

### 6. 增强的 React 规则

添加了更多 React 相关的规则，确保组件的一致性和最佳实践。

主要规则：
- `react/self-closing-comp` - 使用自闭合标签
- `react/jsx-sort-props` - 对 props 进行排序
- `react/function-component-definition` - 统一函数组件的定义方式

### 7. 增强的 TypeScript 规则

添加了更多 TypeScript 相关的规则，提高类型安全性。

主要规则：
- `@typescript-eslint/consistent-type-imports` - 统一类型导入方式
- `@typescript-eslint/no-non-null-assertion` - 警告使用非空断言
- `@typescript-eslint/prefer-nullish-coalescing` - 鼓励使用空值合并运算符

## 常见问题解决

### 1. 规则太严格，导致大量警告

如果某些规则对现有代码库太严格，可以在配置文件中调整规则级别：

- `"error"` → `"warn"` → `"off"`

### 2. 特定文件需要禁用规则

可以在文件顶部使用注释禁用特定规则：

```javascript
/* eslint-disable import/order */
// 你的代码
/* eslint-enable import/order */
```

或者对整个文件禁用：

```javascript
/* eslint-disable */
// 你的代码
/* eslint-enable */
```

### 3. 特定行需要禁用规则

```javascript
const foo = bar; // eslint-disable-line no-unused-vars
// 或者
// eslint-disable-next-line no-unused-vars
const foo = bar;
```

## 最佳实践

1. **定期运行 lint** - 在提交代码前运行 `pnpm lint:enhanced:fix`
2. **使用 IDE 集成** - 配置 VSCode 以获得实时反馈
3. **逐步修复** - 对于大型代码库，可以逐步修复问题，而不是一次性全部修复
4. **在 CI 中集成** - 在 CI 流程中添加 lint 检查，确保所有提交的代码都符合规范

## 参考资料

- [ESLint 官方文档](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise)
- [eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security)
- [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
