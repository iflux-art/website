// Next.js 构建钩子脚本
const { execSync } = require('child_process');
const path = require('path');

// 在构建前运行翻译脚本
console.log('🔄 正在运行内容翻译脚本...');

try {
  // 使用 ts-node 运行翻译脚本
  execSync('npx ts-node scripts/translate-content.ts', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ 内容翻译完成');
} catch (error) {
  console.error('❌ 内容翻译失败:', error);
  process.exit(1);
}