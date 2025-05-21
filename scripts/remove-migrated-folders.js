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

  // 找出需要删除的文件夹
  const foldersToDelete = folders.filter(folder => migratedComponents.includes(folder));

  console.log('需要删除的文件夹:');
  foldersToDelete.forEach(folder => {
    console.log(`- ${folder}`);
  });

  // 确认删除
  console.log(`\n共找到 ${foldersToDelete.length} 个需要删除的文件夹`);

  // 删除文件夹
  foldersToDelete.forEach(folder => {
    const folderPath = path.join(uiDir, folder);
    try {
      // 使用 fs.rmSync 递归删除文件夹及其内容
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`已删除: ${folderPath}`);
    } catch (error) {
      console.error(`删除 ${folderPath} 失败:`, error);
    }
  });

  console.log('\n删除完成!');
} catch (error) {
  console.error('读取目录失败:', error);
}
