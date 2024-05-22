import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { createDrizzleForTurso, sessions } from "@repo/db";
import { eq } from "drizzle-orm";
import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { validateUser } from "~/lib/auth";
import { SessionCard } from "./components/session-cards";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

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

	return typedjson({ sessionsWithData });
};

export default function SessionIndex() {
	const { sessionsWithData } = useTypedLoaderData<typeof loader>();
	return (
		<Container>
			<Header>Sessions</Header>
			{sessionsWithData.map((sesh) => (
				<SessionCard
					key={sesh.id}
					session={sesh}
					characters={sesh.characters.map((char) => char.character)}
					factions={sesh.factions.map((fact) => fact.faction)}
					notes={sesh.notes.map((note) => note.note)}
				/>
			))}
		</Container>
	);
}
