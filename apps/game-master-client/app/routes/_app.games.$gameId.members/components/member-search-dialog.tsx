import { useQuery } from "@tanstack/react-query";
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
import { clientApi } from "~/lib/queries";

export function MemberSearchDialog() {
	const { status, data, error } = useQuery({
		queryKey: ["users", "all"],
		queryFn: async () => clientApi.users.getAllUsers(),
	});

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
					<GridList items={data} selectionMode="multiple">
						{(item) => <GridListItem>{item.username}</GridListItem>}
					</GridList>
					<DialogFooter>
						<Button>Done</Button>
					</DialogFooter>
				</DialogContent>
			</DialogOverlay>
		</DialogTrigger>
	);
}
