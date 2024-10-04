import { Share1Icon } from "@radix-ui/react-icons";
import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverDialog, PopoverTrigger } from "~/components/ui/popover";
import { JollyTextField } from "~/components/ui/textfield";
import { Toolbar } from "~/components/ui/toolbar";
import { JollyMenu, MenuItem } from "./ui/menu";
import { useState } from "react";

export function EntityToolbar() {
	const submit = useSubmit();
	const navigate = useNavigate();
	return (
		<>
			<Toolbar>
				<JollyMenu label="Menu" variant="outline">
					<MenuItem onAction={() => submit({}, { method: "delete" })}>Delete</MenuItem>
					<MenuItem onAction={() => navigate("settings", { relative: "path" })}>
						Settings..
					</MenuItem>
				</JollyMenu>
				<DuplicateEntityPopover />
			</Toolbar>
		</>
	);
}

function DuplicateEntityPopover() {
	return (
		<PopoverTrigger>
			<Button size={"icon"} variant={"outline"} aria-label="Duplicate">
				<Share1Icon />
			</Button>
			<Popover placement="end">
				<PopoverDialog>
					{({ close }) => (
						<Form className="space-y-2" method="POST" onSubmit={close}>
							<JollyTextField name="name" label="Title" />
							<Button size={"sm"} type="submit">
								Duplicate
							</Button>
						</Form>
					)}
				</PopoverDialog>
			</Popover>
		</PopoverTrigger>
	);
}
