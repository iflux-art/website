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
		// 替换 watchExclude 为正确的 watch.ignore 配置
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
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});