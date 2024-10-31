import { DatabaseError } from "@repo/api";
import { StatusCodes } from "http-status-codes";

const handleApiError = (error: unknown) => {
	if (error instanceof DatabaseError) {
		throw new Response("Database is currently unavailable", {
			status: StatusCodes.SERVICE_UNAVAILABLE, // 503
		});
	}

	if (error instanceof Error) {
		console.error(error);
		throw new Response(error.message, { status: StatusCodes.INTERNAL_SERVER_ERROR }); // 500
	}

	console.error("Unknown error:", error);
	throw new Response("Something went wrong, but we don't know what", {
		status: StatusCodes.INTERNAL_SERVER_ERROR,
	});
};

export async function getData<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		handleApiError(error);
		throw error; // this line will not be reached
	}
}
