import { describe, it, expect } from "vitest";
import { SERVER_URL } from "~/config";
import { SDK } from "~/lib/api";

describe("Games Resource", () => {
	const sdk = new SDK({baseUrl: SERVER_URL, apiKey: "TEST_KEY"})
	
	describe("getOwnedGames", () => {
		it("should fetch all owned games by user id", async () => {
			const userId = "user1"
			const games = await sdk.games.getOwnedGames(userId)

			expect(games).toHaveLength(1)
			expect(games[0]).toMatchObject({
				id: "game1",
				name: "game1",
				ownerId: "user1"
			})
		})
	})
});
