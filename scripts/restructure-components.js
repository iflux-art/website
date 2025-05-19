/**
 * 组件重构脚本
 * 
 * 该脚本用于：
 * 1. 将单文件组件移动到独立目录
 * 2. 为每个组件创建标准的文件结构
 * 3. 生成类型定义文件
 * 4. 更新导入路径
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 需要重构的组件目录
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 创建标准的index.ts文件内容
function createIndexFileContent(componentName) {
  return `/**
 * ${componentName} 组件
 */

export * from './${componentName}';
`;
}

// 创建标准的类型文件内容
function createTypesFileContent(componentName) {
  const typeName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  return `/**
 * ${componentName} 组件类型定义
 */

import { HTMLAttributes } from 'react';

export interface ${typeName}Props extends HTMLAttributes<HTMLDivElement> {
  // 在此添加组件特定的属性
}
`;
}

// 处理单个组件文件
function processComponentFile(filePath, category) {
  // 只处理.tsx文件
  if (!filePath.endsWith('.tsx')) return;
  
  const fileName = path.basename(filePath);
  const componentName = path.basename(filePath, '.tsx');
  const dirName = path.dirname(filePath);
  
  // 如果文件名是index.tsx，则使用目录名作为组件名
  const actualComponentName = fileName === 'index.tsx' 
    ? path.basename(dirName)
    : componentName;
  
  // 检查是否已经在正确的目录结构中
  const isInCorrectDir = path.basename(dirName) === actualComponentName;
  
  if (!isInCorrectDir) {
    // 创建组件目录
    const componentDir = path.join(dirName, actualComponentName);
    if (!fs.existsSync(componentDir)) {
      console.log(`创建组件目录: ${componentDir}`);
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    // 读取组件文件内容
    const componentContent = fs.readFileSync(filePath, 'utf8');
    
    // 创建组件文件
    const newComponentPath = path.join(componentDir, `${actualComponentName}.tsx`);
    if (!fs.existsSync(newComponentPath)) {
      console.log(`创建组件文件: ${newComponentPath}`);
      fs.writeFileSync(newComponentPath, componentContent);
    }
    
    // 创建index.ts文件
    const indexPath = path.join(componentDir, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      console.log(`创建index.ts文件: ${indexPath}`);
      fs.writeFileSync(indexPath, createIndexFileContent(actualComponentName));
    }
    
    // 创建类型文件
    const typesPath = path.join(componentDir, `${actualComponentName}.types.ts`);
    if (!fs.existsSync(typesPath) && !componentContent.includes('interface') && !componentContent.includes('type ')) {
      console.log(`创建类型文件: ${typesPath}`);
      fs.writeFileSync(typesPath, createTypesFileContent(actualComponentName));
    }
    
    // 如果原文件不是index.tsx，则可以考虑删除原文件
    // 但为了安全起见，这里不自动删除，而是输出提示
    if (fileName !== 'index.tsx') {
      console.log(`注意: 原组件文件 ${filePath} 可以手动删除`);
    }
  }
}

// 递归处理目录
function processDirectory(dirPath, category) {
  const items = fs.readdirSync(dirPath);
  
  // 处理文件
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isFile()) {
      processComponentFile(itemPath, category);
    } else if (stats.isDirectory()) {
      // 递归处理子目录
      processDirectory(itemPath, category);
    }
  });
}

// 主函数
function restructureComponents() {
  console.log('开始重构组件...');
  
  // 处理每个组件类别
  COMPONENT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(COMPONENTS_DIR, category);
    if (fs.existsSync(categoryPath)) {
      console.log(`处理${category}组件目录...`);
      processDirectory(categoryPath, category);
    }
  });
  
  console.log('组件重构完成！');
}

// 执行重构
restructureComponents();
