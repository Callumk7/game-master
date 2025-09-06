import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "./schema/swagger.json",
	output: "src/api",
	plugins: [{ name: "@tanstack/react-query", queryOptions: true }],
});
