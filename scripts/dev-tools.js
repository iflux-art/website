#!/usr/bin/env node

/**
 * 开发工具脚本
 * 提供常用的开发工具命令和优化
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// 日志函数
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.fg.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.fg.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.fg.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.fg.cyan);
}

// 显示帮助信息
function showHelp() {
  console.log(`
${colors.fg.cyan}${colors.bright}开发工具脚本${colors.reset}

用法: npm run dev-tools [命令]

命令:
  ${colors.fg.green}clean${colors.reset}          清理开发环境
  ${colors.fg.green}optimize${colors.reset}       优化开发环境
  ${colors.fg.green}stats${colors.reset}          显示项目统计信息
  ${colors.fg.green}watch${colors.reset}          启动文件监视
  ${colors.fg.green}help${colors.reset}           显示此帮助信息

示例:
  npm run dev-tools clean
  npm run dev-tools optimize
  `);
}

// 清理开发环境
async function cleanDevEnvironment() {
  logInfo('清理开发环境...');
  
  try {
    // 清理Next.js构建缓存
    await execAsync('rimraf .next');
    logSuccess('已清理 .next 目录');
    
    // 清理npm缓存
    await execAsync('pnpm cache clean --force');
    logSuccess('已清理 pnpm 缓存');
    
    // 清理node_modules (可选)
    // await execAsync('rimraf node_modules');
    // logSuccess('已清理 node_modules 目录');
    
    logSuccess('开发环境清理完成!');
  } catch (error) {
    logError(`清理过程中出错: ${error.message}`);
  }
}

// 优化开发环境
async function optimizeDevEnvironment() {
  logInfo('优化开发环境...');
  
  try {
    // 优化pnpm存储
    await execAsync('pnpm store prune');
    logSuccess('已优化 pnpm 存储');
    
    // 预安装常用依赖
    await execAsync('pnpm install --prefer-offline');
    logSuccess('依赖安装优化完成');
    
    logSuccess('开发环境优化完成!');
  } catch (error) {
    logError(`优化过程中出错: ${error.message}`);
  }
}

// 显示项目统计信息
async function showProjectStats() {
  logInfo('收集项目统计信息...');
  
  try {
    // 统计文件数量
    const { stdout: fileCount } = await execAsync('find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" | wc -l');
    log(`文件总数: ${fileCount.trim()}`);
    
    // 统计代码行数
    const { stdout: lineCount } = await execAsync('find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" | xargs wc -l | tail -1');
    log(`代码行数: ${lineCount.trim().split(' ')[0]}`);
    
    // 统计依赖数量
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
    log(`生产依赖: ${depCount}`);
    log(`开发依赖: ${devDepCount}`);
    
  } catch (error) {
    logError(`统计过程中出错: ${error.message}`);
  }
}

// 启动文件监视
async function startFileWatcher() {
  logInfo('启动文件监视...');
  
  try {
    // 创建监视配置文件
    const watchConfig = {
      ignore: [
        'node_modules/**',
        '.next/**',
        '.git/**',
        'dist/**',
        'public/**'
      ],
      extensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
    };
    
    writeFileSync('.watchrc', JSON.stringify(watchConfig, null, 2));
    logSuccess('已创建监视配置文件 .watchrc');
    
    log('文件监视已启动，按 Ctrl+C 退出');
    
    // 启动监视脚本
    const { spawn } = require('child_process');
    const watcher = spawn('node', ['scripts/watch.js'], { stdio: 'inherit' });
    
    watcher.on('error', (error) => {
      logError(`文件监视启动失败: ${error.message}`);
    });
    
  } catch (error) {
    logError(`启动文件监视时出错: ${error.message}`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'clean':
      await cleanDevEnvironment();
      break;
    case 'optimize':
      await optimizeDevEnvironment();
      break;
    case 'stats':
      await showProjectStats();
      break;
    case 'watch':
      await startFileWatcher();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      if (command) {
        logError(`未知命令: ${command}`);
      }
      showHelp();
      process.exit(1);
  }
}

// 执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`执行出错: ${error.message}`);
    process.exit(1);
  });
}

export {
  cleanDevEnvironment,
  optimizeDevEnvironment,
  showProjectStats,
  startFileWatcher
};