# 部署到 Vercel

## 问题描述

在将应用部署到 Vercel 时，可能会遇到以下错误：

```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version)

Your pnpm version is incompatible with "/vercel/path0/apps/website".

Expected version: >=9.11.0
Got: 8.15.0
```

## 问题原因

这个问题是由于 Vercel 当前支持的 pnpm 版本（8.15.0）与本地开发环境要求的 pnpm 版本（>=9.11.0）不兼容导致的。

## 解决方案

我们已经通过以下方式解决了这个问题：

1. 在每个子应用的 [package.json](file://c:\project\ifa\apps\website\package.json) 中，将 pnpm 的要求从 `>=9.11.0` 调整为 `>=8.0.0`，以兼容 Vercel 环境
2. 保留了 `packageManager` 字段为 `pnpm@9.11.0`，这样在本地开发时仍会使用高版本
3. 为每个子应用添加了 [vercel.json](file://c:\project\ifa\apps\website\vercel.json) 配置文件，确保部署时的正确配置

## 部署步骤

1. 确保你已经将代码推送到 GitHub 仓库
2. 登录 Vercel 控制台
3. 点击 "Add New Project"
4. 选择你的 GitHub 仓库
5. 在项目设置中：
   - Framework Preset: Next.js
   - Root Directory: apps/website（或其他相应的子应用目录）
   - Build Command: `next build`
   - Output Directory: `.next`
6. 点击 "Deploy"

## 本地开发与部署的版本差异

- **本地开发**：使用 pnpm 9.11.0 和 Node.js 22.x
- **Vercel 部署**：使用 pnpm 8.15.0 和 Node.js 18.x

这种配置确保了：
1. 本地开发时可以使用最新的工具特性
2. 部署时与 Vercel 环境兼容
3. 代码功能在两种环境中保持一致

## 注意事项

1. 如果在部署时遇到其他问题，请检查 [vercel.json](file://c:\project\ifa\apps\website\vercel.json) 配置是否正确
2. 确保所有子应用都已更新了相应的配置
3. 如果需要在 Vercel 上使用特定的环境变量，请在 Vercel 控制台中进行设置