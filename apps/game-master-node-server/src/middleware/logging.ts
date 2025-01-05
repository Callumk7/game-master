import { getLogger } from "@logtape/logtape";
import type { Context, Next } from "hono";
import { getPayload } from "~/lib/jwt";

const logger = getLogger(["hono", "debug"]);

// time in ms
const time = (start: number) => {
	const delta = Date.now() - start;
	return delta;
};

export const httpLogger = async (c: Context, next: Next) => {
	const start = Date.now();
	const { userId } = getPayload(c);
	await next();
	logger.info("{method}: {path} in {time}ms", {
		userId,
		...c.req,
		method: c.req.method,
		path: c.req.path,
		time: time(start),
	});
};
