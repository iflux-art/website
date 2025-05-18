/**
 * 翻译功能测试脚本
 * 用于验证翻译功能是否正常工作
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 测试目录
const TEST_DIR = path.join(process.cwd(), 'test-translation');
const ZH_DIR = path.join(TEST_DIR, 'zh');
const EN_DIR = path.join(TEST_DIR, 'en');

// 创建测试目录结构
function setupTestEnvironment() {
  console.log('🔧 设置测试环境...');
  
  // 清理之前的测试目录
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  
  // 创建测试目录结构
  fs.mkdirSync(ZH_DIR, { recursive: true });
  
  // 创建测试MDX文件
  const testMdx = `---
title: 测试文档
description: 这是一个用于测试翻译功能的文档
---

## 测试标题

这是一段测试文本，用于验证翻译功能是否正常工作。

### 代码示例

```js
// 这是一段JavaScript代码
const test = () => {
  console.log('这段注释不应该被翻译');
  return true;
};
```

### 列表测试

- 项目一
- 项目二
- 项目三
`;
  
  fs.writeFileSync(path.join(ZH_DIR, 'test.mdx'), testMdx);
  
  // 创建测试_meta.json文件
  const testMeta = {
    "sidebar": {
      "测试分类": {
        "title": "测试分类标题",
        "items": ["测试项目一", "测试项目二"]
      }
    }
  };
  
  fs.writeFileSync(path.join(ZH_DIR, '_meta.json'), JSON.stringify(testMeta, null, 2));
  
  console.log('✅ 测试环境设置完成');
}

// 运行翻译测试
async function runTranslationTest() {
  console.log('🔄 开始翻译测试...');
  
  try {
    // 修改环境变量，指向测试目录
    process.env.TEST_SOURCE_DIR = ZH_DIR;
    process.env.TEST_TARGET_DIR = EN_DIR;
    
    // 运行翻译脚本
    execSync('node -e "require(\'./scripts/translate-content.ts\').testTranslation()"', {
      stdio: 'inherit',
      env: process.env
    });
    
    // 验证翻译结果
    if (!fs.existsSync(EN_DIR)) {
      throw new Error('翻译失败：未生成英文目录');
    }
    
    if (!fs.existsSync(path.join(EN_DIR, 'test.mdx'))) {
      throw new Error('翻译失败：未生成英文测试文件');
    }
    
    if (!fs.existsSync(path.join(EN_DIR, '_meta.json'))) {
      throw new Error('翻译失败：未生成英文元数据文件');
    }
    
    console.log('✅ 翻译测试通过');
    return true;
  } catch (error) {
    console.error('❌ 翻译测试失败:', error);
    return false;
  } finally {
    // 清理测试目录
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  }
}

// 运行测试
(async function() {
  setupTestEnvironment();
  const success = await runTranslationTest();
  
  if (success) {
    console.log('🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.error('💥 测试失败！');
    process.exit(1);
  }
})();