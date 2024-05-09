import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { NumberField } from "~/components/ui/number-field";
import { TextField } from "~/components/ui/text-field";
import { handleCreateSession } from "./queries.server";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	return handleCreateSession(request, context);
};

export default function NewSessionView() {
	return (
		<div className="mt-10 mx-auto w-fit">
			<Card size="xl">
				<Form method="POST">
					<div className="flex flex-col gap-5">
						<TextField label="name" name="name" isRequired />
						<NumberField name="session_number" label="session number" />
						<TextField textarea label="description" name="description" />
						<Button type="submit">Create</Button>
					</div>
				</Form>
			</Card>
		</div>
	);
}
