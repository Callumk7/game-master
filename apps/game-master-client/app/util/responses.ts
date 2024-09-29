import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function methodNotAllowed() {
	return new Response(ReasonPhrases.METHOD_NOT_ALLOWED, {
		status: StatusCodes.METHOD_NOT_ALLOWED,
		statusText: ReasonPhrases.METHOD_NOT_ALLOWED,
	});
}

export function unsuccessfulResponse(errorMessage: string) {
	return new Response(errorMessage, {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
		statusText: errorMessage
	});
}
