import {
	ansiColorFormatter,
	configure,
	getConsoleSink,
	getFileSink,
} from "@logtape/logtape";

export async function setupLogging() {
	await configure({
		sinks: {
			console: getConsoleSink({
				formatter: ansiColorFormatter,
			}),
			hono: getFileSink("./logs/hono.jsonl", {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
			http: getFileSink("./logs/http.jsonl", {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
			db: getFileSink("./logs/db.jsonl", {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
		},
		loggers: [
			{
				category: ["hono"],
				level: "info",
				sinks: ["hono"],
			},
			{
				category: ["hono", "http"],
				level: "info",
				sinks: ["console", "http"],
			},
			{
				category: ["hono", "debug"],
				level: "debug",
				sinks: ["console"],
			},
			{
				category: ["hono", "db"],
				level: "debug",
				sinks: ["db"],
			},
		],
	});
}
