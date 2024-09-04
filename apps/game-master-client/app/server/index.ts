import { createHonoServer } from "react-router-hono-server/node";

export const server = await createHonoServer({
	configure: (server) => {
		server.use("*", (c, next) => {
			console.log(c.req.url)
			return next();
		});
	},
});
