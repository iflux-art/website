const fs = require('fs');
const path = require('path');

// 获取 UI 组件目录
const uiDir = path.join('src', 'components', 'ui');

// 读取目录内容
try {
  const items = fs.readdirSync(uiDir, { withFileTypes: true });
  
  // 过滤出文件夹
  const folders = items
    .filter(item => item.isDirectory())
    .map(item => item.name);
  
  console.log('UI 组件文件夹:');
  folders.forEach(folder => {
    console.log(`- ${folder}`);
  });
  
  console.log(`\n共找到 ${folders.length} 个文件夹`);
} catch (error) {
  console.error('读取目录失败:', error);
}
