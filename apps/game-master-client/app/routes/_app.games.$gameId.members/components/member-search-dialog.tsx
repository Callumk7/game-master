import type { User } from "@repo/api";
import { useListData } from "react-stately";
import { Button } from "~/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { GridList, GridListItem } from "~/components/ui/grid-list";
import { useGetAllUsers } from "~/queries/get-all-users";

interface MemberSearchDialogProps {
	memberIds: string[];
}
export function MemberSearchDialog({ memberIds }: MemberSearchDialogProps) {
	const { status, data, error } = useGetAllUsers();

	if (status !== "success") {
		if (error) console.error(error);
		return <Button isDisabled>Add Members</Button>;
	}

	return (
		<DialogTrigger>
			<Button>Add Members</Button>
			<DialogOverlay>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select Members</DialogTitle>
						<DialogDescription>
							Invite more members to your game. All notes are private until marked
							otherwise.
						</DialogDescription>
					</DialogHeader>
            <SearchMemberGridlist memberIds={memberIds} allUsers={data} />
					<DialogFooter>
						<Button>Done</Button>
					</DialogFooter>
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}

interface SearchMemberGridlistProps {
	memberIds: string[];
	allUsers: User[];
}

export function SearchMemberGridlist({ memberIds, allUsers }: SearchMemberGridlistProps) {
	const listState = useListData({
		initialItems: allUsers,
		initialSelectedKeys: new Set(memberIds),
		getKey: (item) => item.id,
	});

	return (
		<GridList aria-label="User list"
			items={listState.items}
			selectedKeys={listState.selectedKeys}
			onSelectionChange={listState.setSelectedKeys}
			selectionMode="multiple"
		>
			{(item) => <GridListItem>{item.username}</GridListItem>}
		</GridList>
	);
}
