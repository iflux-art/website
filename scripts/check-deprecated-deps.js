/**
 * 检查弃用依赖的脚本
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

// 要检查的弃用依赖列表
const deprecatedDeps = [
  'abab',
  'domexception',
  'glob',
  'inflight'
];

log('开始检查弃用依赖...', 'blue');

// 检查依赖版本
try {
  log('\n检查依赖版本:', 'cyan');
  
  // 检查 glob 版本
  const globVersion = execSync('npm ls glob --depth=0', { encoding: 'utf8' });
  console.log(globVersion);
  
  // 检查其他弃用依赖
  log('\n检查其他弃用依赖:', 'cyan');
  deprecatedDeps.forEach(dep => {
    if (dep !== 'glob') {
      try {
        const depInfo = execSync(`npm ls ${dep}`, { encoding: 'utf8' });
        console.log(depInfo);
      } catch (error) {
        // npm ls 在找不到依赖时会返回非零退出码，但仍会输出结果
        console.log(error.stdout || `未找到 ${dep} 依赖`);
      }
    }
  });
  
  // 检查是否有弃用警告
  log('\n检查弃用警告:', 'cyan');
  try {
    const npmCheck = execSync('npm ls --depth=0', { encoding: 'utf8' });
    
    if (npmCheck.includes('deprecated')) {
      log('检测到弃用警告:', 'yellow');
      console.log(npmCheck);
    } else {
      log('未检测到弃用警告', 'green');
    }
  } catch (error) {
    // npm ls 可能会因为其他原因返回非零退出码
    const output = error.stdout || '';
    
    if (output.includes('deprecated')) {
      log('检测到弃用警告:', 'yellow');
      console.log(output);
    } else {
      log('未检测到弃用警告，但命令执行出错', 'yellow');
      console.log(output);
    }
  }
  
  log('\n检查完成!', 'green');
  log('如果仍有弃用依赖警告，可能需要更新使用这些依赖的包或使用 overrides 配置。', 'yellow');
  
} catch (error) {
  log(`检查过程中出错: ${error.message}`, 'red');
  process.exit(1);
}
