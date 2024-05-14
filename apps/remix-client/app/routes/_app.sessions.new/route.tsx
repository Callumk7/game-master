import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { Card } from "~/components/card";
import { NewSessionForm } from "~/components/forms/new-session";
import { validateUser } from "~/lib/auth";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = await post(context, "sessions", form);
	return json(await res.json());
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
