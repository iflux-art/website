/**
 * 单个组件重构脚本
 * 
 * 该脚本用于：
 * 1. 将单个组件移动到标准目录结构
 * 2. 创建必要的文件（index.ts, 类型文件等）
 * 3. 更新导入路径
 * 
 * 使用方法：
 * node scripts/restructure-component.js <组件路径> <目标类别>
 * 
 * 示例：
 * node scripts/restructure-component.js src/components/Button.tsx ui
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取命令行参数
const componentPath = process.argv[2];
const targetCategory = process.argv[3];

// 验证参数
if (!componentPath || !targetCategory) {
  console.error('请提供组件路径和目标类别');
  console.error('用法: node scripts/restructure-component.js <组件路径> <目标类别>');
  console.error('示例: node scripts/restructure-component.js src/components/Button.tsx ui');
  process.exit(1);
}

// 验证目标类别
const validCategories = ['ui', 'features', 'layout'];
if (!validCategories.includes(targetCategory)) {
  console.error(`无效的目标类别: ${targetCategory}`);
  console.error(`有效的类别: ${validCategories.join(', ')}`);
  process.exit(1);
}

// 验证组件路径
if (!fs.existsSync(componentPath)) {
  console.error(`组件文件不存在: ${componentPath}`);
  process.exit(1);
}

// 组件目录路径
const COMPONENTS_DIR = path.resolve(process.cwd(), 'src/components');

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

// 提取组件中的类型定义
function extractTypeDefinitions(content) {
  const typeRegex = /(export\s+)?(interface|type)\s+\w+(\s+extends\s+[^{]+)?\s*{[^}]*}/g;
  const matches = content.match(typeRegex);
  
  if (matches) {
    return matches.join('\n\n');
  }
  
  return null;
}

// 重构组件
function restructureComponent() {
  // 获取组件信息
  const componentFileName = path.basename(componentPath);
  const componentName = path.basename(componentPath, path.extname(componentPath));
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  // 创建目标目录
  const targetDir = path.join(COMPONENTS_DIR, targetCategory, componentName);
  if (!fs.existsSync(targetDir)) {
    console.log(`创建目标目录: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 创建组件文件
  const newComponentPath = path.join(targetDir, `${componentName}.tsx`);
  console.log(`创建组件文件: ${newComponentPath}`);
  fs.writeFileSync(newComponentPath, componentContent);
  
  // 创建index.ts文件
  const indexPath = path.join(targetDir, 'index.ts');
  console.log(`创建index.ts文件: ${indexPath}`);
  fs.writeFileSync(indexPath, createIndexFileContent(componentName));
  
  // 提取类型定义或创建类型文件
  const extractedTypes = extractTypeDefinitions(componentContent);
  const typesPath = path.join(targetDir, `${componentName}.types.ts`);
  
  if (extractedTypes) {
    console.log(`创建类型文件(从组件提取): ${typesPath}`);
    fs.writeFileSync(typesPath, `/**
 * ${componentName} 组件类型定义
 */

${extractedTypes}
`);
  } else if (!componentContent.includes('interface') && !componentContent.includes('type ')) {
    console.log(`创建类型文件(模板): ${typesPath}`);
    fs.writeFileSync(typesPath, createTypesFileContent(componentName));
  }
  
  // 更新主组件文件中的导入路径
  if (extractedTypes) {
    let updatedContent = componentContent.replace(extractedTypes, '');
    updatedContent = `import { ${componentName}Props } from './${componentName}.types';\n${updatedContent}`;
    fs.writeFileSync(newComponentPath, updatedContent);
  }
  
  console.log(`组件 ${componentName} 已成功重构到 ${targetDir}`);
  console.log('');
  console.log('注意: 原组件文件未删除，请手动删除或更新导入路径');
  console.log(`原组件文件: ${componentPath}`);
  console.log(`新组件路径: ${path.join(targetCategory, componentName)}`);
}

// 执行重构
restructureComponent();
