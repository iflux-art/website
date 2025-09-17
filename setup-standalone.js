#!/usr/bin/env node

/**
 * 独立部署信息脚本
 *
 * 此应用已完全独立，无需运行任何脚本即可直接部署到 Vercel
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("应用已完全独立，无需运行任何脚本即可直接部署到 Vercel\n");

console.log("部署说明：");
console.log("1. 此应用不依赖任何 workspace 包，可直接部署");
console.log("2. 确保 package.json 中的依赖版本与 Vercel 环境兼容");
console.log("3. 可直接推送到 GitHub 并在 Vercel 上部署");

console.log("\nVercel 部署步骤：");
console.log("1. 登录 Vercel 控制台");
console.log("2. 点击 'Add New Project'");
console.log("3. 选择你的 GitHub 仓库");
console.log("4. 在项目设置中：");
console.log("   - Framework Preset: Next.js");
console.log("   - Root Directory: apps/website");
console.log("   - Build Command: next build");
console.log("   - Output Directory: .next");
console.log("5. 点击 'Deploy'");