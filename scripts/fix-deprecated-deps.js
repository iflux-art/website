/**
 * 修复弃用依赖的脚本
 *
 * 此脚本用于分析和修复项目中的弃用依赖问题，特别是：
 * 1. abab@2.0.6
 * 2. domexception@4.0.0
 * 3. glob@7.2.3
 * 4. inflight@1.0.6
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { globSync } = require('glob');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 打印带颜色的消息
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 读取 package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

log('开始分析弃用依赖...', 'blue');

// 检查是否有 glob 依赖
const hasGlobDep = packageJson.dependencies && packageJson.dependencies.glob;
const hasGlobDevDep = packageJson.devDependencies && packageJson.devDependencies.glob;

// 检查项目中使用 glob 的文件
log('检查项目中使用 glob 的文件...', 'cyan');
const jsFiles = globSync('**/*.js', { ignore: ['node_modules/**', '.next/**', '.turbo/**'] });

const globUsageFiles = [];
for (const file of jsFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes("require('glob')") || content.includes('require("glob")')) {
      globUsageFiles.push(file);
    }
  } catch (error) {
    log(`读取文件 ${file} 失败: ${error.message}`, 'red');
  }
}

if (globUsageFiles.length > 0) {
  log('以下文件使用了 glob 依赖:', 'yellow');
  globUsageFiles.forEach(file => {
    console.log(`- ${file}`);
  });

  log('\n需要更新这些文件以使用新的 glob API:', 'yellow');
  log('const { globSync } = require(\'glob\');', 'green');
  log('const files = globSync(\'pattern\');  // 替代 globSync', 'green');
} else {
  log('未找到直接使用 glob 的文件', 'green');
}

// 分析依赖树，查找弃用依赖
log('\n分析依赖树，查找弃用依赖...', 'blue');
try {
  const npmLsResult = execSync('npm ls glob domexception abab inflight', { encoding: 'utf8' });
  console.log(npmLsResult);
} catch (error) {
  // npm ls 在找不到依赖时会返回非零退出码，但仍会输出结果
  console.log(error.stdout);
}

// 更新 glob 依赖
log('\n开始修复弃用依赖...', 'blue');

// 1. 更新 glob 依赖
if (hasGlobDep || hasGlobDevDep || globUsageFiles.length > 0) {
  log('更新 glob 依赖到最新版本...', 'cyan');
  try {
    execSync('pnpm add glob@^10.3.10 -D', { stdio: 'inherit' });
    log('glob 依赖已更新到最新版本', 'green');

    // 自动修复文件
    if (globUsageFiles.length > 0) {
      log('\n自动修复使用 glob 的文件...', 'cyan');

      let fixedFiles = 0;
      for (const file of globUsageFiles) {
        try {
          let content = fs.readFileSync(file, 'utf8');
          let updated = false;

          // 替换 require('glob')
          if (content.includes("require('glob')") || content.includes('require("glob")')) {
            content = content.replace(/const\s+glob\s*=\s*require\(['"]glob['"]\)/g, "const { globSync } = require('glob')");
            updated = true;
          }

          // 替换 globSync
          if (content.includes('globSync')) {
            content = content.replace(/glob\.sync/g, 'globSync');
            updated = true;
          }

          if (updated) {
            fs.writeFileSync(file, content);
            log(`已修复文件: ${file}`, 'green');
            fixedFiles++;
          }
        } catch (error) {
          log(`修复文件 ${file} 失败: ${error.message}`, 'red');
        }
      }

      log(`\n共修复了 ${fixedFiles} 个文件`, 'green');
    }
  } catch (error) {
    log(`更新 glob 依赖失败: ${error.message}`, 'red');
  }
} else {
  log('项目中没有直接依赖 glob，尝试更新间接依赖...', 'yellow');
  try {
    execSync('pnpm add glob@^10.3.10 -D', { stdio: 'inherit' });
    log('已添加 glob 最新版本作为开发依赖', 'green');
  } catch (error) {
    log(`添加 glob 依赖失败: ${error.message}`, 'red');
  }
}

// 2. 更新其他弃用依赖
log('\n尝试更新其他弃用依赖...', 'cyan');
try {
  execSync('pnpm update abab domexception inflight', { stdio: 'inherit' });
  log('其他弃用依赖已尝试更新', 'green');
} catch (error) {
  log(`更新其他弃用依赖失败: ${error.message}`, 'red');
}

// 3. 清理缓存并重新安装依赖
log('\n清理缓存并重新安装依赖...', 'cyan');
try {
  execSync('pnpm clean:cache', { stdio: 'inherit' });
  execSync('pnpm install', { stdio: 'inherit' });
  log('依赖已重新安装', 'green');
} catch (error) {
  log(`重新安装依赖失败: ${error.message}`, 'red');
}

// 4. 检查修复结果
log('\n检查修复结果...', 'blue');
try {
  const npmLsResult = execSync('npm ls glob domexception abab inflight', { encoding: 'utf8' });
  console.log(npmLsResult);
} catch (error) {
  console.log(error.stdout);
}

log('\n弃用依赖修复完成!', 'green');
log('如果仍有弃用依赖警告，可能需要更新使用这些依赖的包。', 'yellow');
log('建议运行 pnpm check-deprecated 检查是否还有弃用依赖。', 'cyan');
log('然后运行 pnpm build 测试构建是否成功。', 'cyan');
