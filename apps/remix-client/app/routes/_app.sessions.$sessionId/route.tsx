import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { typedjson, redirect, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { SessionLayout } from "./session-layout";
import { createDrizzleForTurso, getCompleteSession } from "@repo/db";
import { extractParam } from "~/lib/zx-util";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);

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

export { SessionLayout as default };
