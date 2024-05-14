import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { NewLocationForm } from "~/components/forms/new-location";
import { validateUser } from "~/lib/auth";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

  const res = await post(context, "locations", form);
	return json(await res.json());
};

export default function NewLocationRoute() {
	return (
		<div>
			<NewLocationForm />
		</div>
	);
}
