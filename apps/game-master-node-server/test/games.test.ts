import { describe, expect, it } from "vitest";
import { gamesRoute } from "../src/features/games";
import type { CreateGameRequestBody } from "@repo/api";

describe("Games Route", async () => {
	describe("/games route", async () => {
		describe("POST request", async () => {
			it("Should return 400, and error message if no body is provided", async () => {
				const result = await gamesRoute.request("/", {
					method: "POST",
				});
				expect(result.status).toBe(400);
				expect(await result.text()).toBe("Failed to parse JSON");
			});

			it("Should return 400, and error message if incorrect body is provided", async () => {
				const result = await gamesRoute.request("/", {
					method: "POST",
					body: JSON.stringify({ wrong: "field", incorrect: "data" }),
				});
				expect(result.status).toBe(400);

				const message = await result.json();
				expect(message).toBeTypeOf("object");
			});
		});
	});
});
