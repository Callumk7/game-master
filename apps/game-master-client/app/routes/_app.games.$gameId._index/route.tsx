import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Link } from "~/components/ui/link";
import { EditableText, Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { methodNotAllowed } from "~/util/responses";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const game = await api.games.getGameWithMembers(gameId);

	return typedjson({ game });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { gameId } = parseParams(params, {
		gameId: z.string(),
	});

	if (request.method === "PATCH") {
		const { name } = await parseForm(request, {
			name: z.string(),
		});

		const result = await api.games.updateGameDetails(gameId, { name });

		if (!result.success) {
			return new Response("Error");
		}

		return typedjson(result.data);
	}

	return methodNotAllowed();
};

// I think on this route I want to have tabs for
// - managing members
// - viewing note connections
// - creating collections

export default function GameRoute() {
	const { game } = useTypedLoaderData<typeof loader>();
	return (
		<div className="p-4">
			<EditableText
				method="patch"
				fieldName={"name"}
				value={game.name}
				variant={"h2"}
				weight={"bold"}
				inputLabel={"Game name input"}
				buttonLabel={"Edit game name"}
			/>
			<div className="p-4">
				<Text variant={"h3"}>Members</Text>
				<Link variant={"link"} href={`/games/${game.id}/members`}>
					Invite
				</Link>
				{game.members.map((member) => (
					<p key={member.id}>{member.username}</p>
				))}
			</div>
		</div>
	);
}
