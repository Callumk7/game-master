import { beforeAll, describe, expect, it } from "vitest";
import { Client, SDK } from "../src/index";

describe("SDK", () => {
	it("should initialize with correct options", () => {
		const sdk = new SDK({ baseUrl: "https://api.example.com", apiKey: "test-key" });
		expect(sdk.games).toBeDefined();
		expect(sdk.users).toBeDefined();
	});
});

describe("Client", () => {
	const baseUrl = "https://api.example.com";
	const apiKey = "test-key";
	let client: Client;

	beforeAll(() => {
		client = new Client({ baseUrl, apiKey });
	});

	it("Should make a GET request", async () => {
		const result = await client.get<{ id: number; name: string }>("test");
		expect(result).toEqual({ id: 1, name: "test" });
	});

	it("Should make a POST request", async () => {
		const result = await client.post<{ id: number; name: string }>("test", {
			name: "Tester",
		});
		expect(result).toEqual({ id: 1, name: "test" });
	});

	it("Should make a DELETE request", async () => {
		const result = await client.delete<{ id: number }>("delete/3");
		expect(result).toEqual({ success: true });
	});
});
