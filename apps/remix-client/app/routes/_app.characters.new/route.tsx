import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { MainContainer } from "~/components/layout";
import { validateUser } from "~/lib/auth";
import { NewCharacterForm } from "~/components/forms/new-character";
import { post } from "~/lib/game-master";
import { objectToFormData } from "~/lib/obj-to-form";
import { BasicEntity, createDrizzleForTurso } from "@repo/db";
import { getRaceId } from "./queries.server";

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
		const res = (await post(context, "races", raceForm).then((res) =>
			res.json(),
		)) as BasicEntity;
		const raceId = res.id;
		form.append("raceId", raceId);
	} else {
		form.append("raceId", dbRace.id);
	}

	form.append("userId", userId);

	const res = await post(context, "characters", form);
	return json({ character: await res.json() });
};

export default function NewCharacterRoute() {
	return (
		<MainContainer>
			<NewCharacterForm />
		</MainContainer>
	);
}
