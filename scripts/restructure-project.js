/**
 * 项目重构主脚本
 * 
 * 该脚本用于协调整个重构过程，按照以下步骤进行：
 * 1. 备份当前项目
 * 2. 重构组件结构
 * 3. 重构状态管理和钩子函数
 * 4. 重构工具函数和类型定义
 * 5. 更新导入路径
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..');

// 备份目录
const BACKUP_DIR = path.resolve(ROOT_DIR, '.backup');

// 备份当前项目
function backupProject() {
  console.log('📦 备份当前项目...');
  
  // 创建备份目录
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // 复制src目录
  execSync(`cp -r ${path.join(ROOT_DIR, 'src')} ${path.join(BACKUP_DIR, 'src')}`, {
    stdio: 'inherit'
  });
  
  console.log('✅ 项目备份完成!');
}

// 恢复项目备份
function restoreBackup() {
  console.log('🔄 恢复项目备份...');
  
  // 检查备份目录是否存在
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('❌ 备份目录不存在!');
    return;
  }
  
  // 删除当前src目录
  execSync(`rm -rf ${path.join(ROOT_DIR, 'src')}`, {
    stdio: 'inherit'
  });
  
  // 复制备份目录
  execSync(`cp -r ${path.join(BACKUP_DIR, 'src')} ${path.join(ROOT_DIR, 'src')}`, {
    stdio: 'inherit'
  });
  
  console.log('✅ 项目备份恢复完成!');
}

// 重构组件结构
function restructureComponents() {
  console.log('\n🔨 重构组件结构...');
  
  try {
    execSync(`node ${path.join(__dirname, 'component-restructure.js')}`, {
      stdio: 'inherit'
    });
    
    console.log('✅ 组件结构重构完成!');
  } catch (error) {
    console.error('❌ 组件结构重构失败:', error);
    throw error;
  }
}

// 重构状态管理和钩子函数
function restructureStateAndHooks() {
  console.log('\n🔨 重构状态管理和钩子函数...');
  
  try {
    execSync(`node ${path.join(__dirname, 'restructure-state-hooks.js')}`, {
      stdio: 'inherit'
    });
    
    console.log('✅ 状态管理和钩子函数重构完成!');
  } catch (error) {
    console.error('❌ 状态管理和钩子函数重构失败:', error);
    throw error;
  }
}

// 重构工具函数和类型定义
function restructureUtilsAndTypes() {
  console.log('\n🔨 重构工具函数和类型定义...');
  
  try {
    execSync(`node ${path.join(__dirname, 'restructure-utils-types.js')}`, {
      stdio: 'inherit'
    });
    
    console.log('✅ 工具函数和类型定义重构完成!');
  } catch (error) {
    console.error('❌ 工具函数和类型定义重构失败:', error);
    throw error;
  }
}

// 更新导入路径
function updateImports() {
  console.log('\n🔨 更新导入路径...');
  
  try {
    execSync(`node ${path.join(__dirname, 'update-imports.js')}`, {
      stdio: 'inherit'
    });
    
    console.log('✅ 导入路径更新完成!');
  } catch (error) {
    console.error('❌ 导入路径更新失败:', error);
    throw error;
  }
}

// 验证项目是否能正常构建
function validateProject() {
  console.log('\n🧪 验证项目是否能正常构建...');
  
  try {
    // 执行类型检查
    execSync('npx tsc --noEmit', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    
    // 执行lint检查
    execSync('npm run lint', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    
    // 执行构建
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    
    console.log('✅ 项目验证通过!');
  } catch (error) {
    console.error('❌ 项目验证失败:', error);
    
    // 询问是否恢复备份
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('是否恢复备份? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        restoreBackup();
      }
      
      readline.close();
      process.exit(1);
    });
  }
}

// 主函数
function main() {
  console.log('🚀 开始项目重构...');
  
  try {
    // 备份当前项目
    backupProject();
    
    // 重构组件结构
    restructureComponents();
    
    // 重构状态管理和钩子函数
    restructureStateAndHooks();
    
    // 重构工具函数和类型定义
    restructureUtilsAndTypes();
    
    // 更新导入路径
    updateImports();
    
    // 验证项目是否能正常构建
    validateProject();
    
    console.log('\n🎉 项目重构完成!');
  } catch (error) {
    console.error('\n❌ 项目重构失败:', error);
    
    // 询问是否恢复备份
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('是否恢复备份? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        restoreBackup();
      }
      
      readline.close();
      process.exit(1);
    });
  }
}

// 执行主函数
main();
