import { beforeAll, describe, expect, it } from "vitest";
import { Client, DatabaseError, SDK } from "../src/index";

import { server } from "./setup";
import { http, HttpResponse } from "msw";

describe("SDK", () => {
	it("should initialize with correct options", () => {
		const sdk = new SDK({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
		});
		expect(sdk.games).toBeDefined();
		expect(sdk.users).toBeDefined();
		expect(sdk.factions).toBeDefined();
		expect(sdk.characters).toBeDefined();
		expect(sdk.folders).toBeDefined();
		expect(sdk.notes).toBeDefined();
	});
});

describe("HTTP Client", () => {
	const options = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
	};

	let client: Client;

	beforeAll(() => {
		client = new Client(options);
	});

	it("Should make GET requests with correct headers", async () => {
		server.use(
			http.get(`${options.baseUrl}/test`, ({ request }) => {
				const authHeader = request.headers.get("authorization");
				const contentType = request.headers.get("content-type");

				expect(authHeader).toBe(`Bearer ${options.apiKey}`);
				expect(contentType).toBe("application/json");

				return HttpResponse.json({ data: "test" });
			}),
		);

		const response = await client.get("test");
		expect(response).toEqual({ data: "test" });
	});

	it("Should handle database errors correctly", async () => {
		server.use(
			http.get(`${options.baseUrl}/test`, () => {
				return new HttpResponse(null, {
					status: 500,
					statusText: "Database Error",
				});
			}),
		);

		await expect(client.get("test")).rejects.toThrow(DatabaseError);
	});

	it("Send POST request with a json body", async () => {
		server.use(
			http.post(`${options.baseUrl}/test`, async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				const contentType = request.headers.get("content-type");

				const body = (await request.json()) as { data: string };

				expect(authHeader).toBe(`Bearer ${options.apiKey}`);
				expect(contentType).toBe("application/json");
				expect(body.data).toBe("test-data");

				return HttpResponse.json({ data: "test" });
			}),
		);

		const response = await client.post("test", { data: "test-data" });
		expect(response).toEqual({ data: "test" });
	});

	it("Send PUT request with a json body", async () => {
		server.use(
			http.put(`${options.baseUrl}/test`, async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				const contentType = request.headers.get("content-type");

				const body = (await request.json()) as { data: string };

				expect(authHeader).toBe(`Bearer ${options.apiKey}`);
				expect(contentType).toBe("application/json");
				expect(body.data).toBe("test-data");

				return HttpResponse.json({ data: "test" });
			}),
		);

		const response = await client.put("test", { data: "test-data" });
		expect(response).toEqual({ data: "test" });
	});

	it("Send PATCH request with a json body", async () => {
		server.use(
			http.patch(`${options.baseUrl}/test`, async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				const contentType = request.headers.get("content-type");

				const body = (await request.json()) as { data: string };

				expect(authHeader).toBe(`Bearer ${options.apiKey}`);
				expect(contentType).toBe("application/json");
				expect(body.data).toBe("test-data");

				return HttpResponse.json({ data: "test" });
			}),
		);

		const response = await client.patch("test", { data: "test-data" });
		expect(response).toEqual({ data: "test" });
	});

	it("Send DELETE request with a the correct headers", async () => {
		server.use(
			http.delete(`${options.baseUrl}/test`, async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				const contentType = request.headers.get("content-type");


				expect(authHeader).toBe(`Bearer ${options.apiKey}`);
				expect(contentType).toBe("application/json");

				return HttpResponse.json({ data: "test" });
			}),
		);

		const response = await client.delete("test");
		expect(response).toEqual({ data: "test" });
	});
});
