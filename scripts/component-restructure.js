/**
 * 组件目录结构标准化脚本
 * 
 * 该脚本用于：
 * 1. 将单文件组件移动到独立目录
 * 2. 为每个组件创建标准的文件结构
 * 3. 更新导入路径
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 需要标准化的组件目录
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 创建标准的index.ts文件内容
function createIndexFileContent(componentName) {
  return `/**
 * ${componentName} 组件
 * @module components/${componentName}
 */

export * from './${componentName}';
`;
}

// 创建标准的类型文件内容
function createTypesFileContent(componentName) {
  return `/**
 * ${componentName} 组件类型定义
 * @module components/${componentName}/types
 */

import { HTMLAttributes } from 'react';

export interface ${componentName}Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * 组件变体
   */
  variant?: 'default' | 'primary' | 'secondary';
  
  /**
   * 组件大小
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
}
`;
}

// 创建标准的测试文件内容
function createTestFileContent(componentName) {
  return `/**
 * ${componentName} 组件测试
 * @module components/${componentName}/test
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName}>Test</${componentName}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
`;
}

// 处理单个组件文件
function processComponentFile(filePath, componentName, targetDir) {
  // 创建组件目录
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 读取组件文件内容
  const content = fs.readFileSync(filePath, 'utf8');

  // 创建组件文件
  fs.writeFileSync(path.join(targetDir, `${componentName}.tsx`), content);

  // 创建index.ts文件
  fs.writeFileSync(path.join(targetDir, 'index.ts'), createIndexFileContent(componentName));

  // 创建类型文件
  fs.writeFileSync(path.join(targetDir, `${componentName}.types.ts`), createTypesFileContent(componentName));

  // 创建测试文件
  fs.writeFileSync(path.join(targetDir, `${componentName}.test.tsx`), createTestFileContent(componentName));

  console.log(`✅ 处理组件: ${componentName}`);
}

// 处理组件目录
function processComponentDirectory(dirPath, category) {
  const items = fs.readdirSync(dirPath);
  
  // 处理直接位于目录下的.tsx文件（非目录）
  items.forEach(item => {
    if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.types.')) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isFile()) {
        const componentName = item.replace('.tsx', '');
        const targetDir = path.join(dirPath, componentName);
        
        // 如果目标目录已存在，跳过处理
        if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
          console.log(`⏭️ 跳过已存在的组件目录: ${componentName}`);
          return;
        }
        
        processComponentFile(itemPath, componentName, targetDir);
        
        // 删除原始文件
        fs.unlinkSync(itemPath);
      }
    }
  });
  
  // 递归处理子目录
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory() && !item.startsWith('.')) {
      processComponentDirectory(itemPath, `${category}/${item}`);
    }
  });
}

// 主函数
function main() {
  console.log('🚀 开始组件目录结构标准化...');
  
  // 处理每个组件类别
  COMPONENT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(COMPONENTS_DIR, category);
    
    if (fs.existsSync(categoryPath)) {
      console.log(`\n📁 处理类别: ${category}`);
      processComponentDirectory(categoryPath, category);
    }
  });
  
  console.log('\n✅ 组件目录结构标准化完成!');
}

// 执行主函数
main();
