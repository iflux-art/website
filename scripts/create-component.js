/**
 * 组件模板生成器
 * 
 * 该脚本用于：
 * 1. 创建符合标准结构的新组件
 * 2. 生成必要的文件（组件文件、类型文件、索引文件等）
 * 
 * 使用方法：
 * node scripts/create-component.js <组件名称> <组件类别> [--with-test] [--with-story]
 * 
 * 示例：
 * node scripts/create-component.js Button ui --with-test
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const componentName = process.argv[2];
const componentCategory = process.argv[3];
const withTest = process.argv.includes('--with-test');
const withStory = process.argv.includes('--with-story');

// 验证参数
if (!componentName || !componentCategory) {
  console.error('请提供组件名称和类别');
  console.error('用法: node scripts/create-component.js <组件名称> <组件类别> [--with-test] [--with-story]');
  console.error('示例: node scripts/create-component.js Button ui --with-test');
  process.exit(1);
}

// 验证组件类别
const validCategories = ['ui', 'features', 'layout'];
if (!validCategories.includes(componentCategory)) {
  console.error(`无效的组件类别: ${componentCategory}`);
  console.error(`有效的类别: ${validCategories.join(', ')}`);
  process.exit(1);
}

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 将组件名称转换为不同的格式
function formatComponentName(name, format) {
  switch (format) {
    case 'pascal': // PascalCase
      return name.charAt(0).toUpperCase() + name.slice(1);
    case 'kebab': // kebab-case
      return name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
    case 'camel': // camelCase
      return name.charAt(0).toLowerCase() + name.slice(1);
    default:
      return name;
  }
}

// 创建组件文件内容
function createComponentContent(name) {
  const pascalName = formatComponentName(name, 'pascal');
  return `/**
 * ${pascalName} 组件
 */

import React from 'react';
import { ${pascalName}Props } from './${formatComponentName(name, 'kebab')}.types';
import { cn } from '@/lib/utils';

export function ${pascalName}({ className, children, ...props }: ${pascalName}Props) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}
`;
}

// 创建类型文件内容
function createTypesContent(name) {
  const pascalName = formatComponentName(name, 'pascal');
  return `/**
 * ${pascalName} 组件类型定义
 */

import { HTMLAttributes } from 'react';

export interface ${pascalName}Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * 组件子元素
   */
  children?: React.ReactNode;
}
`;
}

// 创建索引文件内容
function createIndexContent(name) {
  const pascalName = formatComponentName(name, 'pascal');
  const kebabName = formatComponentName(name, 'kebab');
  return `/**
 * ${pascalName} 组件导出
 */

export * from './${kebabName}';
export type { ${pascalName}Props } from './${kebabName}.types';
`;
}

// 创建测试文件内容
function createTestContent(name) {
  const pascalName = formatComponentName(name, 'pascal');
  const kebabName = formatComponentName(name, 'kebab');
  return `/**
 * ${pascalName} 组件测试
 */

import { render, screen } from '@testing-library/react';
import { ${pascalName} } from './${kebabName}';

describe('${pascalName} 组件', () => {
  it('应该正确渲染', () => {
    render(<${pascalName}>测试内容</${pascalName}>);
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });
});
`;
}

// 创建故事文件内容
function createStoryContent(name) {
  const pascalName = formatComponentName(name, 'pascal');
  const kebabName = formatComponentName(name, 'kebab');
  return `/**
 * ${pascalName} 组件故事
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ${pascalName} } from './${kebabName}';

const meta: Meta<typeof ${pascalName}> = {
  title: '${componentCategory.charAt(0).toUpperCase() + componentCategory.slice(1)}/${pascalName}',
  component: ${pascalName},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ${pascalName}>;

export const Default: Story = {
  args: {
    children: '${pascalName} 示例',
  },
};
`;
}

// 创建组件
function createComponent() {
  // 格式化组件名称
  const pascalName = formatComponentName(componentName, 'pascal');
  const kebabName = formatComponentName(componentName, 'kebab');
  
  // 创建组件目录
  const componentDir = path.join(COMPONENTS_DIR, componentCategory, kebabName);
  if (fs.existsSync(componentDir)) {
    console.error(`组件目录已存在: ${componentDir}`);
    process.exit(1);
  }
  
  console.log(`创建组件目录: ${componentDir}`);
  fs.mkdirSync(componentDir, { recursive: true });
  
  // 创建组件文件
  const componentPath = path.join(componentDir, `${kebabName}.tsx`);
  console.log(`创建组件文件: ${componentPath}`);
  fs.writeFileSync(componentPath, createComponentContent(componentName));
  
  // 创建类型文件
  const typesPath = path.join(componentDir, `${kebabName}.types.ts`);
  console.log(`创建类型文件: ${typesPath}`);
  fs.writeFileSync(typesPath, createTypesContent(componentName));
  
  // 创建索引文件
  const indexPath = path.join(componentDir, 'index.ts');
  console.log(`创建索引文件: ${indexPath}`);
  fs.writeFileSync(indexPath, createIndexContent(componentName));
  
  // 创建测试文件（如果需要）
  if (withTest) {
    const testPath = path.join(componentDir, `${kebabName}.test.tsx`);
    console.log(`创建测试文件: ${testPath}`);
    fs.writeFileSync(testPath, createTestContent(componentName));
  }
  
  // 创建故事文件（如果需要）
  if (withStory) {
    const storyPath = path.join(componentDir, `${kebabName}.stories.tsx`);
    console.log(`创建故事文件: ${storyPath}`);
    fs.writeFileSync(storyPath, createStoryContent(componentName));
  }
  
  console.log(`\n✅ 组件 ${pascalName} 创建成功!`);
  console.log(`组件路径: ${componentDir}`);
  console.log(`\n使用方法:`);
  console.log(`import { ${pascalName} } from '@/components/${componentCategory}/${kebabName}';`);
  console.log(`\n<${pascalName}>内容</${pascalName}>`);
}

// 执行创建
createComponent();
