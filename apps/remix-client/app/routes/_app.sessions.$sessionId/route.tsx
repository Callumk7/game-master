import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { typedjson, redirect, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { SessionLayout } from "./session-layout";
import { commitSession, getUserId, validateUserSession } from "~/lib/auth";
import { createDrizzleForTurso, getCompleteSession, methodNotAllowed } from "@repo/db";
import ky from "ky";
import { GameMaster } from "~/lib/game-master";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { sessionId } = zx.parseParams(params, { sessionId: z.string() });

	const db = createDrizzleForTurso(context.cloudflare.env);
	const completeSession = await getCompleteSession(db, sessionId);

	if (!completeSession) {
		return redirect("/sessions");
	}

	return typedjson({ session: completeSession });
};

export const useSessionRouteData = () => {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.sessions.$sessionId");
	if (data === undefined) {
		throw new Error(
			"useSessionRouteData must be used within the _app.sessions.$sessionsId route or it's children",
		);
	}
	return data;
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { sessionId } = zx.parseParams(params, { sessionId: z.string() });
	const gameMaster = GameMaster.create(context);
	if (request.method === "DELETE") {
		// This should be in the method I think
		const res = await gameMaster.delete(`sessions/${sessionId}`);
		if (res.status === StatusCodes.OK) {
			return new Response(await res.text(), {
				status: StatusCodes.OK,
				statusText: ReasonPhrases.OK,
			});
		}
	}
	if (request.method === "PATCH") {
	}
	return methodNotAllowed();
};

export { SessionLayout as default };
