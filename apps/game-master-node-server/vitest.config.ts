import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";
import dotenv from "dotenv"

dotenv.config({ path: '.env.test' });

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./test/setup.ts"],
		silent: true
	},
	resolve: {
		alias: {
			"~": resolve(__dirname, "./src"),
		},
	},
});
