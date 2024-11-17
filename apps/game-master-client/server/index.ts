import { createExpressApp } from "remix-create-express-app";
import compression from "compression";

import pinoHttp from "pino-http";
import { getHttpLogger } from "~/services/logging";

// Some example to show how you can add context for loaders, will be useful
const sayHello = () => "Hello nerds";

// update the AppLoadContext interface used in your app
declare module "@remix-run/node" {
	interface AppLoadContext {
		sayHello: () => string;
	}
}

const httpLogger = getHttpLogger();

export const app = createExpressApp({
	configure: (app) => {
		// setup additional express middleware here
		app.use(compression());
		app.use(
			pinoHttp({
				logger: httpLogger,
			}),
		);
		app.disable("x-powered-by");
	},
	getLoadContext: async (req, res) => {
		// custom load context should match the AppLoadContext interface defined above
		return { sayHello };
	},
});
