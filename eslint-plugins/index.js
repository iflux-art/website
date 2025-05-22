/**
 * ESLint 插件注册文件
 * 
 * 此文件用于注册自定义 ESLint 插件，使其可以被 ESLint 正确加载
 */

const tailwindColorChecker = require('./tailwind-color-checker');

module.exports = {
  plugins: {
    'tailwind-color-checker': tailwindColorChecker
  }
};
