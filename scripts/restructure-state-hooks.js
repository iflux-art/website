/**
 * 状态管理和钩子函数重构脚本
 * 
 * 该脚本用于：
 * 1. 创建新的状态管理目录结构
 * 2. 创建新的钩子函数目录结构
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..');

// 状态管理目录
const STORE_DIR = path.resolve(ROOT_DIR, 'src/store');

// 钩子函数目录
const HOOKS_DIR = path.resolve(ROOT_DIR, 'src/hooks');

// 状态管理模块
const STORE_MODULES = [
  'theme',
  'search',
  'blog',
  'docs',
  'ui'
];

// 钩子函数模块
const HOOKS_MODULES = [
  'ui',
  'data',
  'form',
  'auth',
  'animation'
];

// 创建状态管理模块目录结构
function createStoreModuleStructure(moduleName) {
  const moduleDir = path.join(STORE_DIR, moduleName);
  
  // 创建模块目录
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(moduleDir, 'index.ts'), `/**
 * ${moduleName} 状态管理
 * @module store/${moduleName}
 */

export * from './actions';
export * from './selectors';
export * from './types';
export * from './store';
`);
  
  // 创建actions.ts文件
  fs.writeFileSync(path.join(moduleDir, 'actions.ts'), `/**
 * ${moduleName} 状态操作
 * @module store/${moduleName}/actions
 */

import { ${moduleName}Store } from './store';
import { ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Action } from './types';

/**
 * ${moduleName} 状态操作
 */
export const ${moduleName}Actions = {
  /**
   * 示例操作
   */
  exampleAction: (payload: string): ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Action => {
    ${moduleName}Store.setState(state => ({
      ...state,
      example: payload
    }));
    
    return {
      type: '${moduleName}/exampleAction',
      payload
    };
  }
};
`);
  
  // 创建selectors.ts文件
  fs.writeFileSync(path.join(moduleDir, 'selectors.ts'), `/**
 * ${moduleName} 状态选择器
 * @module store/${moduleName}/selectors
 */

import { ${moduleName}Store } from './store';

/**
 * ${moduleName} 状态选择器
 */
export const ${moduleName}Selectors = {
  /**
   * 获取示例状态
   */
  getExample: () => ${moduleName}Store.getState().example
};
`);
  
  // 创建types.ts文件
  fs.writeFileSync(path.join(moduleDir, 'types.ts'), `/**
 * ${moduleName} 状态类型定义
 * @module store/${moduleName}/types
 */

/**
 * ${moduleName} 状态
 */
export interface ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}State {
  /**
   * 示例状态
   */
  example: string;
}

/**
 * ${moduleName} 操作类型
 */
export type ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}ActionType = 
  | '${moduleName}/exampleAction';

/**
 * ${moduleName} 操作
 */
export interface ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Action {
  /**
   * 操作类型
   */
  type: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}ActionType;
  
  /**
   * 操作负载
   */
  payload: any;
}
`);
  
  // 创建store.ts文件
  fs.writeFileSync(path.join(moduleDir, 'store.ts'), `/**
 * ${moduleName} 状态存储
 * @module store/${moduleName}/store
 */

import { create } from 'zustand';
import { ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}State } from './types';

/**
 * ${moduleName} 初始状态
 */
const initialState: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}State = {
  example: ''
};

/**
 * ${moduleName} 状态存储
 */
export const ${moduleName}Store = create<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}State>(() => initialState);
`);
  
  console.log(`✅ 创建状态管理模块: ${moduleName}`);
}

// 创建钩子函数模块目录结构
function createHooksModuleStructure(moduleName) {
  const moduleDir = path.join(HOOKS_DIR, moduleName);
  
  // 创建模块目录
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(moduleDir, 'index.ts'), `/**
 * ${moduleName} 钩子函数
 * @module hooks/${moduleName}
 */

export * from './use-example';
`);
  
  // 创建示例钩子函数文件
  fs.writeFileSync(path.join(moduleDir, 'use-example.ts'), `/**
 * 示例钩子函数
 * @module hooks/${moduleName}/use-example
 */

import { useState, useEffect } from 'react';

/**
 * 示例钩子函数
 */
export function useExample(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // 示例副作用
    console.log('Example hook mounted');
    
    return () => {
      console.log('Example hook unmounted');
    };
  }, []);
  
  return {
    value,
    setValue
  };
}
`);
  
  // 创建示例钩子函数测试文件
  fs.writeFileSync(path.join(moduleDir, 'use-example.test.ts'), `/**
 * 示例钩子函数测试
 * @module hooks/${moduleName}/use-example.test
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useExample } from './use-example';

describe('useExample', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useExample('test'));
    expect(result.current.value).toBe('test');
  });
  
  it('should update value', () => {
    const { result } = renderHook(() => useExample('test'));
    
    act(() => {
      result.current.setValue('updated');
    });
    
    expect(result.current.value).toBe('updated');
  });
});
`);
  
  console.log(`✅ 创建钩子函数模块: ${moduleName}`);
}

// 创建状态管理根目录结构
function createStoreRootStructure() {
  // 创建状态管理根目录
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(STORE_DIR, 'index.ts'), `/**
 * 状态管理
 * @module store
 */

${STORE_MODULES.map(module => `export * from './${module}';`).join('\n')}
`);
  
  console.log('✅ 创建状态管理根目录结构');
}

// 创建钩子函数根目录结构
function createHooksRootStructure() {
  // 创建钩子函数根目录
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }
  
  // 创建index.ts文件
  fs.writeFileSync(path.join(HOOKS_DIR, 'index.ts'), `/**
 * 钩子函数
 * @module hooks
 */

${HOOKS_MODULES.map(module => `export * from './${module}';`).join('\n')}
`);
  
  console.log('✅ 创建钩子函数根目录结构');
}

// 主函数
function main() {
  console.log('🚀 开始重构状态管理和钩子函数...');
  
  // 创建状态管理根目录结构
  createStoreRootStructure();
  
  // 创建状态管理模块目录结构
  STORE_MODULES.forEach(createStoreModuleStructure);
  
  // 创建钩子函数根目录结构
  createHooksRootStructure();
  
  // 创建钩子函数模块目录结构
  HOOKS_MODULES.forEach(createHooksModuleStructure);
  
  console.log('\n✅ 状态管理和钩子函数重构完成!');
}

// 执行主函数
main();
