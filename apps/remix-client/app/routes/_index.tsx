import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { createDrizzleForTurso } from "@repo/db/drizzle";
import { getFullCharacterData } from "@repo/db/api";
import { notes } from "@repo/db/schema";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{
			name: "description",
			content: "Welcome to Remix! Using Vite and Cloudflare!",
		},
	];
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const db = createDrizzleForTurso(context.cloudflare.env);
	const allNotes = await db.select().from(notes);
	return json({ allNotes });
};

export default function Index() {
	const { allNotes } = useLoaderData<typeof loader>();
	return (
		<div>
			{allNotes.map((note) => (
				<p>{note.name}</p>
			))}
		</div>
	);
}
