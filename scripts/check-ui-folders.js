const fs = require('fs');
const path = require('path');

// 已迁移的 shadcn/ui 组件列表
const migratedComponents = [
  'alert',
  'avatar',
  'button',
  'card',
  'checkbox',
  'collapsible',
  'command',
  'dialog',
  'input',
  'label',
  'sheet',
  'tabs',
  'textarea',
  'toggle'
];

// 获取 UI 组件目录
const uiDir = path.join('src', 'components', 'ui');

// 检查目录是否存在
if (!fs.existsSync(uiDir)) {
  console.error('UI 组件目录不存在:', uiDir);
  process.exit(1);
}

// 读取目录内容
try {
  const items = fs.readdirSync(uiDir, { withFileTypes: true });
  
  // 过滤出文件夹
  const folders = items
    .filter(item => item.isDirectory())
    .map(item => item.name);
  
  console.log('UI 组件文件夹:');
  
  // 检查每个文件夹
  const foldersToDelete = [];
  
  folders.forEach(folder => {
    if (migratedComponents.includes(folder)) {
      console.log(`- ${folder} (已迁移，可以删除)`);
      foldersToDelete.push(folder);
    } else {
      console.log(`- ${folder}`);
    }
  });
  
  console.log(`\n共找到 ${folders.length} 个文件夹，其中 ${foldersToDelete.length} 个可以删除`);
  
  if (foldersToDelete.length > 0) {
    console.log('\n可以删除的文件夹:');
    foldersToDelete.forEach(folder => {
      console.log(`- ${folder}`);
    });
  }
} catch (error) {
  console.error('读取目录失败:', error);
}
