import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "./schema/swagger.json", // sign up at app.heyapi.dev
	output: "app/api",
	plugins: [{ name: "@tanstack/react-query", queryOptions: true }],
});
