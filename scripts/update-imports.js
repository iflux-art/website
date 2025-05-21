const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

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

/**
 * 更新导入路径
 */
function updateImports() {
  const files = globSync('src/**/*.{ts,tsx,js,jsx}');
  let updatedFiles = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;

    // 处理每个已迁移的组件
    migratedComponents.forEach(component => {
      // 替换 @/components/ui/component/component 为 @/components/ui/component
      const oldPattern1 = new RegExp(`from\\s+['"]@/components/ui/${component}/${component}['"]`, 'g');
      if (oldPattern1.test(content)) {
        content = content.replace(oldPattern1, `from "@/components/ui/${component}"`);
        updated = true;
      }

      // 替换 @/components/ui/component/index 为 @/components/ui/component
      const oldPattern2 = new RegExp(`from\\s+['"]@/components/ui/${component}/index['"]`, 'g');
      if (oldPattern2.test(content)) {
        content = content.replace(oldPattern2, `from "@/components/ui/${component}"`);
        updated = true;
      }

      // 替换 @/components/ui/component/component.types 中的类型导入
      const oldPattern3 = new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+['"]@/components/ui/${component}/${component}\\.types['"]`, 'g');
      if (oldPattern3.test(content)) {
        content = content.replace(oldPattern3, `import {$1} from "@/components/ui/${component}"`);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(file, content);
      console.log(`Updated imports in ${file}`);
      updatedFiles++;
    }
  });

  console.log(`\n更新完成! 共更新了 ${updatedFiles} 个文件.`);
}

// 执行更新
updateImports();
