import { getLogger } from "@logtape/logtape";
import responseTime from "response-time";

export const logger = responseTime((req, res, time) => {
	const logger = getLogger(["client", "http"]);
	const rawRequest = {
		httpVersion: req.httpVersion,
		rawHeaders: req.rawHeaders,
		method: req.method,
		url: req.url,
		complete: req.complete,
		remoteAddress: req.socket.remoteAddress,
		remotePort: req.socket.remotePort,
	};

	const rawResponse = {
		statusCode: res.statusCode,
		statusMessage: res.statusMessage,
		headersSent: res.headersSent,
		finished: res.finished,
		rawHeaders: res.getHeaders(),
		writableEnded: res.writableEnded,
		writableFinished: res.writableFinished,
		writableLength: res.writableLength,
	};

	logger.info("{statusCode} {method} {url} in {time}ms", {
		method: req.method,
		url: req.url,
		statusCode: res.statusCode,
		time,
		request: {
			...rawRequest,
		},
		response: {
			...rawResponse,
		},
	});
});
