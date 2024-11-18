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
			jsonl: getFileSink("log.jsonl", {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
			db: getFileSink("db-log.jsonl", {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
		},
		loggers: [
			{
				category: ["hono"],
				level: "info",
				sinks: ["jsonl"],
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
