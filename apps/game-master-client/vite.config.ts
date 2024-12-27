import { reactRouter } from "@react-router/dev/vite";
import { expressDevServer } from "remix-express-dev-server";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	optimizeDeps: {
		exclude: ["@node-rs/argon2"],
	},
	plugins: [expressDevServer(), !process.env.VITEST && reactRouter(), tsconfigPaths()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./test/setup.ts"],
	},
});
