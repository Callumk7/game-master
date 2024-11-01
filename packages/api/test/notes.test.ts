import { beforeAll, describe, expect, it } from "vitest";
import { DatabaseError, SDK } from "../src/index";

import { server } from "./setup";
import { http, HttpResponse } from "msw";

describe("Notes resources", () => {
	const options = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
	};

	let api: SDK;

	beforeAll(() => {
		api = new SDK(options);
	});

	it("should be able to get a note", async () => {
		const noteId = "note_1";
		server.use(
			http.get(`${options.baseUrl}/notes/${noteId}`, () => {
				return HttpResponse.json({ id: noteId, content: "This is a good note!" });
			}),
		);

		const response = await api.notes.getNote(noteId);
		expect(response.id).toBe(noteId);
	});

	it("should handle the case where a note is not found", async () => {
		const noteId = "note_89381203910";
		server.use(
			http.get(`${options.baseUrl}/notes/${noteId}`, () => {
				return HttpResponse.text("Not Found", { status: 404 });
			}),
		);

		try {
			await api.notes.getNote(noteId);
		} catch (error) {
			expect(error).instanceOf(Error);

			if (error instanceof Error) {
				expect(error.name).toBe("ApiError");
				expect(error.message).toBe("404 Not Found");
			}
		}
	});
});
