const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 要退回到的提交版本
const targetCommit = '4aada5b3b4906eb35795b1fcd79e504a0c1583dd';

try {
  // 1. 保存当前工作目录的更改（如果有）
  console.log('Stashing current changes...');
  try {
    execSync('git stash');
    console.log('Changes stashed successfully');
  } catch (error) {
    console.log('No changes to stash or stash failed');
  }

  // 2. 确保我们在主分支上
  console.log('Checking out main branch...');
  try {
    execSync('git checkout main');
    console.log('Now on main branch');
  } catch (error) {
    console.error('Failed to checkout main branch:', error.message);
    process.exit(1);
  }

  // 3. 拉取最新的更改
  console.log('Pulling latest changes...');
  try {
    execSync('git pull origin main');
    console.log('Latest changes pulled');
  } catch (error) {
    console.log('Failed to pull or no changes to pull');
  }

  // 4. 退回到指定的提交版本
  console.log(`Resetting to commit ${targetCommit}...`);
  try {
    execSync(`git reset --hard ${targetCommit}`);
    console.log(`Successfully reset to commit ${targetCommit}`);
  } catch (error) {
    console.error('Failed to reset to commit:', error.message);
    process.exit(1);
  }

  // 5. 清理缓存
  console.log('Cleaning caches...');
  
  // 清理 .next 目录
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('.next directory cleaned');
    } catch (error) {
      console.error('Failed to clean .next directory:', error.message);
    }
  }
  
  // 清理 node_modules/.cache 目录
  const cacheDir = path.join(__dirname, 'node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('node_modules/.cache directory cleaned');
    } catch (error) {
      console.error('Failed to clean cache directory:', error.message);
    }
  }

  console.log('Reset and cleanup completed successfully!');
  console.log('You can now run "pnpm install" to install dependencies and "pnpm build" to build the project.');
} catch (error) {
  console.error('An unexpected error occurred:', error.message);
  process.exit(1);
}
