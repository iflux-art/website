/**
 * 组件审计脚本
 *
 * 该脚本用于：
 * 1. 收集项目中所有组件的信息
 * 2. 分析组件的结构和依赖关系
 * 3. 生成组件审计报告
 */

const fs = require('fs');
const path = require('path');

// 组件目录路径
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');
// 输出报告路径
const REPORT_PATH = path.resolve(__dirname, '../component-audit-report.md');

// 组件类别
const COMPONENT_CATEGORIES = ['ui', 'features', 'layout'];

// 组件信息结构
const componentRegistry = {
  ui: [],
  features: [],
  layout: [],
  uncategorized: []
};

// 组件问题跟踪
const componentIssues = [];

// 递归查找组件文件
function findComponentFiles(dir, category = 'uncategorized') {
  // 检查目录是否存在
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`);
    return;
  }

  try {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);

      try {
        const stats = fs.statSync(itemPath);

        if (stats.isFile() && (item.endsWith('.tsx') || item.endsWith('.jsx'))) {
          // 排除index.ts/js文件
          if (item === 'index.tsx' || item === 'index.jsx' || item === 'index.ts' || item === 'index.js') {
            return;
          }

          // 这是一个组件文件
          const componentName = path.basename(item, path.extname(item));
          const relativePath = path.relative(COMPONENTS_DIR, itemPath);
          const content = fs.readFileSync(itemPath, 'utf8');

          // 确定正确的类别
          let actualCategory = category;
          for (const cat of COMPONENT_CATEGORIES) {
            if (relativePath.startsWith(cat + '/')) {
              actualCategory = cat;
              break;
            }
          }

          // 分析组件
          const componentInfo = analyzeComponent(componentName, itemPath, content, actualCategory);

          // 添加到注册表
          componentRegistry[actualCategory].push(componentInfo);
        } else if (stats.isDirectory()) {
          // 递归处理子目录
          // 如果目录名是组件类别之一，更新当前类别
          const dirName = path.basename(itemPath);
          const newCategory = COMPONENT_CATEGORIES.includes(dirName) ? dirName : category;

          findComponentFiles(itemPath, newCategory);
        }
      } catch (err) {
        console.error(`处理文件/目录时出错: ${itemPath}`, err.message);
      }
    });
  } catch (err) {
    console.error(`读取目录时出错: ${dir}`, err.message);
  }
}

// 分析组件内容
function analyzeComponent(name, filePath, content, category) {
  const relativePath = path.relative(COMPONENTS_DIR, filePath);
  const issues = [];

  // 检查是否有类型定义
  const hasTypeDefinition = content.includes('interface') ||
                           content.includes('type ') ||
                           content.includes('Props');

  if (!hasTypeDefinition) {
    issues.push('缺少类型定义');
  }

  // 检查是否有注释
  const hasComments = content.includes('/**') ||
                     (content.match(/\/\//g) || []).length > 1;

  if (!hasComments) {
    issues.push('缺少注释');
  }

  // 检查是否有导出
  const hasExport = content.includes('export ');

  if (!hasExport) {
    issues.push('缺少导出');
  }

  // 检查是否在正确的目录
  const isInCorrectDir = path.dirname(relativePath).includes(name.toLowerCase()) ||
                        path.basename(path.dirname(filePath)) === name.toLowerCase();

  if (!isInCorrectDir) {
    issues.push('不在独立目录中');
  }

  // 检查是否有index.ts导出
  const dirPath = path.dirname(filePath);
  const hasIndexFile = fs.existsSync(path.join(dirPath, 'index.ts')) ||
                      fs.existsSync(path.join(dirPath, 'index.js'));

  if (!hasIndexFile && isInCorrectDir) {
    issues.push('缺少index导出文件');
  }

  // 如果有问题，添加到问题列表
  if (issues.length > 0) {
    componentIssues.push({
      name,
      path: relativePath,
      category,
      issues
    });
  }

  // 分析导入
  const imports = [];
  const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return {
    name,
    path: relativePath,
    category,
    hasTypeDefinition,
    hasComments,
    hasExport,
    isInCorrectDir,
    hasIndexFile,
    imports,
    issues: issues.length > 0 ? issues : null
  };
}

// 生成审计报告
function generateReport() {
  let report = `# 组件审计报告\n\n`;
  report += `生成时间: ${new Date().toLocaleString()}\n\n`;

  // 组件统计
  report += `## 组件统计\n\n`;
  report += `| 类别 | 数量 |\n`;
  report += `|------|------|\n`;

  let totalComponents = 0;
  for (const category of [...COMPONENT_CATEGORIES, 'uncategorized']) {
    const count = componentRegistry[category].length;
    totalComponents += count;
    report += `| ${category} | ${count} |\n`;
  }

  report += `| **总计** | **${totalComponents}** |\n\n`;

  // 组件问题
  report += `## 组件问题\n\n`;
  report += `共发现 ${componentIssues.length} 个组件存在问题：\n\n`;

  if (componentIssues.length > 0) {
    report += `| 组件名 | 类别 | 问题 |\n`;
    report += `|--------|------|------|\n`;

    for (const issue of componentIssues) {
      report += `| ${issue.name} | ${issue.category} | ${issue.issues.join(', ')} |\n`;
    }
  } else {
    report += `没有发现问题，太棒了！\n`;
  }

  report += `\n## 重构建议\n\n`;

  // 根据问题生成建议
  const needsTypeDefinition = componentIssues.filter(i => i.issues.includes('缺少类型定义')).length;
  const needsComments = componentIssues.filter(i => i.issues.includes('缺少注释')).length;
  const needsDirectory = componentIssues.filter(i => i.issues.includes('不在独立目录中')).length;
  const needsIndexFile = componentIssues.filter(i => i.issues.includes('缺少index导出文件')).length;

  if (needsTypeDefinition > 0) {
    report += `- 为 ${needsTypeDefinition} 个组件添加类型定义\n`;
  }

  if (needsComments > 0) {
    report += `- 为 ${needsComments} 个组件添加注释\n`;
  }

  if (needsDirectory > 0) {
    report += `- 将 ${needsDirectory} 个组件移动到独立目录\n`;
  }

  if (needsIndexFile > 0) {
    report += `- 为 ${needsIndexFile} 个组件创建index导出文件\n`;
  }

  // 写入报告文件
  fs.writeFileSync(REPORT_PATH, report);
  console.log(`审计报告已生成: ${REPORT_PATH}`);
}

// 主函数
function auditComponents() {
  console.log('开始组件审计...');

  // 查找所有组件
  findComponentFiles(COMPONENTS_DIR);

  // 生成报告
  generateReport();

  console.log('组件审计完成！');
}

// 执行审计
auditComponents();
