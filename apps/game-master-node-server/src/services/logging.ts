import fs from "node:fs";
import {
	ansiColorFormatter,
	configure,
	getConsoleSink,
	getFileSink,
} from "@logtape/logtape";
import type { Context, Next } from "hono";

export async function setupLogging() {
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
			hono: getFileSink(`${logsDir}/hono.jsonl`, {
				formatter: (record) => `${JSON.stringify(record)}\n`,
			}),
			http: getFileSink(`${logsDir}/http.jsonl`, {
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
		],
	});
}
