import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { MainContainer } from "~/components/layout";
import { validateUser } from "~/lib/auth";
import { NewCharacterForm } from "~/components/forms/new-character";
import { post } from "~/lib/game-master";
import { objectToFormData } from "~/lib/obj-to-form";
import { type BasicEntity, createDrizzleForTurso } from "@repo/db";
import { getRaceId } from "./queries.server";
import { redirect } from "remix-typedjson";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	const race = String(form.get("race"));

	const db = createDrizzleForTurso(context.cloudflare.env);
	const dbRace = await getRaceId(db, race, userId);

	if (!dbRace) {
		const raceForm = objectToFormData({
			name: race,
			userId,
		});
		// TODO: type the responses from the server
		const res = (await (await post(context, "races", raceForm)).json()) as BasicEntity;
		const raceId = res.id;
		form.append("raceId", raceId);
	} else {
		form.append("raceId", dbRace.id);
	}

	form.append("userId", userId);

	// TODO: this is a little weird
	const res = (await (await post(context, "characters", form)).json()) as BasicEntity;
	return redirect(`/characters/${res.id}`);
};

export default function NewCharacterRoute() {
	return (
		<MainContainer>
			<NewCharacterForm />
		</MainContainer>
	);
}
