import { expect, test } from "vitest";
import app from "../src";

test("The server is running correctly", async () => {
	const res = await app.request("/")
	expect(res.status).toBe(200)
	expect(await res.text()).toBe("Hello Hono!")
})
