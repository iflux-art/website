const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 更新 Card 组件的导入路径
 */
function updateCardImports() {
  const files = glob.sync('src/**/*.{ts,tsx}');
  let updatedFiles = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;
    
    // 替换 @/components/ui/card/card 为 @/components/ui/card
    const oldPattern1 = /from\s+['"]@\/components\/ui\/card\/card['"]/g;
    if (oldPattern1.test(content)) {
      content = content.replace(oldPattern1, 'from "@/components/ui/card"');
      updated = true;
    }
    
    // 替换 @/components/ui/card/index 为 @/components/ui/card
    const oldPattern2 = /from\s+['"]@\/components\/ui\/card\/index['"]/g;
    if (oldPattern2.test(content)) {
      content = content.replace(oldPattern2, 'from "@/components/ui/card"');
      updated = true;
    }
    
    // 替换 @/components/ui/card/card.types 中的类型导入
    const oldPattern3 = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/ui\/card\/card\.types['"]/g;
    if (oldPattern3.test(content)) {
      content = content.replace(oldPattern3, 'import {$1} from "@/components/ui/card"');
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(file, content);
      console.log(`Updated Card imports in ${file}`);
      updatedFiles++;
    }
  });
  
  console.log(`Updated ${updatedFiles} files.`);
}

updateCardImports();
