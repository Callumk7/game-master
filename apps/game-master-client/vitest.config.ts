import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

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
