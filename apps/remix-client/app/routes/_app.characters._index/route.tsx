import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { CharacterWithRaceAndFactions } from "@repo/db";
import { DialogTrigger } from "react-aria-components";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { NewCharacterForm } from "~/components/forms/new-character";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Popover } from "~/components/ui/popover";
import { validateUser } from "~/lib/auth";
import { createApi } from "~/lib/game-master";
import { CharacterTable } from "./components/character-table";
import { Container } from "~/components/layout";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	// TODO: We don't do this anywhere else in the app. It is not a good idea to use the userId in the
	// search params. This should be part of the form data I imagine, or we can query the database
	// directly for gets..
	const api = createApi(context);
	const allCharacters = (await api
		.get("characters", {
			searchParams: new URLSearchParams([["userId", userId]]),
		})
		.json()) as CharacterWithRaceAndFactions[];
	return typedjson({ allCharacters });
};

export default function CharacterIndex() {
	const { allCharacters } = useTypedLoaderData<typeof loader>();
	return (
		<Container>
			<Header style="h1">All Characters</Header>
			<div className="mb-5">
				<CharacterTable characters={allCharacters} />
			</div>
			<DialogTrigger>
				<Button>Add</Button>
				<Popover>
					<Dialog>{({ close }) => <NewCharacterForm close={close} />}</Dialog>
				</Popover>
			</DialogTrigger>
		</Container>
	);
}
