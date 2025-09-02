#!/usr/bin/env node

// 验证所有store是否正确导出
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const storesDir = join(projectRoot, 'src', 'stores');

console.log('验证store索引文件...\n');

// 读取index.ts文件
const indexPath = join(storesDir, 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// 定义store名称到导出名称的映射
const storeExportMap = {
  'admin-store': 'useAdminStore',
  'app-store': 'useAppStore',
  'auth-store': 'useAuthStore',
  'blog-page-store': 'useBlogPageStore',
  'blog-store': 'useBlogStore',
  'docs-global-structure-store': 'useDocsGlobalStructureStore',
  'docs-store': 'useDocsStore',
  'friends-store': 'useFriendsStore',
  'layout-store': 'useLayoutStore',
  'link-filter-store': 'useLinkFilterStore',
  'links-data-store': 'useLinksDataStore',
  'navbar-store': 'useNavbarStore',
  'search-store': 'useSearchStore',
  'theme-store': 'useThemeStore'
};

// 获取所有标准化store文件
const standardStoreFiles = Object.keys(storeExportMap);

console.log(`发现 ${standardStoreFiles.length} 个标准化store:`);
console.log(standardStoreFiles.map(f => `- ${f}`).join('\n'));

// 检查index.ts中是否正确导出了所有store
let passed = 0;
let failed = 0;

for (const storeName of standardStoreFiles) {
  const exportName = storeExportMap[storeName];
  const exportLine = `export { ${exportName} } from "./${storeName}.standard";`;
  
  if (indexContent.includes(exportLine)) {
    console.log(`✅ ${storeName}: 正确导出为 ${exportName}`);
    passed++;
  } else {
    console.error(`❌ ${storeName}: 缺少导出或导出格式不正确`);
    console.error(`   应该包含: ${exportLine}`);
    failed++;
  }
}

// 检查是否有重复导出
const exportMatches = indexContent.match(/export { use\w+Store }/g);
if (exportMatches) {
  const uniqueExports = new Set(exportMatches);
  if (uniqueExports.size !== exportMatches.length) {
    console.error(`\n❌ 发现重复导出`);
    failed++;
  }
}

console.log(`\n验证完成:`);
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败: ${failed}`);
console.log(`总计: ${standardStoreFiles.length}`);

process.exit(failed > 0 ? 1 : 0);