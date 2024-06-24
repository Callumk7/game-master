import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Form, useFetcher } from "@remix-run/react";
import type { Member } from "@repo/db";
import { useState } from "react";
import { TableBody } from "react-aria-components";
import { z } from "zod";
import { Header } from "~/components/typeography";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Modal } from "~/components/ui/modal";
import { TextField } from "~/components/ui/text-field";
import { Toolbar } from "~/components/ui/toolbar";

interface MemberTableProps {
	factionId: string;
	members: Member[];
}
export function MemberTable({ members, factionId }: MemberTableProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedChar, setSelectedChar] = useState("");

	const handleOpenModal = (memberId: string) => {
		setIsOpen(!isOpen);
		setSelectedChar(memberId);
	};

	return (
		<>
			<Table>
				<TableHeader>
					<Column isRowHeader>Name</Column>
					<Column width={"1fr"}>Role</Column>
					<Column width={"0.5fr"}>Controls</Column>
				</TableHeader>
				<TableBody
					items={members}
					renderEmptyState={() => (
						<p className="text-sm italic font-light w-full text-center py-2">empty</p>
					)}
				>
					{(item) => (
						<Row id={item.characterId} href={`/characters/${item.characterId}`}>
							<Cell>{item.character.name}</Cell>
							<Cell>{item.role}</Cell>
							<Cell>
								<Toolbar>
									<Button
										size="icon-sm"
										variant="ghost"
										onPress={() => handleOpenModal(item.characterId)}
									>
										<Pencil1Icon />
									</Button>
									<Button size="icon-sm" variant="ghost">
										<TrashIcon />
									</Button>
								</Toolbar>
							</Cell>
						</Row>
					)}
				</TableBody>
			</Table>
			<EditMemberModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				factionId={factionId}
				characterId={selectedChar}
			/>
		</>
	);
}

export const updateMemberDetailsSchema = z.object({
	intent: z.literal("UPDATE_MEMBER"),
	role: z.string().optional(),
	description: z.string().optional(),
	characterId: z.string(),
	factionId: z.string(),
});

interface EditMemberModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	characterId: string;
	factionId: string;
}
function EditMemberModal({
	isOpen,
	setIsOpen,
	characterId,
	factionId,
}: EditMemberModalProps) {
	const fetcher = useFetcher();
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} isDismissable>
			<Dialog>
				{({ close }) => (
					<>
						<Header style="h3" className="mb-3">
							Update Member Details
						</Header>
						<fetcher.Form className="space-y-4" method="POST" onSubmit={close}>
							<TextField label="Role" name="role" />
							<TextField textarea label="Notes" name="description" />
							<input type="hidden" name="characterId" value={characterId} />
							<input type="hidden" name="factionId" value={factionId} />
							<input type="hidden" name="intent" value="UPDATE_MEMBER" />
							<Button type="submit">Save</Button>
						</fetcher.Form>
					</>
				)}
			</Dialog>
		</Modal>
	);
}
