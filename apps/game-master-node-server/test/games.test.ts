import { describe, expect, it } from "vitest";
import { gamesRoute } from "../src/features/games";

describe("Games Route", async () => {
	describe("/games", async () => {
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

		//	it("should return 201 and create a game if correct body is provided", async () => {
		//		const res = await gamesRoute.request("/", {
		//			method: "POST",
		//			body: JSON.stringify({ name: "New Game", ownerId: "owner123" }),
		//		});
		//		expect(res.status).toBe(201);
		//		const body = await res.json();
		//		expect(body.success).toBe(true);
		//		expect(body.newGame).toHaveProperty("id");
		//		expect(body.newGame.name).toBe("New Game");
		//		expect(body.newGame.ownerId).toBe("owner123");
		//	});
		//});
		//
		//describe("/games/:gameId", async () => {
		//	it("should return 400 if request body is in a bad format", async () => {
		//		const res = await gamesRoute.request("/game123", {
		//			method: "GET",
		//			body: JSON.stringify({ withMembers: "yes" }), // incorrect type
		//		});
		//		expect(res.status).toBe(400);
		//		const text = await res.text();
		//		expect(text).toBe("No good, the request body was in a bad format.");
		//	});
		//
		//	it("should return 200 and game details if correct body is provided", async () => {
		//		const res = await gamesRoute.request("/game123", {
		//			method: "GET",
		//			body: JSON.stringify({ withMembers: true, withNotes: false }),
		//		});
		//		expect(res.status).toBe(200);
		//		const body = await res.json();
		//		expect(body.success).toBe(true);
		//		expect(body.game).toHaveProperty("id", "game123");
		//		expect(body.game).toHaveProperty("members");
		//		expect(body.game).toHaveProperty("notes");
		//	});
		//
		//	it("should return 404 if game does not exist", async () => {
		//		const res = await gamesRoute.request("/nonexistentGame", {
		//			method: "GET",
		//			body: JSON.stringify({ withMembers: true, withNotes: true }),
		//		});
		//		expect(res.status).toBe(404);
		//		const text = await res.text();
		//		expect(text).toBe("Game not found");
		//	});
		//});
		//
		//describe("Error Handling", async () => {
		//	it("should return 500 if there is a database error during game creation", async () => {
		//		const res = await gamesRoute.request("/", {
		//			method: "POST",
		//			body: JSON.stringify({ name: "New Game", ownerId: "owner123" }),
		//		});
		//		// Simulate a database error
		//		expect(res.status).toBe(500);
		//		const text = await res.text();
		//		expect(text).toBe("Internal Server Error");
		//	});
		//
		//	it("should return 500 if there is a database error during game fetching", async () => {
		//		const res = await gamesRoute.request("/game123", {
		//			method: "GET",
		//			body: JSON.stringify({ withMembers: true, withNotes: false }),
		//		});
		//		// Simulate a database error
		//		expect(res.status).toBe(500);
		//		const text = await res.text();
		//		expect(text).toBe("Internal Server Error");
		//	});
	});
});
