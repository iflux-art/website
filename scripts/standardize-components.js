/**
 * 组件目录结构标准化脚本
 * 该脚本用于：
 * 1. 将单文件组件移动到独立目录
 * 2. 为每个组件目录创建标准的index.ts导出文件
 * 3. 统一组件的导出方式
 */

const fs = require('fs');
const path = require('path');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 需要标准化的组件目录
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 根目录组件列表
const ROOT_COMPONENTS = ['typography'];

// 创建标准的index.ts文件内容
function createIndexFileContent(componentName) {
  return `/**
 * ${componentName}组件导出文件
 */

export * from './${componentName}';
`;
}

// 处理单个组件目录
function processComponentDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  // 处理直接位于目录下的.tsx文件（非目录）
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    // 只处理.tsx文件（组件文件）
    if (stats.isFile() && item.endsWith('.tsx')) {
      const componentName = path.basename(item, '.tsx');
      const componentDir = path.join(dirPath, componentName);
      
      // 检查是否已经存在同名目录
      if (!fs.existsSync(componentDir)) {
        console.log(`创建组件目录: ${componentDir}`);
        fs.mkdirSync(componentDir, { recursive: true });
        
        // 创建组件文件
        const newComponentPath = path.join(componentDir, item);
        console.log(`移动组件文件: ${itemPath} -> ${newComponentPath}`);
        fs.copyFileSync(itemPath, newComponentPath);
        
        // 创建index.ts文件
        const indexPath = path.join(componentDir, 'index.ts');
        console.log(`创建index.ts文件: ${indexPath}`);
        fs.writeFileSync(indexPath, createIndexFileContent(componentName));
      }
    }
  });
  
  // 处理子目录
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // 检查是否已有index.ts文件
      const indexPath = path.join(itemPath, 'index.ts');
      if (!fs.existsSync(indexPath)) {
        // 查找目录中的主组件文件
        const dirItems = fs.readdirSync(itemPath);
        const componentFile = dirItems.find(file => 
          file.endsWith('.tsx') && 
          (file === `${path.basename(itemPath)}.tsx` || file === 'index.tsx')
        );
        
        if (componentFile) {
          const componentName = path.basename(componentFile, '.tsx');
          console.log(`为目录创建index.ts文件: ${indexPath}`);
          fs.writeFileSync(indexPath, createIndexFileContent(componentName));
        }
      }
    }
  });
}

// 处理根目录下的组件文件
function processRootComponents() {
  console.log('处理根目录组件文件...');
  
  ROOT_COMPONENTS.forEach(componentName => {
    const componentFile = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
    const componentDir = path.join(COMPONENTS_DIR, componentName);
    
    // 检查组件文件是否存在
    if (fs.existsSync(componentFile)) {
      // 检查是否已经存在同名目录
      if (!fs.existsSync(componentDir)) {
        console.log(`创建组件目录: ${componentDir}`);
        fs.mkdirSync(componentDir, { recursive: true });
        
        // 创建组件文件
        const newComponentPath = path.join(componentDir, `${componentName}.tsx`);
        console.log(`移动组件文件: ${componentFile} -> ${newComponentPath}`);
        fs.copyFileSync(componentFile, newComponentPath);
        
        // 创建index.ts文件
        const indexPath = path.join(componentDir, 'index.ts');
        console.log(`创建index.ts文件: ${indexPath}`);
        fs.writeFileSync(indexPath, createIndexFileContent(componentName));
      }
    }
  });
}

// 主函数
function standardizeComponents() {
  console.log('开始标准化组件目录结构...');
  
  // 处理每个组件类别
  COMPONENT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(COMPONENTS_DIR, category);
    if (fs.existsSync(categoryPath)) {
      console.log(`处理${category}组件目录...`);
      processComponentDirectory(categoryPath);
    }
  });
  
  // 处理根目录组件
  processRootComponents();
  
  console.log('组件目录结构标准化完成！');
}

// 执行标准化
standardizeComponents();