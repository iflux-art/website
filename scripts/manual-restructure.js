/**
 * 手动重构组件脚本
 * 
 * 该脚本用于手动重构指定的组件
 */

const fs = require('fs');
const path = require('path');

// 组件信息
const componentName = 'fullscreen-scroll';
const componentCategory = 'ui';
const sourcePath = path.join(__dirname, '../src/components', componentCategory, `${componentName}.tsx`);
const targetDir = path.join(__dirname, '../src/components', componentCategory, componentName);

// 创建目标目录
if (!fs.existsSync(targetDir)) {
  console.log(`创建目标目录: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

// 读取组件内容
if (fs.existsSync(sourcePath)) {
  const componentContent = fs.readFileSync(sourcePath, 'utf8');
  
  // 提取类型定义
  const typeRegex = /interface\s+(\w+)Props\s+{[\s\S]*?}/;
  const typeMatch = componentContent.match(typeRegex);
  let typeContent = '';
  
  if (typeMatch) {
    typeContent = `/**
 * ${componentName} 组件类型定义
 */

import React from "react";

export ${typeMatch[0]}
`;
  } else {
    typeContent = `/**
 * ${componentName} 组件类型定义
 */

import React from "react";

export interface FullscreenScrollProps {
  children: React.ReactNode;
  className?: string;
}
`;
  }
  
  // 创建组件文件
  const newComponentPath = path.join(targetDir, `${componentName}.tsx`);
  console.log(`创建组件文件: ${newComponentPath}`);
  
  // 替换类型导入
  let newComponentContent = componentContent;
  if (typeMatch) {
    newComponentContent = componentContent.replace(typeMatch[0], '');
    newComponentContent = `"use client";

import React from "react";
import { FullscreenScrollProps } from './${componentName}.types';
import { cn } from "@/lib/utils";

/**
 * 全屏滚动容器组件
 * 提供全屏分页滚动功能，支持键盘和鼠标滚轮导航
 */
${newComponentContent.substring(newComponentContent.indexOf('export function'))}`;
  }
  
  fs.writeFileSync(newComponentPath, newComponentContent);
  
  // 创建类型文件
  const typesPath = path.join(targetDir, `${componentName}.types.ts`);
  console.log(`创建类型文件: ${typesPath}`);
  fs.writeFileSync(typesPath, typeContent);
  
  // 创建索引文件
  const indexPath = path.join(targetDir, 'index.ts');
  console.log(`创建索引文件: ${indexPath}`);
  fs.writeFileSync(indexPath, `/**
 * ${componentName} 组件
 */

export * from './${componentName}';
`);
  
  console.log(`组件 ${componentName} 已成功重构到 ${targetDir}`);
} else {
  console.error(`组件文件不存在: ${sourcePath}`);
}
