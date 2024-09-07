import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node", // WARN: This package may be run in the client.
		setupFiles: ["./test/setup.ts"],
	},
});
