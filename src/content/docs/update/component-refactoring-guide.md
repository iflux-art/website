# 组件重构指南

## 1. 组件重构目标

本指南详细说明如何按照项目的模块化架构要求重构现有组件，确保所有组件遵循一致的结构和规范。

### 1.1 主要目标

- **结构一致性**：所有组件使用相同的目录结构和文件命名
- **类型完整性**：所有组件都有完整的类型定义
- **文档完整性**：所有组件都有详细的JSDoc注释
- **测试覆盖**：关键组件都有对应的测试

### 1.2 重构范围

根据组件审计报告，需要重构的组件包括：

- 74个需要移动到独立目录的组件
- 20个需要添加类型定义的组件
- 23个需要添加注释的组件
- 2个需要创建index导出文件的组件

## 2. 组件结构规范

### 2.1 目录结构

每个组件应遵循以下目录结构：

```
components/
  └── [category]/          # ui, features, layout
      └── [component-name]/
          ├── index.ts     # 导出文件
          ├── [component-name].tsx  # 组件实现
          ├── [component-name].types.ts  # 类型定义
          └── [component-name].test.tsx  # 测试文件
```

### 2.2 文件命名规范

- **目录名**：使用kebab-case（如`button`、`theme-toggle`）
- **组件文件**：使用kebab-case（如`button.tsx`、`theme-toggle.tsx`）
- **类型文件**：使用kebab-case，后缀为`.types.ts`（如`button.types.ts`）
- **测试文件**：使用kebab-case，后缀为`.test.tsx`（如`button.test.tsx`）
- **导出文件**：统一使用`index.ts`

### 2.3 组件命名规范

- **组件名**：使用PascalCase（如`Button`、`ThemeToggle`）
- **类型名**：使用PascalCase，组件props类型以`Props`结尾（如`ButtonProps`）
- **接口名**：使用PascalCase，以`I`开头（如`IButtonProps`）

### 2.4 导出规范

- 使用命名导出而非默认导出
- 在index.ts中集中导出组件和类型
- 避免别名导出，保持命名一致性

示例：

```typescript
// button.tsx
export function Button(props: ButtonProps) {
  // 实现
}

// index.ts
export * from './button';
export * from './button.types';
```

## 3. 类型定义规范

### 3.1 组件Props类型

- 使用接口定义组件props
- 为每个prop添加JSDoc注释
- 明确标注可选props
- 避免使用any类型

示例：

```typescript
// button.types.ts
import { ButtonHTMLAttributes } from 'react';

/**
 * 按钮组件的属性
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮变体样式
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * 按钮尺寸
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * 是否禁用按钮
   * @default false
   */
  disabled?: boolean;
}
```

### 3.2 类型导出

- 在组件的类型文件中导出所有相关类型
- 在组件目录的index.ts中重新导出这些类型
- 避免在组件实现文件中定义类型

## 4. 组件文档规范

### 4.1 JSDoc注释

每个组件应包含以下JSDoc注释：

- 组件描述
- 使用示例
- 参数说明
- 返回值说明（如适用）
- 注意事项（如适用）

示例：

```typescript
/**
 * 按钮组件，用于触发操作。
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   点击我
 * </Button>
 * ```
 * 
 * @param props - 按钮组件的属性
 * @returns 按钮组件
 */
export function Button(props: ButtonProps) {
  // 实现
}
```

### 4.2 Props文档

- 为每个prop添加详细的JSDoc注释
- 说明prop的用途、可选值和默认值
- 使用@default标签标注默认值

## 5. 测试规范

### 5.1 测试内容

每个组件的测试应包括：

- 渲染测试：确保组件能正确渲染
- 交互测试：测试用户交互（如点击、输入等）
- 属性测试：测试不同props的效果
- 边界条件测试：测试边界情况（如空值、极限值等）

### 5.2 测试结构

```typescript
// button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 6. 重构步骤

### 6.1 准备工作

1. 创建项目备份
2. 设置测试环境
3. 创建重构脚本

### 6.2 UI组件重构

按照以下步骤重构UI组件：

1. 创建组件目录
2. 移动组件文件到目录中
3. 创建index.ts导出文件
4. 添加或完善类型定义
5. 添加或完善JSDoc注释
6. 创建或完善测试文件
7. 更新导入路径

