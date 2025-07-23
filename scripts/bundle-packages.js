const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

async function bundlePackages() {
  try {
    // 1. 确保dist目录存在
    const distPath = path.join(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }

    // 2. 收集所有子包
    const packagesDir = path.join(process.cwd(), "packages");
    const packageDirs = fs
      .readdirSync(packagesDir)
      .filter((dir) => fs.statSync(path.join(packagesDir, dir)).isDirectory());

    // 3. 合并所有子包到dist目录
    for (const pkgDir of packageDirs) {
      const pkgDistPath = path.join(packagesDir, pkgDir, "dist");
      if (fs.existsSync(pkgDistPath)) {
        // 复制子包的dist内容到根dist目录
        await exec(`cp -r ${pkgDistPath}/* ${distPath}/`);
      }
    }

    // 4. 生成统一的入口文件
    const entryContent = packageDirs
      .map((pkgDir) => `module.exports.${pkgDir} = require('./${pkgDir}');`)
      .join("\n");

    fs.writeFileSync(path.join(distPath, "index.js"), entryContent);

    console.log("✅ All packages bundled successfully!");
  } catch (error) {
    console.error("❌ Failed to bundle packages:", error);
    process.exit(1);
  }
}

bundlePackages();
