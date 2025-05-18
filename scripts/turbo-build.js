// Turborepo构建脚本
const { execSync } = require('child_process');

// 执行Next.js构建
console.log('🚀 开始Next.js构建...');

try {
  // 执行Next.js构建
  execSync('next build', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Next.js构建完成');
} catch (error) {
  console.error('❌ Next.js构建失败:', error);
  process.exit(1);
}