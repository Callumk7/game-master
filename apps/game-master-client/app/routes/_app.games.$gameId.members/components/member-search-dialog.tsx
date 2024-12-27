import { useSubmit } from "react-router";
import { SDK, type User } from "@repo/api";
import { type Selection, useListData } from "react-stately";
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
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>Select Members</DialogTitle>
                <DialogDescription>
                  Invite more members to your game. All notes are private until marked
                  otherwise.
                </DialogDescription>
              </DialogHeader>
              <SearchMemberGridlist memberIds={memberIds} allUsers={data} />
              <DialogFooter>
                <Button onPress={close}>Done</Button>
              </DialogFooter>
            </>
          )}
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

  const submit = useSubmit();

  const handleSelectionChange = (keys: Selection) => {
    listState.setSelectedKeys(keys); // this is the displayed state
    submit({ userIds: [...keys] }, { method: "put", encType: "application/json" });
  };

  return (
    <GridList
      aria-label="User list"
      items={listState.items}
      selectedKeys={listState.selectedKeys}
      onSelectionChange={handleSelectionChange}
      selectionMode="multiple"
    >
      {(item) => <GridListItem>{item.username}</GridListItem>}
    </GridList>
  );
}
