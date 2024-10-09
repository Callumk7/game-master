import { GearIcon, Share1Icon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useFetcher, useNavigate, useSubmit } from "@remix-run/react";
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
import type { Permission, User, Visibility } from "@repo/api";
import { Popover, PopoverDialog, PopoverTrigger } from "./ui/popover";
import { useGetGameWithMembers } from "~/queries/get-game-with-members";
import { ComboboxItem, JollyComboBox } from "./ui/combobox";
import { JollySelect, SelectItem } from "./ui/select";

interface EntityToolbarProps {
	entityId: string;
	gameId: string;
	entityVisibility: Visibility;
	permissions: Permission[];
}
export function EntityToolbar({
	entityId,
	gameId,
	entityVisibility,
	permissions,
}: EntityToolbarProps) {
	const submit = useSubmit();
	const navigate = useNavigate();
	const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

	// fetch game members here, there is no reason that this won't work with each entity
	const query = useGetGameWithMembers(gameId);

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
						<MenuItem onAction={() => setIsDuplicateDialogOpen(true)}>
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
				{query.status === "success" ? (
					<SharingPopover
						members={query.data.members}
						entityId={entityId}
						visibility={entityVisibility}
						permissions={permissions}
					/>
				) : (
					<Button isDisabled variant={"outline"}>
						Sharing
					</Button>
				)}
			</Toolbar>
			<DuplicateEntityDialog
				isOpen={isDuplicateDialogOpen}
				setIsOpen={setIsDuplicateDialogOpen}
			/>
		</>
	);
}

interface DuplicateEntityDialogProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}
function DuplicateEntityDialog({ isOpen, setIsOpen }: DuplicateEntityDialogProps) {
	return (
		<DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
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

interface SharingPopoverProps {
	entityId: string;
	members: User[];
	visibility: Visibility;
	permissions: Permission[];
}

function SharingPopover({
	members,
	entityId,
	visibility,
	permissions,
}: SharingPopoverProps) {
	return (
		<PopoverTrigger>
			<Button variant={"outline"}>Sharing</Button>
			<Popover>
				<PopoverDialog className="w-[40vw]">
					<div className="space-y-4">
						<DialogHeader>
							<DialogTitle>Sharing Menu</DialogTitle>
						</DialogHeader>
						<GlobalVisibilityCombobox visibility={visibility} />
						<MemberSharingList members={members} permissions={permissions} />
					</div>
				</PopoverDialog>
			</Popover>
		</PopoverTrigger>
	);
}

interface GlobalVisibilityComboboxProps {
	visibility: Visibility;
}

function GlobalVisibilityCombobox({ visibility }: GlobalVisibilityComboboxProps) {
	const fetcher = useFetcher();
	return (
		<JollyComboBox label="Global permissions" defaultSelectedKey={visibility}>
			<ComboboxItem id="private">Private</ComboboxItem>
			<ComboboxItem id="public">Public</ComboboxItem>
			<ComboboxItem id="viewable">Viewable</ComboboxItem>
		</JollyComboBox>
	);
}

interface MemberSharingListProps {
	members: User[];
	permissions: Permission[];
}

function MemberSharingList({ members, permissions }: MemberSharingListProps) {
	const placeholderPermission: Permission = {
		userId: "",
		canView: false,
		canEdit: false,
	};
	return (
		<div className="grid divide-y">
			{members.map((member) => {
				const permission = permissions.find((p) => p.userId === member.id);
				return (
					<MemberSharingItem
						key={member.id}
						member={member}
						permission={permission ?? placeholderPermission}
					/>
				);
			})}
		</div>
	);
}

interface MemberSharingItemProps {
	member: User;
	permission: Permission;
}

function MemberSharingItem({ member, permission }: MemberSharingItemProps) {
	const selectedKey = permission.canEdit
		? "canEdit"
		: permission.canView
			? "canView"
			: "blocked";
	return (
		<div className="w-full p-2 flex justify-between items-center">
			<span className="text-sm">{member.username}</span>
			<JollySelect selectedKey={selectedKey}>
				<SelectItem id="canView">Can View</SelectItem>
				<SelectItem id="canEdit">Can Edit</SelectItem>
				<SelectItem id="blocked">Blocked</SelectItem>
			</JollySelect>
		</div>
	);
}
