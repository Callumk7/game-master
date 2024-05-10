import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./route";
import { Container, EntityHeader, EntityView } from "~/components/layout";
import { Outlet, useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { Toolbar } from "~/components/ui/toolbar";

export function SessionLayout() {
	const { session } = useTypedLoaderData<typeof loader>();
	const submit = useSubmit();
	return (
		<Container>
			<EntityView>
				<Toolbar>
					<Button
						variant="destructive"
						size="icon-sm"
						onPress={() => submit({}, { method: "DELETE" })}
					>
						<TrashIcon />
					</Button>
				</Toolbar>
				<EntityHeader title={session.name} />
				<Outlet />
			</EntityView>
		</Container>
	);
}
