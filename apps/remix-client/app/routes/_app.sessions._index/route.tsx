import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createDrizzleForTurso, sessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { validateUser } from "~/lib/auth";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { createAllSessionAndRelationNodesAndEdges } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";
import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { getSessionsWithLinkData } from "./queries.server";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const db = createDrizzleForTurso(context.cloudflare.env);
	const sessionData = await getSessionsWithLinkData(db, userId);

	return typedjson({ sessionData });
};

export default function SessionIndex() {
	const { sessionData } = useTypedLoaderData<typeof loader>();
	const { nodes, edges } = createAllSessionAndRelationNodesAndEdges(sessionData);
	return (
		<Container width="max">
			<div className="mx-auto w-11/12">
				<Header style="h1">All Sessions</Header>
			</div>
			<div className="w-full h-screen relative">
				<NodeCanvas initNodes={nodes} initEdges={edges} fitView />
			</div>
		</Container>
	);
}
