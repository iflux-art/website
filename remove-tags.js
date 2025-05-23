const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 获取所有导航 MDX 文件
const navigationDir = path.join(process.cwd(), 'src', 'content', 'navigation');

// 递归查找所有 MDX 文件
function findMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 处理 MDX 文件，移除 tags 字段
function processMdxFile(filePath) {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // 检查是否有 tags 字段
    if (data.tags) {
      console.log(`处理文件: ${filePath}`);
      console.log(`  移除 tags: ${JSON.stringify(data.tags)}`);
      
      // 移除 tags 字段
      delete data.tags;
      
      // 重新生成文件内容
      const newContent = matter.stringify(content, data);
      
      // 写入文件
      fs.writeFileSync(filePath, newContent);
      console.log(`  文件已更新`);
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 处理 MDX 文件中的 ResourceCard 组件，移除 tags 属性
function processResourceCardTags(filePath) {
  try {
    // 读取文件内容
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 使用正则表达式查找并移除 ResourceCard 组件中的 tags 属性
    // 匹配 tags="xxx" 或 tags={xxx} 格式
    const tagsRegex = /tags=\{([^}]+)\}|tags="([^"]+)"/g;
    
    // 检查是否有 tags 属性
    if (tagsRegex.test(fileContent)) {
      console.log(`处理文件中的 ResourceCard: ${filePath}`);
      
      // 移除 tags 属性
      fileContent = fileContent.replace(/(\s+)tags=\{([^}]+)\}|\s+tags="([^"]+)"/g, '');
      
      // 写入文件
      fs.writeFileSync(filePath, fileContent);
      console.log(`  文件已更新`);
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 主函数
function main() {
  const mdxFiles = findMdxFiles(navigationDir);
  console.log(`找到 ${mdxFiles.length} 个 MDX 文件`);
  
  mdxFiles.forEach(filePath => {
    // 处理 frontmatter 中的 tags 字段
    processMdxFile(filePath);
    
    // 处理 ResourceCard 组件中的 tags 属性
    processResourceCardTags(filePath);
  });
  
  console.log('所有文件处理完成');
}

main();
