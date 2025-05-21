/**
 * 简单修复弃用依赖的脚本
 * 
 * 此脚本采用直接方法更新 glob 依赖并重新安装所有依赖
 */

const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// 打印带颜色的消息
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 执行命令并打印输出
function runCommand(command, message) {
  log(message, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`命令执行失败: ${error.message}`, 'red');
    return false;
  }
}

// 主函数
async function main() {
  log('开始简单修复弃用依赖...', 'blue');
  
  // 步骤1: 更新 glob 依赖
  if (!runCommand('pnpm add glob@^10.3.10 -D', '1. 更新 glob 依赖到最新版本...')) {
    process.exit(1);
  }
  
  // 步骤2: 清理缓存
  if (!runCommand('pnpm clean:cache', '2. 清理缓存...')) {
    process.exit(1);
  }
  
  // 步骤3: 重新安装依赖
  if (!runCommand('pnpm install', '3. 重新安装依赖...')) {
    process.exit(1);
  }
  
  log('\n弃用依赖修复完成!', 'green');
  log('建议运行 pnpm check-deprecated 检查是否还有弃用依赖。', 'yellow');
}

// 执行主函数
main().catch(error => {
  log(`脚本执行出错: ${error.message}`, 'red');
  process.exit(1);
});
