/** @type {import('next').NextConfig} */
const nextConfig = {
	logging: {
		level: "verbose",
	},
	// 基本配置
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

	// TypeScript 错误检查配置
	typescript: {
		ignoreBuildErrors: false,
	},

	// 实验性功能
	experimental: {
		// 优化页面加载
		optimisticClientCache: true,
	},

	// 图片优化配置
	images: {
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24, // 24 小时
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// 启用压缩
	compress: true,

	// 强制静态生成配置
	trailingSlash: true,

	// 优化函数大小
	webpack: (config, { isServer }) => {
		if (isServer) {
			// 排除大文件从服务端包中
			config.externals = config.externals || [];
			config.externals.push({
				"src/config/links/items.json": "commonjs src/config/links/items.json",
				"src/config/links/categories.json":
					"commonjs src/config/links/categories.json",
			});
		}
		return config;
	},
};

// 导出配置
export default nextConfig;
