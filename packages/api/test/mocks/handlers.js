import { http, HttpResponse } from "msw";
import { SERVER_URL } from "../../src/config";

const testUrl = "https://api.example.com";

export const handlers = [
	// Basic tests for the client
	http.get(`${testUrl}/test`, () => {
		return HttpResponse.json({ id: 1, name: "test" });
	}),
	http.post(`${testUrl}/test`, async ({ request }) => {
		const body = await request.json();
		console.log(`currently processing post request with body ${body.name}`);
		return HttpResponse.json({ id: 1, name: "test" });
	}),
	http.delete(`${testUrl}/delete/:id`, async () => {
		return HttpResponse.json({ success: true });
	}),

	// Specific API endpoint mocks
	http.get(`${SERVER_URL}/users/:userId/games/owned`, ({ params }) => {
		return HttpResponse.json([
			{
				id: "game1",
				name: "game1",
				ownerId: params.userId,
			},
		]);
	}),
];
