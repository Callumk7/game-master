import compression from "compression";
import cors from "cors";
import { createExpressApp } from "remix-create-express-app";
import { LoggerSetup } from "~/services/logging";
import { logger } from "./logging";
import { env } from "~/lib/env.server";

// Some example to show how you can add context for loaders, will be useful
const sayHello = () => "Hello nerds";

// update the AppLoadContext interface used in your app
declare module "@remix-run/node" {
	interface AppLoadContext {
		sayHello: () => string;
	}
}

await LoggerSetup.getInstance().setup();

export const app = createExpressApp({
	configure: async (app) => {
		app.use(cors());
		app.use(compression());
		app.use(logger);
		app.disable("x-powered-by");
		// Bug with react dev tools in firefox looking for a file that does not exist
		if (env.isDevelopment) {
			app.get("/installHook.js.map", (_, res) => {
				res.send({});
			});
			app.get("*/**/installHook.js.map", (_, res) => {
				res.send({});
			});
		}
	},
	getLoadContext: async (req, res) => {
		// custom load context should match the AppLoadContext interface defined above
		return { sayHello };
	},
});
