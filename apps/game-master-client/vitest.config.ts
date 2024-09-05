import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./test/setup.ts"],
	},
	resolve: {
		alias: {
			"~": resolve(__dirname, "./app"),
			types: resolve(__dirname, "./types"),
		},
	},
});
