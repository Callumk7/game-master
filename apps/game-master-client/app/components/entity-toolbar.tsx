import { GearIcon, Share1Icon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { Toolbar } from "~/components/ui/toolbar";
import { JollyMenu, MenuHeader, MenuItem, MenuSection } from "./ui/menu";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from "./ui/dialog";
import { useState } from "react";

export function EntityToolbar() {
	const submit = useSubmit();
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	return (
		<>
			<Toolbar>
				<JollyMenu label="Menu" variant="outline" className="min-w-36">
					<MenuSection>
						<MenuHeader>Controls</MenuHeader>
						<MenuItem>
							<StarIcon className="mr-2" /> <span>Favourite</span>
						</MenuItem>
						<MenuItem onAction={() => navigate("settings", { relative: "path" })}>
							<GearIcon className="mr-2" /> <span>Settings</span>
						</MenuItem>
						<MenuItem onAction={() => setIsDialogOpen(true)}>
							<Share1Icon className="mr-2" /> <span>Duplicate</span>
						</MenuItem>
					</MenuSection>
					<MenuSection>
						<MenuHeader>Danger Zone</MenuHeader>
						<MenuItem onAction={() => submit({}, { method: "delete" })}>
							<TrashIcon className="mr-2" /> <span>Delete</span>
						</MenuItem>
					</MenuSection>
				</JollyMenu>
				<Button variant={"outline"}>Sharing</Button>
			</Toolbar>
			<DuplicateEntityDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
			/>
		</>
	);
}

interface DuplicateEntityDialogProps {
	isDialogOpen: boolean;
	setIsDialogOpen: (isOpen: boolean) => void;
}
function DuplicateEntityDialog({
	isDialogOpen,
	setIsDialogOpen,
}: DuplicateEntityDialogProps) {
	return (
		<DialogOverlay isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				{({ close }) => (
					<Form method="POST" onSubmit={close}>
						<DialogHeader>
							<DialogTitle>Duplicate Note</DialogTitle>
							<DialogDescription>
								Make a copy of this note, along with all links. Duplicated notes will be
								private when created.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<JollyTextField name="name" label="Duplicated note title" />
						</div>
						<DialogFooter>
							<Button type="submit">Duplicate</Button>
						</DialogFooter>
					</Form>
				)}
			</DialogContent>
		</DialogOverlay>
	);
}
