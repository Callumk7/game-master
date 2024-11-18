import compression from "compression";
import { createExpressApp } from "remix-create-express-app";
import { LoggerSetup } from "~/services/logging";
import { logger } from "./logging";

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
		app.use(compression());
		app.use(logger);
		app.disable("x-powered-by");
	},
	getLoadContext: async (req, res) => {
		// custom load context should match the AppLoadContext interface defined above
		return { sayHello };
	},
});
