/**
 * 组件清理脚本
 * 该脚本用于：
 * 1. 删除已移动到独立目录的组件文件
 * 2. 更新组件导入路径
 */

const fs = require('fs');
const path = require('path');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 需要清理的组件目录
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 根目录组件列表
const ROOT_COMPONENTS = ['typography'];

// 删除已移动到独立目录的组件文件
function removeMovedComponentFiles(dirPath) {
  // 检查目录是否存在
  if (!fs.existsSync(dirPath)) {
    console.log(`目录不存在，跳过: ${dirPath}`);
    return;
  }
  
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    
    // 检查文件是否存在
    if (!fs.existsSync(itemPath)) {
      console.log(`文件不存在，跳过: ${itemPath}`);
      return;
    }
    
    const stats = fs.statSync(itemPath);
    
    // 只处理.tsx文件（组件文件）
    if (stats.isFile() && item.endsWith('.tsx')) {
      const componentName = path.basename(item, '.tsx');
      const componentDir = path.join(dirPath, componentName);
      
      // 检查是否已经存在同名目录
      if (fs.existsSync(componentDir)) {
        const componentInDir = path.join(componentDir, item);
        
        // 如果组件已经移动到目录中，删除原始文件
        if (fs.existsSync(componentInDir) && fs.existsSync(itemPath)) {
          console.log(`删除已移动的组件文件: ${itemPath}`);
          try {
            fs.unlinkSync(itemPath);
          } catch (err) {
            console.error(`删除文件失败: ${itemPath}`, err);
          }
        }
      }
    }
  });
  
  // 处理子目录
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        removeMovedComponentFiles(itemPath);
      }
    }
  });
}

// 清理根目录下的组件文件
function cleanupRootComponents() {
  console.log('清理根目录组件文件...');
  
  ROOT_COMPONENTS.forEach(componentName => {
    const componentFile = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
    const componentDir = path.join(COMPONENTS_DIR, componentName);
    
    // 检查组件目录和组件文件是否都存在
    if (fs.existsSync(componentDir) && fs.existsSync(componentFile)) {
      const componentInDir = path.join(componentDir, `${componentName}.tsx`);
      
      // 如果组件已经移动到目录中，删除原始文件
      if (fs.existsSync(componentInDir)) {
        console.log(`删除已移动的根目录组件文件: ${componentFile}`);
        try {
          fs.unlinkSync(componentFile);
        } catch (err) {
          console.error(`删除文件失败: ${componentFile}`, err);
        }
      }
    }
  });
}

// 主函数
function cleanupComponents() {
  console.log('开始清理组件文件...');
  
  // 处理每个组件类别
  COMPONENT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(COMPONENTS_DIR, category);
    if (fs.existsSync(categoryPath)) {
      console.log(`清理${category}组件目录...`);
      removeMovedComponentFiles(categoryPath);
    }
  });
  
  // 清理根目录组件
  cleanupRootComponents();
  
  console.log('组件文件清理完成！');
}

// 执行清理
cleanupComponents();