import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		globals: true,
		include: ["**/__tests__/**/*.test.ts"],
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/**",
				"dist/**",
				"**/*.d.ts",
				"**/coverage/**",
				"**/__tests__/**",
				"**/test/**",
				"**/vitest.config.*",
				"**/setupTests.*",
				"**/test-utils.*",
				"**/mocks/**",
				"**/stories/**",
				"**/.next/**",
				"**/next-env.d.ts",
				"**/next.config.mjs",
			],
			experimentalAstAwareRemapping: true,
		},
		testTimeout: 10000,
		// 优化监视模式
		watch: {
			ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
		} as any,
		typecheck: {
			enabled: true,
			include: ["**/__tests__/**/*.test.ts"],
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/cypress/**",
				"**/.{idea,git,cache,output,temp}/**",
				"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
			],
		},
		sequence: {
			concurrent: true,
		},
		// 开发体验优化
		// 启用更详细的日志
		logHeapUsage: true,
		// 启用隔离模式以提高稳定性
		// isolate: true,
		// 启用更清晰的错误报告
		reporters: ["default", "verbose"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	// 开发体验优化
	server: {
		// 启用文件监视优化
		watch: {
			// 忽略大文件变化以提高性能
			ignored: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/public/**"],
		},
	},
});