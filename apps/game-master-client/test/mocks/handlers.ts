// mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { SERVER_URL } from "~/config";

export const handlers = [
	http.get(`${SERVER_URL}/users/:userId/games/owned`, ({params}) => {
		return HttpResponse.json([
			{
				id: "game1",
				name: "game1",
				ownerId: params.userId
			},
		]);
	}),
	// Add more handlers for other endpoints
];
