import { vitePlugin as remix } from "@remix-run/dev";
import { expressDevServer } from "remix-express-dev-server";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	optimizeDeps: {
		exclude: ["@node-rs/argon2"],
	},
	plugins: [
		expressDevServer(),
		!process.env.VITEST &&
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
			},
		}),
		tsconfigPaths(),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./test/setup.ts"],
	},
});
