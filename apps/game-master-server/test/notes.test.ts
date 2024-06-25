import { describe, expect, test } from "vitest";
import { notesRoute } from "~/routes/notes";

describe("Note route testing", () => {
	test("GET /notes/test", async () => {
		const res = await notesRoute.request("/test");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("test passed");
	});
});
