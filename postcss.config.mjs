/**
 * PostCSS 配置文件
 * @type {import('postcss').Config}
 */
const config = {
	plugins: {
		"@tailwindcss/postcss": {}, // 使用 @tailwindcss/postcss 插件
		// autoprefixer 通常由 Tailwind CSS v4 内部处理
	},
};

export default config;
