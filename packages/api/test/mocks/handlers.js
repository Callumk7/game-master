import { http, HttpResponse } from "msw";
import { SERVER_URL } from "../../src/config";

const testUrl = "https://api.example.com";

export const handlers = [
	// Basic tests for the client
	http.get(`${testUrl}/test`, () => {
		return HttpResponse.json({ id: 1, name: "test" });
	}),
	http.get(`${testUrl}/headers`, ({request}) => {
		const authHeader = request.headers.get("Authorization");
		const contentType = request.headers.get("Content-Type");
		return HttpResponse.json({
			auth: authHeader,
			contentType
		})
	}),
	http.post(`${testUrl}/test`, async ({ request }) => {
		const body = await request.json();
		console.log(`currently processing post request with body ${body.name}`);
		return HttpResponse.json({ id: 1, name: "test" });
	}),
	http.delete(`${testUrl}/delete/:id`, async () => {
		return HttpResponse.json({ success: true });
	}),
	http.patch(`${testUrl}/test/:id`, async ({ params, request }) => {
		const id = Number(params.id);
		const body = await request.json();
		return HttpResponse.json({ id, name: body.name });
	}),
	http.put(`${testUrl}/test/:id`, async ({ params, request }) => {
		const id = Number(params.id);
		const body = await request.json();
		return HttpResponse.json({ id, name: body.name });
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

	// Generic catch-all handler for unhandled requests
	http.all("*", ({ request }) => {
		console.log(`Caught unhandled request to ${request.url}`);
		return HttpResponse.json(
			{ message: "Not Found" },
			{ status: 404, statusText: "Not Found" },
		);
	}),
];
