import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { BasicEntity } from "@repo/db";
import { Card } from "~/components/card";
import { NewSessionForm } from "~/components/forms/new-session";
import { validateUser } from "~/lib/auth";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = (await post(context, "sessions", form).then((result) =>
		result.json(),
	)) as BasicEntity;
	return redirect(`/sessions/${res.id}`);
};

export default function NewSessionView() {
	return (
		<div className="mt-10 mx-auto w-fit">
			<Card size="xl">
				<NewSessionForm />
			</Card>
		</div>
	);
}
