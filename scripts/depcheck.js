#!/usr/bin/env node

/**
 * 依赖检查脚本
 * 用于检查项目中未使用的依赖
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkDependencies() {
  console.log('🔍 检查未使用的依赖...\n');
  
  try {
    const { stdout, stderr } = await execAsync('npx depcheck');
    
    if (stdout.includes('No depcheck issue')) {
      console.log('✅ 没有发现未使用的依赖');
    } else {
      console.log('⚠️  发现以下可能未使用的依赖:');
      console.log(stdout);
    }
    
    if (stderr) {
      console.log('stderr:', stderr);
    }
  } catch (error) {
    if (error.stdout) {
      console.log('⚠️  发现以下可能未使用的依赖:');
      console.log(error.stdout);
    } else {
      console.log('❌ 检查依赖时出错:', error.message);
    }
  }
}

// 执行检查
checkDependencies();