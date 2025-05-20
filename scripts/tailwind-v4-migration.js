/**
 * Tailwind CSS v4 迁移脚本
 * 
 * 此脚本帮助自动化一些 Tailwind CSS v4 迁移任务
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  // 组件目录
  componentsDir: path.join(__dirname, '../src/components'),
  // 页面目录
  pagesDir: path.join(__dirname, '../src/app'),
  // 备份目录
  backupDir: path.join(__dirname, '../backups'),
  // 迁移日志
  logFile: path.join(__dirname, '../tailwind-v4-migration.log'),
};

// 确保备份目录存在
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

// 初始化日志文件
fs.writeFileSync(config.logFile, `Tailwind CSS v4 Migration Log - ${new Date().toISOString()}\n\n`);

/**
 * 记录消息到日志文件
 * @param {string} message 消息内容
 */
function log(message) {
  console.log(message);
  fs.appendFileSync(config.logFile, `${message}\n`);
}

/**
 * 备份文件
 * @param {string} filePath 文件路径
 */
function backupFile(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const backupPath = path.join(config.backupDir, relativePath);
  
  // 确保备份目录存在
  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // 复制文件
  fs.copyFileSync(filePath, backupPath);
  log(`Backed up: ${relativePath}`);
}

/**
 * 迁移 Tailwind 配置文件
 */
function migrateConfig() {
  const configPath = path.join(__dirname, '../tailwind.config.mjs');
  const v4ConfigPath = path.join(__dirname, '../tailwind.config.v4.mjs');
  
  // 备份原始配置
  backupFile(configPath);
  
  // 复制 v4 配置
  if (fs.existsSync(v4ConfigPath)) {
    fs.copyFileSync(v4ConfigPath, configPath);
    log('Migrated Tailwind config to v4');
  } else {
    log('Error: tailwind.config.v4.mjs not found');
  }
}

/**
 * 迁移全局 CSS 文件
 */
function migrateGlobalCSS() {
  const cssPath = path.join(__dirname, '../src/app/globals.css');
  const v4CssPath = path.join(__dirname, '../src/app/globals.v4.css');
  
  // 备份原始 CSS
  backupFile(cssPath);
  
  // 复制 v4 CSS
  if (fs.existsSync(v4CssPath)) {
    fs.copyFileSync(v4CssPath, cssPath);
    log('Migrated globals.css to v4');
  } else {
    log('Error: globals.v4.css not found');
  }
}

/**
 * 查找所有组件文件
 * @returns {string[]} 组件文件路径列表
 */
function findComponentFiles() {
  const result = [];
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (
        entry.isFile() && 
        /\.(jsx|tsx)$/.test(entry.name) && 
        !entry.name.includes('.test.') &&
        !entry.name.includes('.spec.')
      ) {
        result.push(fullPath);
      }
    }
  }
  
  scanDir(config.componentsDir);
  return result;
}

/**
 * 分析组件中的 Tailwind 类
 * @param {string} filePath 组件文件路径
 * @returns {string[]} Tailwind 类列表
 */
function analyzeTailwindClasses(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classPattern = /className=["'`]([^"'`]+)["'`]/g;
  const classes = new Set();
  
  let match;
  while ((match = classPattern.exec(content)) !== null) {
    match[1].split(' ').forEach(cls => {
      if (cls.trim()) {
        classes.add(cls.trim());
      }
    });
  }
  
  return Array.from(classes);
}

/**
 * 检查组件是否需要迁移
 * @param {string} filePath 组件文件路径
 * @returns {boolean} 是否需要迁移
 */
function needsMigration(filePath) {
  const classes = analyzeTailwindClasses(filePath);
  
  // 检查是否使用了在 v4 中变化的类
  const v4ChangedClasses = [
    // 添加在 v4 中有变化的类名
    'dark:',
    'group-hover:',
    'focus-within:',
    'active:',
  ];
  
  return classes.some(cls => 
    v4ChangedClasses.some(changedCls => cls.includes(changedCls))
  );
}

/**
 * 主函数
 */
function main() {
  log('Starting Tailwind CSS v4 migration...');
  
  // 备份并迁移配置文件
  migrateConfig();
  
  // 备份并迁移全局 CSS
  migrateGlobalCSS();
  
  // 分析组件
  const componentFiles = findComponentFiles();
  log(`Found ${componentFiles.length} component files`);
  
  // 检查需要迁移的组件
  const componentsToMigrate = componentFiles.filter(needsMigration);
  log(`Found ${componentsToMigrate.length} components that need migration`);
  
  // 输出需要迁移的组件列表
  if (componentsToMigrate.length > 0) {
    log('\nComponents that need migration:');
    componentsToMigrate.forEach((file, index) => {
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      log(`${index + 1}. ${relativePath}`);
    });
  }
  
  log('\nMigration preparation complete. Please follow the migration guide to continue.');
}

// 运行主函数
main();