### 6.3 功能组件重构

按照与UI组件相同的步骤重构功能组件。

### 6.4 布局组件重构

按照与UI组件相同的步骤重构布局组件。

### 6.5 验证和修复

1. 验证项目能否正常构建
2. 运行测试确保功能正常
3. 修复可能的问题

## 7. 重构脚本

为了自动化重构过程，我们提供了以下脚本：

### 7.1 组件迁移脚本

```javascript
// scripts/migrate-component.js
const fs = require('fs');
const path = require('path');

/**
 * 将组件迁移到独立目录
 * @param {string} category - 组件类别（ui, features, layout）
 * @param {string} componentName - 组件名称
 */
function migrateComponent(category, componentName) {
  const kebabName = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const srcPath = path.join('src', 'components', category, `${kebabName}.tsx`);
  const destDir = path.join('src', 'components', category, kebabName);
  const destPath = path.join(destDir, `${kebabName}.tsx`);
  const indexPath = path.join(destDir, 'index.ts');
  
  // 创建目录
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // 移动组件文件
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    fs.unlinkSync(srcPath);
    console.log(`Moved ${srcPath} to ${destPath}`);
  } else {
    console.error(`Source file ${srcPath} does not exist`);
    return;
  }
  
  // 创建index.ts
  const indexContent = `export * from './${kebabName}';\n`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created ${indexPath}`);
  
  // 创建类型文件（如果不存在）
  const typesPath = path.join(destDir, `${kebabName}.types.ts`);
  if (!fs.existsSync(typesPath)) {
    const typesContent = `import { HTMLAttributes } from 'react';\n\n/**\n * ${componentName} 组件的属性\n */\nexport interface ${componentName}Props extends HTMLAttributes<HTMLDivElement> {\n  // 添加组件特定属性\n}\n`;
    fs.writeFileSync(typesPath, typesContent);
    console.log(`Created ${typesPath}`);
  }
  
  // 创建测试文件（如果不存在）
  const testPath = path.join(destDir, `${kebabName}.test.tsx`);
  if (!fs.existsSync(testPath)) {
    const testContent = `import { render, screen } from '@testing-library/react';\nimport { ${componentName} } from './${kebabName}';\n\ndescribe('${componentName}', () => {\n  it('renders correctly', () => {\n    render(<${componentName} />);\n    // 添加断言\n  });\n});\n`;
    fs.writeFileSync(testPath, testContent);
    console.log(`Created ${testPath}`);
  }
}

// 使用示例
// migrateComponent('ui', 'Button');
```

### 7.2 导入路径更新脚本

```javascript
// scripts/update-imports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 更新导入路径
 */
function updateImports() {
  const files = glob.sync('src/**/*.{ts,tsx}');
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;
    
    // 更新导入路径
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/([^\/]+)\/([^'"]+)['"]/g,
      (match, imports, category, component) => {
        // 如果组件名不包含/，说明它是直接导入的组件文件
        if (!component.includes('/')) {
          updated = true;
          return `import {${imports}} from '@/components/${category}/${component.replace('.tsx', '')}'`;
        }
        return match;
      }
    );
    
    if (updated) {
      fs.writeFileSync(file, content);
      console.log(`Updated imports in ${file}`);
    }
  });
}

// 使用示例
// updateImports();
```

## 8. 常见问题与解决方案

### 8.1 导入路径错误

**问题**：重构后组件导入路径错误，导致构建失败。

**解决方案**：
1. 使用导入路径更新脚本自动更新路径
2. 检查错误信息，手动修复特殊情况
3. 使用IDE的重构功能批量更新导入

### 8.2 类型错误

**问题**：添加类型定义后出现类型错误。

**解决方案**：
1. 检查组件实现是否符合类型定义
2. 调整类型定义以匹配实际实现
3. 使用更精确的类型，避免any

### 8.3 测试失败

**问题**：添加测试后测试失败。

**解决方案**：
1. 检查测试环境配置
2. 确保测试用例符合组件实际行为
3. 调整组件实现或测试用例

## 9. 结论

通过遵循本指南进行组件重构，我们将实现项目的极致模块化，提高代码质量和可维护性。重构过程采用渐进式策略，确保每个阶段都能正常运行，同时保持向后兼容。
