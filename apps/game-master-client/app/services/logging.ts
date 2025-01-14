import fs from "node:fs";
import {
	ansiColorFormatter,
	configure,
	getConsoleSink,
	getFileSink,
	withFilter,
} from "@logtape/logtape";

export class LoggerSetup {
	private static instance: LoggerSetup;
	private initialized = false;

	private constructor() {}

	static getInstance(): LoggerSetup {
		if (!LoggerSetup.instance) {
			LoggerSetup.instance = new LoggerSetup();
		}
		return LoggerSetup.instance;
	}

	async setup() {
		if (this.initialized) {
			console.log("Logging already initialized");
			return;
		}

		try {
			console.log("Setting up logging, should only run once");
			const logsDir = "./logs";
			try {
				await fs.promises.mkdir(logsDir, { recursive: true });
			} catch (error) {
				console.error("Failed to create logs directory:", error);
			}
			await configure({
				sinks: {
					console: getConsoleSink({
						formatter: ansiColorFormatter,
					}),
					app: withFilter(
						getFileSink(`${logsDir}/app.jsonl`, {
							formatter: (record) => `${JSON.stringify(record)}\n`,
						}),
						(record) => record.level !== "debug",
					),
					http: getFileSink(`${logsDir}/http.jsonl`, {
						formatter: (record) => `${JSON.stringify(record)}\n`,
					}),
					db: getFileSink(`${logsDir}/db.jsonl`, {
						formatter: (record) => `${JSON.stringify(record)}\n`,
					}),
				},
				loggers: [
					{
						category: ["client"],
						level: "info",
						sinks: ["app"],
					},
					{
						category: ["client", "http"],
						level: "info",
						sinks: ["http", "console"],
					},
					{
						category: ["client", "debug"],
						level: "debug",
						sinks: ["console"],
					},
					{
						category: ["client", "db"],
						level: "debug",
						sinks: ["db"],
					},
				],
				reset: true,
			});

			this.initialized = true;
			console.log("Logging has completed setup");
		} catch (error) {
			console.error("Failed to initialize logger:", error);
		}
	}
}
