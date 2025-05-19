/**
 * 批量组件重构脚本
 * 
 * 该脚本用于：
 * 1. 批量重构指定类别的组件
 * 2. 根据配置文件自动分类组件
 * 
 * 使用方法：
 * node scripts/batch-restructure.js [--dry-run] [--category=ui|features|layout]
 * 
 * 选项：
 * --dry-run: 仅显示将要执行的操作，不实际执行
 * --category: 只处理指定类别的组件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 解析命令行参数
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const categoryArg = args.find(arg => arg.startsWith('--category='));
const targetCategory = categoryArg ? categoryArg.split('=')[1] : null;

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// 组件分类规则
const componentClassificationRules = {
  ui: [
    // UI组件通常是基础组件，不包含业务逻辑
    'button', 'card', 'dialog', 'input', 'avatar', 'badge', 'checkbox',
    'dropdown', 'form', 'icon', 'menu', 'modal', 'popover', 'select',
    'switch', 'table', 'tabs', 'toast', 'tooltip', 'typography'
  ],
  features: [
    // 功能组件通常实现特定功能，可能包含业务逻辑
    'search', 'theme-toggle', 'language-toggle', 'notification', 'comment',
    'post', 'article', 'blog', 'auth', 'user', 'profile', 'settings',
    'dashboard', 'analytics', 'chart', 'graph', 'map', 'calendar'
  ],
  layout: [
    // 布局组件通常定义页面结构
    'navbar', 'footer', 'sidebar', 'header', 'layout', 'page', 'section',
    'container', 'grid', 'flex', 'box', 'stack', 'divider', 'spacer'
  ]
};

// 查找所有组件文件
function findComponentFiles() {
  const componentFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isFile() && (item.endsWith('.tsx') || item.endsWith('.jsx'))) {
        // 排除index文件和已经在正确目录中的文件
        const dirName = path.basename(path.dirname(itemPath));
        const fileName = path.basename(item, path.extname(item));
        
        if (fileName !== 'index' && dirName !== fileName) {
          componentFiles.push(itemPath);
        }
      } else if (stats.isDirectory()) {
        // 递归处理子目录
        scanDirectory(itemPath);
      }
    });
  }
  
  scanDirectory(COMPONENTS_DIR);
  return componentFiles;
}

// 确定组件类别
function determineComponentCategory(componentPath) {
  const componentName = path.basename(componentPath, path.extname(componentPath)).toLowerCase();
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  // 检查文件路径中是否已经包含类别
  const relativePath = path.relative(COMPONENTS_DIR, componentPath);
  for (const category of Object.keys(componentClassificationRules)) {
    if (relativePath.startsWith(category + '/')) {
      return category;
    }
  }
  
  // 根据组件名称匹配规则
  for (const [category, patterns] of Object.entries(componentClassificationRules)) {
    for (const pattern of patterns) {
      if (componentName.includes(pattern)) {
        return category;
      }
    }
  }
  
  // 根据内容分析
  if (componentContent.includes('layout') || 
      componentContent.includes('grid') || 
      componentContent.includes('flex')) {
    return 'layout';
  }
  
  if (componentContent.includes('fetch') || 
      componentContent.includes('useState') || 
      componentContent.includes('useEffect')) {
    return 'features';
  }
  
  // 默认为UI组件
  return 'ui';
}

// 重构单个组件
function restructureComponent(componentPath, category, dryRun = false) {
  if (dryRun) {
    console.log(`[DRY RUN] 将重构组件: ${componentPath} -> ${category}`);
    return;
  }
  
  try {
    execSync(`node ${path.join(__dirname, 'restructure-component.js')} ${componentPath} ${category}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`重构组件失败: ${componentPath}`);
    console.error(error.message);
  }
}

// 批量重构组件
function batchRestructure() {
  console.log('开始批量重构组件...');
  console.log(`模式: ${dryRun ? '预演 (dry run)' : '实际执行'}`);
  
  if (targetCategory) {
    console.log(`只处理类别: ${targetCategory}`);
  }
  
  // 查找所有组件文件
  const componentFiles = findComponentFiles();
  console.log(`找到 ${componentFiles.length} 个需要重构的组件`);
  
  // 按类别分组
  const componentsByCategory = {};
  
  componentFiles.forEach(componentPath => {
    const category = determineComponentCategory(componentPath);
    
    if (!componentsByCategory[category]) {
      componentsByCategory[category] = [];
    }
    
    componentsByCategory[category].push(componentPath);
  });
  
  // 显示分类结果
  console.log('\n组件分类结果:');
  for (const [category, components] of Object.entries(componentsByCategory)) {
    console.log(`${category}: ${components.length} 个组件`);
  }
  
  // 重构组件
  console.log('\n开始重构组件:');
  for (const [category, components] of Object.entries(componentsByCategory)) {
    // 如果指定了目标类别，只处理该类别
    if (targetCategory && category !== targetCategory) {
      continue;
    }
    
    console.log(`\n处理 ${category} 类别的组件:`);
    components.forEach(componentPath => {
      restructureComponent(componentPath, category, dryRun);
    });
  }
  
  console.log('\n批量重构完成！');
  if (dryRun) {
    console.log('这只是一个预演，没有实际修改文件。使用不带 --dry-run 参数的命令来实际执行重构。');
  }
}

// 执行批量重构
batchRestructure();
