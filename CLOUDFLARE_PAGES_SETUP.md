# Cloudflare Pages 部署设置

## 问题分析

您遇到的问题是 Next.js 应用在 Cloudflare Pages 上显示简单状态页面而不是实际首页。这通常是由于以下原因：

1. **构建配置不正确**：Next.js 应用没有正确构建为静态资源
2. **路由配置问题**：Cloudflare Pages 无法正确处理 Next.js 的动态路由
3. **API 路由处理**：服务器端功能没有正确转换为 Cloudflare Functions

## 解决方案

### 1. Cloudflare Pages 设置

在 Cloudflare Pages 控制台中连接您的 GitHub 仓库后：

**构建设置：**
- 框架预设：`Next.js`
- 构建命令：`pnpm install && pnpm run build`
- 构建输出目录：`.next`
- Node.js 版本：`20.11.1`

**环境变量：**
```
NODE_VERSION=20.11.1
NEXT_PUBLIC_SITE_URL=https://your-domain.com
PNPM_VERSION=9.11.0
```

### 2. 项目配置修改

我已经恢复了基本的 Next.js 配置，移除了可能导致构建问题的复杂配置。

### 3. 静态导出配置

如果您希望使用静态导出（推荐用于 Cloudflare Pages），需要修改 `next.config.mjs`：

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

### 4. API 路由处理

对于 Cloudflare Pages，有两种处理 API 路由的方式：

**选项 A：转换为 Cloudflare Functions**
- 将 `src/app/api` 目录下的路由转换为 `functions` 目录
- 使用 Cloudflare Workers 语法

**选项 B：预构建数据（推荐）**
- 在构建时生成所有数据
- 移除客户端 API 调用
- 使用 `getStaticProps` 或服务器组件

## 推荐的部署流程

### 方案 1：静态导出（最简单）

1. 修改 `next.config.mjs` 启用静态导出
2. 修改组件移除 API 调用，改为构建时数据生成
3. 设置 Cloudflare Pages 构建输出目录为 `out`

### 方案 2：保持当前架构

1. 保持当前配置
2. 在 Cloudflare Pages 中设置构建输出目录为 `.next`
3. 确保 API 路由正确转换为 Cloudflare Functions

## 修复内容

我已经修复了以下问题：

### ✅ 已修复
1. **移除了导致构建失败的 Cloudflare 特定配置**
2. **删除了 .babelrc 文件以启用 SWC 编译器**
3. **恢复了标准的 Next.js 配置**
4. **简化了 package.json 脚本**
5. **测试确认开发服务器和构建都正常工作**

### 🔧 配置状态
- ✅ 开发服务器正常启动 (`pnpm dev`)
- ✅ 构建成功完成 (`pnpm build`)
- ✅ 所有 API 路由正常工作
- ✅ 静态页面正确生成

## Cloudflare Pages 部署步骤

1. **在 Cloudflare Pages 控制台中：**
   - 连接您的 GitHub 仓库
   - 选择 `Next.js` 框架预设
   - 构建命令：`pnpm install && pnpm run build`
   - 构建输出目录：`.next`
   - Node.js 版本：`20.11.1`

2. **设置环境变量：**
   ```
   NODE_VERSION=20.11.1
   PNPM_VERSION=9.11.0
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

3. **触发部署：**
   - 推送代码到 GitHub
   - Cloudflare Pages 会自动构建和部署

## 预期结果

现在您的应用应该能够：
- 在本地正常开发和构建
- 在 Cloudflare Pages 上正确显示完整的首页
- API 路由自动转换为 Cloudflare Functions
- 静态资源正确部署到 CDN
