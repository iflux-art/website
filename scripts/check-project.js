#!/usr/bin/env node

/**
 * 项目检查脚本
 * 用于检查项目中可能存在的问题
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// 检查函数
function checkProject() {
  console.log('🔍 开始项目检查...\n');
  
  // 检查未使用的依赖
  console.log('📦 检查未使用的依赖...');
  try {
    execSync('npx depcheck', { stdio: 'pipe' });
    console.log('✅ 依赖检查完成\n');
  } catch (error) {
    console.log('⚠️  发现未使用的依赖，请运行 `npx depcheck` 查看详情\n');
  }
  
  // 检查TypeScript错误
  console.log('📝 检查TypeScript错误...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript检查通过\n');
  } catch (error) {
    console.log('❌ TypeScript检查发现错误\n');
  }
  
  // 检查代码规范
  console.log('🎨 检查代码规范...');
  try {
    execSync('npx biome check', { stdio: 'pipe' });
    console.log('✅ 代码规范检查通过\n');
  } catch (error) {
    console.log('❌ 代码规范检查发现警告\n');
  }
  
  // 检查测试
  console.log('🧪 检查测试...');
  try {
    execSync('npx vitest run --reporter=verbose', { stdio: 'pipe' });
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试发现问题\n');
  }
  
  console.log('✅ 项目检查完成！');
  console.log('\n💡 建议查看 OPTIMIZATION_CHECKLIST.md 文件了解优化建议');
}

// 执行检查
checkProject();