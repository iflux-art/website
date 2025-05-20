/**
 * PostCSS 配置文件
 * 用于配置 Tailwind CSS v4 和 Autoprefixer
 *
 * 注意：Tailwind CSS v4 中，PostCSS 插件已移至 @tailwindcss/postcss
 * @type {import('postcss').Config}
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
