#!/usr/bin/env node

/**
 * 文件监视脚本
 * 监视文件变化并执行相应操作
 */

import { watch } from 'fs';
import { join, extname, relative } from 'path';

// 配置
const config = {
  watchDirs: [
    'src',
    'public',
    'styles'
  ],
  ignorePatterns: [
    'node_modules',
    '.next',
    '.git',
    'dist',
    '*.log'
  ],
  fileExtensions: [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.md',
    '.mdx',
    '.css',
    '.scss',
    '.json'
  ]
};

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  fg: {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  }
};

// 日志函数
function log(message, color = colors.fg.cyan) {
  console.log(`${color}[${new Date().toLocaleTimeString()}] ${message}${colors.reset}`);
}

// 检查文件是否应该被监视
function shouldWatchFile(filePath) {
  // 检查是否匹配忽略模式
  for (const pattern of config.ignorePatterns) {
    if (filePath.includes(pattern)) {
      return false;
    }
  }
  
  // 检查文件扩展名
  const ext = extname(filePath);
  if (ext && !config.fileExtensions.includes(ext)) {
    return false;
  }
  
  return true;
}

// 处理文件变化
function handleFileChange(eventType, filename) {
  if (!filename) return;
  
  const relativePath = relative(process.cwd(), filename);
  
  if (shouldWatchFile(relativePath)) {
    switch (eventType) {
      case 'change':
        log(`文件已修改: ${relativePath}`, colors.fg.yellow);
        break;
      case 'rename':
        log(`文件已创建/删除: ${relativePath}`, colors.fg.magenta);
        break;
      default:
        log(`文件变化: ${relativePath}`, colors.fg.blue);
    }
    
    // 这里可以添加特定的处理逻辑
    // 例如：重新编译、运行测试等
  }
}

// 启动监视器
function startWatcher() {
  log('启动文件监视器...', colors.fg.green);
  log(`监视目录: ${config.watchDirs.join(', ')}`);
  log(`按 Ctrl+C 退出`);
  
  // 监视指定目录
  for (const dir of config.watchDirs) {
    try {
      watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename) {
          handleFileChange(eventType, join(dir, filename));
        }
      });
    } catch (error) {
      log(`无法监视目录 ${dir}: ${error.message}`, colors.fg.magenta);
    }
  }
}

// 主函数
function main() {
  startWatcher();
  
  // 优雅退出
  process.on('SIGINT', () => {
    log('监视器已停止', colors.fg.green);
    process.exit(0);
  });
}

// 执行主函数
main();
