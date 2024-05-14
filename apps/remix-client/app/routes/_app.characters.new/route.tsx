import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { MainContainer } from "~/components/layout";
import { validateUser } from "~/lib/auth";
import { NewCharacterForm } from "~/components/forms/new-character";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
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
