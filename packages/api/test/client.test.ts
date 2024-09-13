import { describe, it, expect, beforeAll } from "vitest";
import { SDK, Client } from "../src/index";
import { HTTPError } from "ky";
import { Notes } from "../src/resources/notes";
import { Users } from "../src/resources/users";
import { Games } from "../src/resources/games";
import { Characters } from "../src/resources/characters";

describe("SDK", () => {
	let sdk: SDK;
	beforeAll(() => {
		sdk = new SDK({ baseUrl: "https://api.example.com", apiKey: "test-key" });
	});
	it("should initialize with correct options", () => {
		expect(sdk.games).toBeDefined();
		expect(sdk.users).toBeDefined();
		expect(sdk.characters).toBeDefined();
		expect(sdk.notes).toBeDefined();
	});

	it("Should initialize Games resource", () => {
		expect(sdk.games).toBeInstanceOf(Games);
	});

	it("Should initialize Users resource", () => {
		expect(sdk.users).toBeInstanceOf(Users);
	});

	it("Should initialize Notes resource", () => {
		expect(sdk.notes).toBeInstanceOf(Notes);
	});

	it("Should initialize Characters resource", () => {
		expect(sdk.characters).toBeInstanceOf(Characters);
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

	it("Should make a PUT request", async () => {
		const result = await client.put<{ id: number; name: string }>("test/1", {
			name: "Updated Tester",
		});
		expect(result).toEqual({ id: 1, name: "Updated Tester" });
	});

	it("Should make a PATCH request", async () => {
		const result = await client.patch<{ id: number; name: string }>("test/1", {
			name: "Patched Tester",
		});
		expect(result).toEqual({ id: 1, name: "Patched Tester" });
	});

	it("Should handle 404 errors", async () => {
		// Use the MSW handler that returns a 404
		await expect(client.get("nonexistent")).rejects.toThrow("404 Not Found");
	});

	// Test request headers
	it("Should send correct headers", async () => {
		const result = await client.get<{ auth: string; contentType: string }>("headers");
		expect(result.auth).toBe(`Bearer ${apiKey}`);
		expect(result.contentType).toBe("application/json");
	});
});
