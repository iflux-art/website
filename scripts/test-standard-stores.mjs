#!/usr/bin/env node

// 测试标准化store的基本功能
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const storesDir = join(projectRoot, 'src', 'stores');

// 获取所有标准化store文件
const standardStoreFiles = fs.readdirSync(storesDir)
  .filter(file => file.endsWith('.standard.ts'));

console.log(`发现 ${standardStoreFiles.length} 个标准化store文件:`);
console.log(standardStoreFiles.map(f => `- ${f}`).join('\n'));

// 测试每个store的基本结构
let passed = 0;
let failed = 0;

for (const file of standardStoreFiles) {
  try {
    const filePath = join(storesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查必需的元素
    const checks = [
      { name: 'State interface', regex: /export interface \w*State/ },
      { name: 'Actions interface', regex: /export interface \w*Actions/ },
      { name: 'DerivedState interface', regex: /export interface \w*DerivedState/ },
      { name: 'Store interface', regex: /export interface \w*Store/ },
      { name: 'initialState', regex: /export const initialState/ },
      { name: 'createStore function', regex: /export const create\w*Store/ },
      { name: 'default export', regex: /export const use\w*Store/ },
      { name: 'resetState method', regex: /resetState:/ }
    ];
    
    let filePassed = true;
    for (const check of checks) {
      if (!check.regex.test(content)) {
        console.error(`❌ ${file}: 缺少 ${check.name}`);
        filePassed = false;
      }
    }
    
    if (filePassed) {
      console.log(`✅ ${file}: 通过所有检查`);
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.error(`❌ ${file}: 测试失败 - ${error.message}`);
    failed++;
  }
}

console.log(`\n测试完成:`);
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败: ${failed}`);
console.log(`总计: ${standardStoreFiles.length}`);

process.exit(failed > 0 ? 1 : 0);