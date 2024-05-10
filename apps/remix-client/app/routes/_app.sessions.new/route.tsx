import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Card } from "~/components/card";
import { handleCreateSession } from "./queries.server";
import { NewSessionForm } from "~/components/forms/new-session";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	return handleCreateSession(request, context);
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
