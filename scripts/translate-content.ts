const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');
const { loadEnv } = require('./env');

/** @typedef {import('../types/translation').TranslateParams} TranslateParams */

// 翻译API接口
interface TranslationResponse {
  translations: {
    text: string;
  }[];
}

// 翻译函数 - 使用Azure翻译API
async function translateText(text: string, targetLang: string = 'en'): Promise<string> {
  // 注意：在实际使用时，需要配置环境变量来存储API密钥
  const apiKey = process.env.AZURE_TRANSLATOR_KEY;
  const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
  const region = process.env.AZURE_TRANSLATOR_REGION || 'global';
  
  // 如果没有API密钥，使用模拟翻译（开发环境）
  if (!apiKey) {
    console.warn('警告: 未设置翻译API密钥，使用模拟翻译');
    return mockTranslate(text);
  }

  try {
    const url = `${endpoint}/translate?api-version=3.0&from=zh-Hans&to=${targetLang}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`翻译请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as TranslationResponse[];
    return data[0].translations[0].text;
  } catch (error) {
    console.error('翻译出错:', error);
    return mockTranslate(text);
  }
}

// 模拟翻译函数（当API密钥未设置时使用）
function mockTranslate(text: string): string {
  // 简单替换一些常见中文词汇
  const dictionary: Record<string, string> = {
    '安装': 'Installation',
    '指南': 'Guide',
    '通过': 'Via',
    '安装指南': 'Installation Guide',
    '项目': 'Project',
    '介绍': 'Introduction',
    '功能': 'Features',
    '使用': 'Usage',
    '文档': 'Documentation',
    '开始': 'Getting Started',
    '配置': 'Configuration',
    '示例': 'Examples',
  };

  let translatedText = text;
  for (const [zh, en] of Object.entries(dictionary)) {
    translatedText = translatedText.replace(new RegExp(zh, 'g'), en);
  }
  
  return translatedText;
}

// 处理代码块，防止翻译代码
function processCodeBlocks(content: string): { processedContent: string, codeBlocks: string[] } {
  const codeBlocks: string[] = [];
  const codeBlockRegex = /```[\s\S]*?```/g;
  
  // 替换代码块为占位符
  const processedContent = content.replace(codeBlockRegex, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });
  
  return { processedContent, codeBlocks };
}

// 恢复代码块
function restoreCodeBlocks(content: string, codeBlocks: string[]): string {
  let restoredContent = content;
  codeBlocks.forEach((block, index) => {
    restoredContent = restoredContent.replace(`__CODE_BLOCK_${index}__`, block);
  });
  return restoredContent;
}

// 翻译MDX文件
async function translateMdxFile(filePath: string, outputPath: string): Promise<void> {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);
    
    // 处理代码块
    const { processedContent, codeBlocks } = processCodeBlocks(content);
    
    // 翻译frontmatter
    const translatedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        translatedData[key] = await translateText(value);
      } else {
        translatedData[key] = value;
      }
    }
    
    // 翻译内容
    const translatedContent = await translateText(processedContent);
    
    // 恢复代码块
    const finalContent = restoreCodeBlocks(translatedContent, codeBlocks);
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入翻译后的文件
    const translatedFileContent = matter.stringify(finalContent, translatedData);
    fs.writeFileSync(outputPath, translatedFileContent);
    
    console.log(`已翻译: ${path.relative(process.cwd(), filePath)} -> ${path.relative(process.cwd(), outputPath)}`);
  } catch (error) {
    console.error(`翻译文件失败 ${filePath}:`, error);
  }
}

// 递归处理目录
async function processDirectory(sourceDir: string, targetDir: string): Promise<void> {
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 读取源目录中的所有文件和子目录
  const items = fs.readdirSync(sourceDir);
  
  // 处理每个项目
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // 递归处理子目录
      await processDirectory(sourcePath, targetPath);
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      // 处理MDX文件
      await translateMdxFile(sourcePath, targetPath);
    } else if (item === '_meta.json') {
      // 处理_meta.json文件
      const metaContent = fs.readFileSync(sourcePath, 'utf8');
      const metaData = JSON.parse(metaContent);
      
      // 翻译元数据
      const translatedMeta: Record<string, any> = {};
      for (const [key, value] of Object.entries(metaData)) {
        if (typeof value === 'string') {
          translatedMeta[key] = await translateText(value);
        } else if (typeof value === 'object' && value !== null) {
          const translatedObj: Record<string, any> = {};
          for (const [subKey, subValue] of Object.entries(value as Record<string, any>)) {
            if (typeof subValue === 'string') {
              translatedObj[subKey] = await translateText(subValue);
            } else {
              translatedObj[subKey] = subValue;
            }
          }
          translatedMeta[key] = translatedObj;
        } else {
          translatedMeta[key] = value;
        }
      }
      
      // 写入翻译后的元数据
      fs.writeFileSync(targetPath, JSON.stringify(translatedMeta, null, 2));
      console.log(`已翻译元数据: ${path.relative(process.cwd(), sourcePath)}`);
    } else {
      // 复制其他文件
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// 主函数
async function main() {
  // 加载环境变量
  loadEnv();
  
  const sourceDir = path.join(process.cwd(), 'src', 'content', 'zh');
  const targetDir = path.join(process.cwd(), 'src', 'content', 'en');
  
  console.log('开始翻译内容...');
  console.time('翻译完成');
  
  try {
    // 清空目标目录
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    // 处理内容
    await processDirectory(sourceDir, targetDir);
    
    console.log('翻译完成!');
    console.timeEnd('翻译完成');
  } catch (error) {
    console.error('翻译过程中出错:', error);
    process.exit(1);
  }
}

// 测试翻译功能
async function testTranslation() {
  // 加载环境变量
  loadEnv();
  
  // 使用环境变量中的测试目录
  const sourceDir = process.env.TEST_SOURCE_DIR || path.join(process.cwd(), 'test-translation', 'zh');
  const targetDir = process.env.TEST_TARGET_DIR || path.join(process.cwd(), 'test-translation', 'en');
  
  console.log('开始测试翻译...');
  console.log(`源目录: ${sourceDir}`);
  console.log(`目标目录: ${targetDir}`);
  
  try {
    // 清空目标目录
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    // 处理内容
    await processDirectory(sourceDir, targetDir);
    
    console.log('测试翻译完成!');
    return true;
  } catch (error) {
    console.error('测试翻译过程中出错:', error);
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { main as translateContent, testTranslation };