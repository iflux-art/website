const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 要清理的目录
const dirsToClean = [
  '.next',
  'node_modules/.cache',
];

// 清理函数
function cleanDir(dir) {
  const fullPath = path.join(__dirname, dir);
  
  try {
    if (fs.existsSync(fullPath)) {
      console.log(`Cleaning ${dir}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Successfully cleaned ${dir}`);
    } else {
      console.log(`Directory ${dir} does not exist, skipping`);
    }
  } catch (error) {
    console.error(`Error cleaning ${dir}:`, error.message);
  }
}

// 清理所有目录
dirsToClean.forEach(cleanDir);

// 运行 pnpm 清理命令
try {
  console.log('Running pnpm cache clean...');
  execSync('pnpm cache clean', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running pnpm cache clean:', error.message);
}

console.log('Cache cleaning completed');
