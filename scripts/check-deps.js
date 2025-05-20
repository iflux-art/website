/**
 * 检查依赖兼容性的脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取 package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 检查 React 和 Next.js 版本
const reactVersion = packageJson.dependencies.react;
const nextVersion = packageJson.dependencies.next;

console.log(`React 版本: ${reactVersion}`);
console.log(`Next.js 版本: ${nextVersion}`);

// 检查可能的兼容性问题
const potentialIssues = [];

// 检查 React 19 兼容性
if (reactVersion.includes('19')) {
  console.log('⚠️ 检测到 React 19，检查兼容性问题...');
  
  // 检查 @testing-library/react 兼容性
  const testingLibraryReact = packageJson.devDependencies['@testing-library/react'];
  if (testingLibraryReact && !testingLibraryReact.includes('15')) {
    potentialIssues.push(`@testing-library/react ${testingLibraryReact} 可能与 React 19 不兼容，建议升级到 15.x 版本`);
  }
  
  // 检查其他可能不兼容的库
  const reactDomVersion = packageJson.dependencies['react-dom'];
  if (reactDomVersion && !reactDomVersion.includes('19')) {
    potentialIssues.push(`react-dom ${reactDomVersion} 与 React 19 不兼容，应该使用相同的版本`);
  }
}

// 检查 Next.js 15 兼容性
if (nextVersion.includes('15')) {
  console.log('⚠️ 检测到 Next.js 15，检查兼容性问题...');
  
  // 检查 eslint-config-next 兼容性
  const eslintConfigNext = packageJson.devDependencies['eslint-config-next'];
  if (eslintConfigNext && !eslintConfigNext.includes('15')) {
    potentialIssues.push(`eslint-config-next ${eslintConfigNext} 与 Next.js 15 不兼容，应该使用相同的版本`);
  }
  
  // 检查 @next/mdx 兼容性
  const nextMdx = packageJson.dependencies['@next/mdx'];
  if (nextMdx && !nextMdx.includes('15')) {
    potentialIssues.push(`@next/mdx ${nextMdx} 与 Next.js 15 不兼容，应该使用相同的版本`);
  }
}

// 检查 Node.js 版本
try {
  const nodeVersion = process.version;
  console.log(`\nNode.js 版本: ${nodeVersion}`);
  
  // 读取 .nvmrc 文件
  let requiredNodeVersion = '';
  try {
    const nvmrcPath = path.join(process.cwd(), '.nvmrc');
    if (fs.existsSync(nvmrcPath)) {
      requiredNodeVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();
      console.log(`项目要求的 Node.js 版本 (.nvmrc): ${requiredNodeVersion}`);
      
      // 简单版本比较
      const currentVersion = nodeVersion.replace('v', '');
      if (!currentVersion.startsWith(requiredNodeVersion)) {
        console.log(`⚠️ 当前 Node.js 版本 (${nodeVersion}) 可能与项目要求的版本 (${requiredNodeVersion}) 不兼容。`);
        console.log('建议使用 nvm 或其他工具切换到指定版本的 Node.js。');
        potentialIssues.push(`Node.js 版本不匹配: 当前 ${nodeVersion}, 要求 ${requiredNodeVersion}`);
      }
    }
  } catch (error) {
    console.log('⚠️ 无法读取 .nvmrc 文件。');
  }
} catch (error) {
  console.log('\n⚠️ 无法检查 Node.js 版本。');
}

// 检查 pnpm 版本
try {
  const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
  console.log(`\npnpm 版本: ${pnpmVersion}`);
  
  // 检查 pnpm 版本兼容性
  const packageManager = packageJson.packageManager;
  if (packageManager && packageManager.startsWith('pnpm@')) {
    const requiredPnpmVersion = packageManager.replace('pnpm@', '');
    console.log(`package.json 中指定的 pnpm 版本: ${requiredPnpmVersion}`);
    
    if (pnpmVersion !== requiredPnpmVersion) {
      console.log(`⚠️ 当前 pnpm 版本 (${pnpmVersion}) 与 package.json 中指定的版本 (${requiredPnpmVersion}) 不匹配。`);
      console.log('建议使用指定版本的 pnpm 安装依赖。');
      potentialIssues.push(`pnpm 版本不匹配: 当前 ${pnpmVersion}, 要求 ${requiredPnpmVersion}`);
    }
  }
} catch (error) {
  console.log('\n⚠️ 无法检查 pnpm 版本。');
}

// 输出潜在问题
if (potentialIssues.length > 0) {
  console.log('\n⚠️ 检测到潜在的依赖兼容性问题:');
  potentialIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  console.log('\n建议解决这些问题后再尝试构建。');
} else {
  console.log('\n✅ 未检测到明显的依赖兼容性问题。');
}
