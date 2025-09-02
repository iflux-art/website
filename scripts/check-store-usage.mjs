#!/usr/bin/env node

// 检查store使用情况的脚本
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 递归查找文件
function findFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = [...results, ...findFiles(file, extension)];
    } else if (file.endsWith(extension)) {
      results.push(file);
    }
  });
  
  return results;
}

// 检查store使用情况
function checkStoreUsage() {
  console.log('检查store使用情况...\n');
  
  // 查找所有TypeScript和TSX文件
  const tsFiles = findFiles(join(projectRoot, 'src'), '.ts');
  const tsxFiles = findFiles(join(projectRoot, 'src'), '.tsx');
  const allFiles = [...tsFiles, ...tsxFiles];
  
  // 定义store名称
  const storeNames = [
    'useAppStore',
    'useAuthStore',
    'useBlogPageStore',
    'useBlogStore',
    'useDocsGlobalStructureStore',
    'useDocsStore',
    'useFriendsStore',
    'useLayoutStore',
    'useLinkFilterStore',
    'useLinksDataStore',
    'useNavbarStore',
    'useSearchStore',
    'useThemeStore',
    'useAdminStore'
  ];
  
  let usageCount = 0;
  let filesWithUsage = new Set();
  
  // 检查每个文件中store的使用情况
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let fileUsed = false;
      
      for (const storeName of storeNames) {
        if (content.includes(storeName)) {
          usageCount++;
          fileUsed = true;
        }
      }
      
      if (fileUsed) {
        filesWithUsage.add(file);
      }
    } catch (error) {
      console.error(`读取文件时出错 ${file}: ${error.message}`);
    }
  }
  
  console.log(`发现 ${usageCount} 处store使用`);
  console.log(`在 ${filesWithUsage.size} 个文件中使用了store`);
  
  if (filesWithUsage.size > 0) {
    console.log('\n使用store的文件:');
    for (const file of filesWithUsage) {
      console.log(`- ${file.replace(projectRoot, '')}`);
    }
  }
  
  return usageCount > 0;
}

// 运行检查
const hasUsage = checkStoreUsage();

if (hasUsage) {
  console.log('\n✅ Store使用检查通过');
  process.exit(0);
} else {
  console.log('\n⚠️ 未发现store使用');
  process.exit(1);
}