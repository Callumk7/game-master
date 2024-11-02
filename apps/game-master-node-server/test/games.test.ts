import { describe, expect, it } from "vitest";
import { gamesRoute } from "../src/features/games";

describe("Games Route", async () => {
	describe("/games POST request", async () => {
		it("should return 400 if no body is provided", async () => {
			const res = await gamesRoute.request("/", {
				method: "POST",
			});

			expect(res.status).toBe(400);
		});

		it("should return 400 if incorrect body is provided", async () => {
			const res = await gamesRoute.request("/", {
				method: "POST",
				body: JSON.stringify({ badField: "Callum" }),
			});
			expect(res.status).toBe(400);
		});
	});
});
