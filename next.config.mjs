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

	// 开发环境优化
	devIndicators: {
		position: "bottom-right",
	},

	// 实验性功能
	experimental: {
		// 优化页面加载
		optimisticClientCache: true,
	},

	// Turbopack配置
	turbopack: {
		rules: {
			"*.mdx": {
				loaders: ["@mdx-js/loader"],
			},
		},
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

	// 开发环境配置
	// biome-ignore lint/style/useNamingConvention: Next.js 配置标准命名
	onDemandEntries: {
		// 热更新优化
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},

	// 优化函数大小
	webpack: (config, { isServer, dev }) => {
		if (isServer) {
			// 排除大文件从服务端包中
			config.externals = config.externals || [];
			config.externals.push({
				"src/config/links/items.json": "commonjs src/config/links/items.json",
				"src/config/links/categories.json":
					"commonjs src/config/links/categories.json",
			});
		}

		// 开发环境优化
		if (dev) {
			// 启用更快的源映射
			config.devtool = "eval-source-map";
			
			// 优化构建速度
			config.optimization = {
				...config.optimization,
				removeAvailableModules: false,
				removeEmptyChunks: false,
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						default: false,
						vendors: false,
						// 单独打包React相关库
						react: {
							name: "react",
							chunks: "all",
							test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
							priority: 40,
							enforce: true,
						},
						// 单独打包UI库
						ui: {
							name: "ui",
							chunks: "all",
							test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
							priority: 30,
							enforce: true,
						},
					},
				},
				minimize: false,
			};
		}

		return config;
	},
};

// 导出配置
export default nextConfig;