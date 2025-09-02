#!/usr/bin/env node

/**
 * 性能监控脚本
 * 监控和分析项目构建和运行时性能
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
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

// 性能数据
const perfData = {
  buildTimes: [],
  devServerStartTimes: [],
  testRunTimes: []
};

// 格式化时间
function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

// 记录性能数据
function recordPerfData(type, time) {
  perfData[type].push(time);
  
  // 保存到文件
  const timestamp = new Date().toISOString();
  const data = `${timestamp},${type},${time}\n`;
  appendFileSync('perf-stats.csv', data);
}

// 计算平均时间
function calculateAverage(times) {
  if (times.length === 0) return 0;
  const sum = times.reduce((a, b) => a + b, 0);
  return sum / times.length;
}

// 显示性能统计
function showPerfStats() {
  logInfo('性能统计:');
  
  if (perfData.buildTimes.length > 0) {
    const avgBuildTime = calculateAverage(perfData.buildTimes);
    log(`平均构建时间: ${formatTime(avgBuildTime)} (共${perfData.buildTimes.length}次)`);
  }
  
  if (perfData.devServerStartTimes.length > 0) {
    const avgStartTime = calculateAverage(perfData.devServerStartTimes);
    log(`平均开发服务器启动时间: ${formatTime(avgStartTime)} (共${perfData.devServerStartTimes.length}次)`);
  }
  
  if (perfData.testRunTimes.length > 0) {
    const avgTestTime = calculateAverage(perfData.testRunTimes);
    log(`平均测试运行时间: ${formatTime(avgTestTime)} (共${perfData.testRunTimes.length}次)`);
  }
}

// 监控构建性能
async function monitorBuildPerf() {
  logInfo('监控构建性能...');
  
  try {
    const startTime = Date.now();
    
    // 执行构建命令
    await execAsync('next build', { stdio: 'inherit' });
    
    const endTime = Date.now();
    const buildTime = endTime - startTime;
    
    recordPerfData('buildTimes', buildTime);
    logSuccess(`构建完成，耗时: ${formatTime(buildTime)}`);
    
  } catch (error) {
    logError(`构建失败: ${error.message}`);
  }
}

// 监控开发服务器启动性能
async function monitorDevServerPerf() {
  logInfo('监控开发服务器启动性能...');
  
  try {
    const startTime = Date.now();
    
    // 执行开发服务器启动命令
    const devProcess = exec('next dev --turbopack');
    
    // 监听输出以确定服务器是否启动
    devProcess.stdout.on('data', (data) => {
      if (data.includes('started server on') || data.includes('Ready in')) {
        const endTime = Date.now();
        const startTimeTaken = endTime - startTime;
        
        recordPerfData('devServerStartTimes', startTimeTaken);
        logSuccess(`开发服务器启动完成，耗时: ${formatTime(startTimeTaken)}`);
        
        // 停止进程
        devProcess.kill();
      }
    });
    
    devProcess.stderr.on('data', (data) => {
      if (data.includes('error') || data.includes('Error')) {
        logError(`开发服务器启动出错: ${data}`);
        devProcess.kill();
      }
    });
    
  } catch (error) {
    logError(`监控开发服务器时出错: ${error.message}`);
  }
}

// 监控测试运行性能
async function monitorTestPerf() {
  logInfo('监控测试运行性能...');
  
  try {
    const startTime = Date.now();
    
    // 执行测试命令
    await execAsync('vitest run', { stdio: 'inherit' });
    
    const endTime = Date.now();
    const testTime = endTime - startTime;
    
    recordPerfData('testRunTimes', testTime);
    logSuccess(`测试运行完成，耗时: ${formatTime(testTime)}`);
    
  } catch (error) {
    logError(`测试运行失败: ${error.message}`);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
${colors.fg.cyan}${colors.bright}性能监控脚本${colors.reset}

用法: npm run perf-monitor [命令]

命令:
  ${colors.fg.green}build${colors.reset}          监控构建性能
  ${colors.fg.green}dev${colors.reset}            监控开发服务器启动性能
  ${colors.fg.green}test${colors.reset}           监控测试运行性能
  ${colors.fg.green}stats${colors.reset}          显示性能统计
  ${colors.fg.green}help${colors.reset}           显示此帮助信息

示例:
  npm run perf-monitor build
  npm run perf-monitor dev
  `);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // 初始化性能统计文件
  if (!existsSync('perf-stats.csv')) {
    writeFileSync('perf-stats.csv', 'timestamp,type,time\n');
  }
  
  switch (command) {
    case 'build':
      await monitorBuildPerf();
      break;
    case 'dev':
      await monitorDevServerPerf();
      break;
    case 'test':
      await monitorTestPerf();
      break;
    case 'stats':
      showPerfStats();
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
  monitorBuildPerf,
  monitorDevServerPerf,
  monitorTestPerf,
  showPerfStats
};