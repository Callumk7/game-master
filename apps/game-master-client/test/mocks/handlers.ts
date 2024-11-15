// mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { env } from "~/lib/env.server";

// TODO: Mock all the endpoints to the database.
// Interesting to think of how we actually test that we
// have all endpoints covered.. I could.. write some tests?
// Maybe that is overkill though

export const handlers = [
	http.get(`${env.SERVER_URL}/users/:userId/games/owned`, ({ params }) => {
		return HttpResponse.json([
			{
				id: "game1",
				name: "game1",
				ownerId: params.userId,
			},
		]);
	}),
	// Add more handlers for other endpoints
];
