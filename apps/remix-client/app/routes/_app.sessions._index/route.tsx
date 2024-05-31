import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { createDrizzleForTurso, sessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { validateUser } from "~/lib/auth";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { createSessionAndRelationNodes } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";
import "reactflow/dist/style.css";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const db = createDrizzleForTurso(context.cloudflare.env);
	const sessionsWithData = await db.query.sessions.findMany({
		where: eq(sessions.userId, userId),
		with: {
			characters: { with: { character: true } },
			factions: { with: { faction: true } },
			notes: { with: { note: true } },
		},
	});

	const sessionData = sessionsWithData.map((session) => ({
		...session,
		characters: session.characters.map((c) => c.character),
		factions: session.factions.map((f) => f.faction),
		notes: session.notes.map((n) => n.note),
	}));

	return typedjson({ sessionData });
};

export default function SessionIndex() {
	const { sessionData } = useTypedLoaderData<typeof loader>();
	const { initNodes, initEdges } = createSessionAndRelationNodes(sessionData);
	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={initNodes} initEdges={initEdges} />
		</div>
	);
}
