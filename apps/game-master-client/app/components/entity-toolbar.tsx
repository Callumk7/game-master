import { Share1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverDialog, PopoverTrigger } from "~/components/ui/popover";
import { JollyTextField } from "~/components/ui/textfield";
import { Toolbar } from "~/components/ui/toolbar";

export function EntityToolbar() {
	const submit = useSubmit();
	return (
		<Toolbar>
			<Button
				variant={"destructive"}
				size={"icon"}
				onPress={() => submit({}, { method: "delete" })}
				aria-label="Delete note"
			>
				<TrashIcon />
			</Button>
			<DuplicateEntityPopover />
		</Toolbar>
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
