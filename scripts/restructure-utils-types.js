/**
 * 工具函数和类型定义重构脚本
 * 
 * 该脚本用于：
 * 1. 创建新的工具函数目录结构
 * 2. 创建新的类型定义目录结构
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..');

// 工具函数目录
const UTILS_DIR = path.resolve(ROOT_DIR, 'src/lib');

// 类型定义目录
const TYPES_DIR = path.resolve(ROOT_DIR, 'src/types');

// 工具函数模块
const UTILS_MODULES = [
  'string',
  'date',
  'array',
  'object',
  'validation',
  'format',
  'animation',
  'dom'
];

// 类型定义模块
const TYPES_MODULES = [
  'ui',
  'api',
  'data',
  'store',
  'hooks',
  'common'
];

// 创建工具函数模块目录结构
function createUtilsModuleStructure(moduleName) {
  const moduleDir = path.join(UTILS_DIR, moduleName);
  
  // 创建模块目录
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(moduleDir, 'index.ts'), `/**
 * ${moduleName} 工具函数
 * @module lib/${moduleName}
 */

export * from './utils';
`);
  
  // 创建utils.ts文件
  fs.writeFileSync(path.join(moduleDir, 'utils.ts'), `/**
 * ${moduleName} 工具函数
 * @module lib/${moduleName}/utils
 */

/**
 * 示例工具函数
 */
export function example${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Util(value: string): string {
  return \`Example ${moduleName} util: \${value}\`;
}
`);
  
  // 创建utils.test.ts文件
  fs.writeFileSync(path.join(moduleDir, 'utils.test.ts'), `/**
 * ${moduleName} 工具函数测试
 * @module lib/${moduleName}/utils.test
 */

import { example${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Util } from './utils';

describe('${moduleName} utils', () => {
  describe('example${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Util', () => {
    it('should return formatted string', () => {
      expect(example${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Util('test')).toBe('Example ${moduleName} util: test');
    });
  });
});
`);
  
  console.log(`✅ 创建工具函数模块: ${moduleName}`);
}

// 创建类型定义模块目录结构
function createTypesModuleStructure(moduleName) {
  const moduleDir = path.join(TYPES_DIR, moduleName);
  
  // 创建模块目录
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(moduleDir, 'index.ts'), `/**
 * ${moduleName} 类型定义
 * @module types/${moduleName}
 */

export * from './types';
`);
  
  // 创建types.ts文件
  fs.writeFileSync(path.join(moduleDir, 'types.ts'), `/**
 * ${moduleName} 类型定义
 * @module types/${moduleName}/types
 */

/**
 * 示例类型
 */
export interface Example${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Type {
  /**
   * ID
   */
  id: string;
  
  /**
   * 名称
   */
  name: string;
  
  /**
   * 描述
   */
  description?: string;
}
`);
  
  console.log(`✅ 创建类型定义模块: ${moduleName}`);
}

// 创建工具函数根目录结构
function createUtilsRootStructure() {
  // 创建工具函数根目录
  if (!fs.existsSync(UTILS_DIR)) {
    fs.mkdirSync(UTILS_DIR, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(UTILS_DIR, 'index.ts'), `/**
 * 工具函数
 * @module lib
 */

${UTILS_MODULES.map(module => `export * from './${module}';`).join('\n')}

// 保留原有的工具函数导出，确保向后兼容
export * from './utils';
export * from './constants';
export * from './animations';
`);
  
  console.log('✅ 创建工具函数根目录结构');
}

// 创建类型定义根目录结构
function createTypesRootStructure() {
  // 创建类型定义根目录
  if (!fs.existsSync(TYPES_DIR)) {
    fs.mkdirSync(TYPES_DIR, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(TYPES_DIR, 'index.ts'), `/**
 * 类型定义
 * @module types
 */

${TYPES_MODULES.map(module => `export * from './${module}';`).join('\n')}

// 保留原有的类型定义导出，确保向后兼容
export * from './common';
export * from './components';
`);
  
  console.log('✅ 创建类型定义根目录结构');
}

// 主函数
function main() {
  console.log('🚀 开始重构工具函数和类型定义...');
  
  // 创建工具函数根目录结构
  createUtilsRootStructure();
  
  // 创建工具函数模块目录结构
  UTILS_MODULES.forEach(createUtilsModuleStructure);
  
  // 创建类型定义根目录结构
  createTypesRootStructure();
  
  // 创建类型定义模块目录结构
  TYPES_MODULES.forEach(createTypesModuleStructure);
  
  console.log('\n✅ 工具函数和类型定义重构完成!');
}

// 执行主函数
main();
