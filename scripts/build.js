// Turborepo构建脚本
const { execSync } = require('child_process');

console.log('🔄 正在运行内容翻译脚本...');

try {
  // 先执行翻译脚本
  execSync('pnpm run translate', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ 内容翻译完成');
  
  // 然后执行Next.js构建
  console.log('🚀 开始Next.js构建...');
  execSync('pnpm run build:next', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Next.js构建完成');
} catch (error) {
  console.error('❌ 构建失败:', error);
  process.exit(1);
}