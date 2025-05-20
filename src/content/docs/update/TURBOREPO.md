# Turborepo 项目重构说明

## 重构概述

本项目已从单包工作区（Single-package workspace）重构为使用 Turborepo 的优化构建流程，但保持单一代码库结构而非 monorepo。这种重构方式保留了原有的项目结构，同时引入了 Turborepo 的构建优化和缓存功能。

## 主要变更

1. 添加了 `turbo.json` 配置文件，定义了构建管道和依赖关系
2. 更新了 `package.json` 中的脚本命令，使用 Turborepo 进行构建和lint
3. 添加了 Turborepo 依赖
4. 创建了新的构建脚本，优化了构建流程
5. 移除了 `--turbopack` 标志，避免与 Turborepo 冲突

## 构建管道说明

在 `turbo.json` 中定义了以下构建管道：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "translate"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "translate": {
      "outputs": ["src/content/en/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "dependsOn": ["build"]
    }
  }
}
```

### 管道说明

- **build**: 构建项目，依赖于翻译任务完成
- **translate**: 执行内容翻译
- **lint**: 执行代码检查
- **dev**: 开发模式，不缓存且持久运行
- **start**: 启动生产服务器，依赖于构建完成

## 使用方法

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

这将自动执行翻译任务，然后构建项目。Turborepo 会缓存构建结果，大幅提高后续构建速度。

### 清理缓存

```bash
pnpm clean
```

## 优势

1. **增量构建**: 只重新构建发生变化的部分
2. **智能缓存**: 缓存构建结果，加速后续构建
3. **并行执行**: 自动并行执行独立任务
4. **依赖管理**: 自动处理任务间的依赖关系
5. **构建可视化**: 提供构建过程的可视化界面

## 注意事项

- 首次构建可能需要较长时间，后续构建将显著加速
- 如遇构建问题，可尝试清理缓存后重新构建
- 开发时使用 `pnpm dev` 命令，不会使用缓存