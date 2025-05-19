/**
 * 更新导入路径脚本
 * 
 * 该脚本用于：
 * 1. 扫描项目中的所有 .ts, .tsx, .js, .jsx 文件
 * 2. 更新组件的导入路径，适应新的目录结构
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(ROOT_DIR, 'src/components');

// 需要更新的组件目录
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 获取所有需要处理的文件
function getFilesToProcess() {
  return glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    cwd: ROOT_DIR,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**']
  });
}

// 获取组件映射表（旧路径 -> 新路径）
function getComponentMapping() {
  const mapping = {};
  
  COMPONENT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(COMPONENTS_DIR, category);
    
    if (fs.existsSync(categoryPath)) {
      const items = fs.readdirSync(categoryPath);
      
      items.forEach(item => {
        const itemPath = path.join(categoryPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // 旧路径: @/components/ui/button
          // 新路径: @/components/ui/button/button
          const oldPath = `@/components/${category}/${item}`;
          const newPath = `@/components/${category}/${item}/${item}`;
          
          mapping[oldPath] = newPath;
        }
      });
    }
  });
  
  return mapping;
}

// 更新文件中的导入路径
function updateImportsInFile(filePath, componentMapping) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // 替换导入路径
  Object.entries(componentMapping).forEach(([oldPath, newPath]) => {
    // 匹配 import ... from 'oldPath'
    const importRegex = new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${oldPath.replace('/', '\\/')}['"]`, 'g');
    if (importRegex.test(content)) {
      content = content.replace(importRegex, `import $1 from '${newPath}'`);
      updated = true;
    }
    
    // 匹配 import { ... } from 'oldPath'
    const importNamedRegex = new RegExp(`import\\s+\\{(.+?)\\}\\s+from\\s+['"]${oldPath.replace('/', '\\/')}['"]`, 'g');
    if (importNamedRegex.test(content)) {
      content = content.replace(importNamedRegex, `import {$1} from '${newPath}'`);
      updated = true;
    }
  });
  
  // 如果有更新，写回文件
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ 更新文件: ${filePath}`);
  }
}

// 主函数
function main() {
  console.log('🚀 开始更新导入路径...');
  
  // 获取组件映射表
  const componentMapping = getComponentMapping();
  console.log('📊 组件映射表:');
  console.log(componentMapping);
  
  // 获取所有需要处理的文件
  const files = getFilesToProcess();
  console.log(`\n🔍 找到 ${files.length} 个文件需要处理`);
  
  // 更新每个文件中的导入路径
  files.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    updateImportsInFile(filePath, componentMapping);
  });
  
  console.log('\n✅ 导入路径更新完成!');
}

// 执行主函数
main();
