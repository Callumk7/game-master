import fs from "node:fs";
import pino from "pino";
import { env } from "~/lib/env.server";

interface LoggerOptions {
	logPath?: string;
	logLevel?: string;
}

class Logger {
	private baseLogger: pino.Logger;
	private httpLogger: pino.Logger;

	constructor(options: LoggerOptions = {}) {
		const { logPath = "./logs", logLevel = "info" } = options;

		const appStream = fs.createWriteStream(`${logPath}/app.log`, { flags: "a" });
		const httpStream = fs.createWriteStream(`${logPath}/http.log`, { flags: "a" });

		if (env.isDevelopment) {
			const prettyStream = pino.transport({
				target: "pino-pretty",
			});
			this.baseLogger = pino(
				{
					level: logLevel,
					timestamp: pino.stdTimeFunctions.isoTime,
				},
				pino.multistream([{ stream: appStream }, { stream: prettyStream }]),
			);

			const httpPrettyStream = pino.transport({
				target: "pino-http-print",
			});

			this.httpLogger = pino(
				{
					level: logLevel,
					timestamp: pino.stdTimeFunctions.isoTime,
				},
				pino.multistream([{ stream: httpStream }, { stream: httpPrettyStream }]),
			);
		} else {
			this.baseLogger = pino(
				{
					level: logLevel,
					timestamp: pino.stdTimeFunctions.isoTime,
				},
				appStream,
			);

			this.httpLogger = pino(
				{
					level: logLevel,
					timestamp: pino.stdTimeFunctions.isoTime,
				},
				httpStream,
			);
		}
	}

	getHttpLogger() {
		return this.httpLogger;
	}

	getLogger(module: string) {
		return this.baseLogger.child({ module });
	}
}

const logger = new Logger();
export const getLogger = (module: string) => logger.getLogger(module);
export const getHttpLogger = () => logger.getHttpLogger();
