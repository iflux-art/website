---
title: 自动翻译功能文档
excerpt: 本项目实现了一个自动翻译功能，可以在构建时将中文内容自动翻译为英文内容。
date: '2024-01-01'
tags: ['翻译', '国际化', '技术文档']
published: true
---

本项目实现了一个自动翻译功能，可以在构建时将中文内容（`src/content/zh`）自动翻译为英文内容（`src/content/en`）。这样开发者只需要维护中文版本的内容，英文版本会在构建过程中自动生成。

## 技术实现

### 核心组件

1. **翻译脚本**: `scripts/translate-content.ts`
   - 递归处理所有中文内容文件
   - 支持MDX文件的frontmatter和内容翻译
   - 保留代码块不翻译
   - 支持`_meta.json`文件的翻译

2. **构建钩子**: `scripts/next-build-hook.js`
   - 在Next.js构建前自动运行翻译脚本
   - 集成到npm build命令中

### 翻译API

默认配置使用Azure翻译API，需要在环境变量中配置相关密钥：

```
AZURE_TRANSLATOR_KEY=your_api_key_here
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION=global
```

如果未配置API密钥，系统会使用模拟翻译功能（仅用于开发环境）。

## 使用方法

### 开发流程

1. 只需编辑和维护`src/content/zh`目录中的中文内容
2. 运行构建命令时，系统会自动翻译并生成英文内容

### 可用命令

- `pnpm build`: 构建项目（包含自动翻译步骤）
- `pnpm translate`: 仅运行翻译脚本，不进行项目构建

### 环境配置

1. 复制`.env.example`文件为`.env.local`
2. 在`.env.local`中填入Azure翻译API的密钥和配置

## 注意事项

1. **代码块处理**: 翻译过程会保留代码块内容不变，确保代码示例不会被翻译
2. **元数据处理**: 支持翻译`_meta.json`文件中的配置信息
3. **文件同步**: 每次构建前会清空英文内容目录，确保内容同步
4. **API限制**: 请注意Azure翻译API的使用限制和计费情况

## 扩展与定制

如需更改翻译服务提供商，可以修改`scripts/translate-content.ts`文件中的`translateText`函数，替换为其他翻译API的实现。

## 故障排除

- 如果翻译过程中出现错误，请检查API密钥配置是否正确
- 如果特定内容翻译不准确，可以在模拟翻译函数的字典中添加更多常用词汇映射
- 如果构建过程中翻译步骤失败，可以单独运行`pnpm translate`命令查看详细错误信息