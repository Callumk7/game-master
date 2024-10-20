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
import { type Key, useState } from "react";
import {
  SDK,
  type Folder,
  type Permission,
  type User,
  type UserPermission,
  type Visibility,
} from "@repo/api";
import { Popover, PopoverDialog, PopoverTrigger } from "./ui/popover";
import { useGetGameWithMembers } from "~/queries/get-game-with-members";
import { JollySelect, SelectItem } from "./ui/select";
import { ImageUploader } from "./image-uploader";
import { useAppData } from "~/routes/_app/route";

interface EntityToolbarProps {
  entityOwnerId: string;
  gameId: string;
  entityVisibility: Visibility;
  permissions: UserPermission[];
  folders: Folder[] | undefined;
}
export function EntityToolbar({
  entityOwnerId,
  gameId,
  entityVisibility,
  permissions,
  folders,
}: EntityToolbarProps) {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  const { serverUrl, userId } = useAppData();
  // fetch game members here, there is no reason that this won't work with each entity
  const gameWithMembersQuery = useGetGameWithMembers(
    new SDK({ baseUrl: serverUrl, apiKey: "test-api-key-client" }),
    gameId,
  );
  let members: User[] = [];

  if (gameWithMembersQuery.status === "success") {
    members = gameWithMembersQuery.data.members.filter(
      (member) => member.id !== entityOwnerId,
    );
  }

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
        {userId === entityOwnerId ? (
          gameWithMembersQuery.status === "success" ? (
            <SharingPopover
              members={members}
              visibility={entityVisibility}
              permissions={permissions}
            />
          ) : (
            <Button isDisabled variant="outline">
              Sharing
            </Button>
          )
        ) : null}
        {folders ? <FolderMenu folders={folders} /> : null}
        <ImageUploader action="images" ownerId={entityOwnerId} />
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
  members: User[];
  visibility: Visibility;
  permissions: UserPermission[];
}

function SharingPopover({ members, visibility, permissions }: SharingPopoverProps) {
  const fetcher = useFetcher();

  // TODO: Handle state updates and use context to update the component properly
  const handleChangeVisibility = (key: Key) => {
    fetcher.submit(
      { visibility: key.toString() },
      { method: "patch", action: "visibility" },
    );
  };

  return (
    <PopoverTrigger>
      <Button variant={"outline"}>Sharing</Button>
      <Popover>
        <PopoverDialog className="w-[40vw]">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Sharing Menu</DialogTitle>
            </DialogHeader>
            <GlobalVisibilityCombobox
              visibility={visibility}
              handleChangeVisibility={handleChangeVisibility}
            />
            <MemberSharingList
              members={members}
              permissions={permissions}
              visibility={visibility}
            />
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  );
}

interface GlobalVisibilityComboboxProps {
  visibility: Visibility;
  handleChangeVisibility: (visibility: Key) => void;
}

function GlobalVisibilityCombobox({
  visibility,
  handleChangeVisibility,
}: GlobalVisibilityComboboxProps) {
  return (
    <JollySelect
      label="Global permissions"
      defaultSelectedKey={visibility}
      onSelectionChange={handleChangeVisibility}
    >
      <SelectItem id="private">Private</SelectItem>
      <SelectItem id="public">Public</SelectItem>
      <SelectItem id="viewable">Viewable</SelectItem>
    </JollySelect>
  );
}

interface MemberSharingListProps {
  members: User[];
  permissions: UserPermission[];
  visibility: Visibility;
}

function MemberSharingList({ members, permissions, visibility }: MemberSharingListProps) {
  return (
    <div className="grid divide-y">
      {members.map((member) => {
        const permission = permissions.find((p) => p.userId === member.id);
        return (
          <MemberSharingItem
            key={member.id}
            member={member}
            permission={permission}
            visibility={visibility}
          />
        );
      })}
    </div>
  );
}

interface MemberSharingItemProps {
  member: User;
  permission: UserPermission | undefined;
  visibility: Visibility;
}

function MemberSharingItem({ member, permission, visibility }: MemberSharingItemProps) {
  const getInitialPermission = (): Permission => {
    if (permission?.permission) {
      return permission.permission;
    }

    switch (visibility) {
      case "public":
        return "edit";
      case "viewable":
        return "view";
      default:
        return "none";
    }
  };
  const [selectedKey, setSelectedKey] = useState<Permission>(getInitialPermission());

  const fetcher = useFetcher();

  const handleSelectionChange = (key: Key) => {
    setSelectedKey(key.toString() as Permission);
    fetcher.submit(
      { userId: member.id, permission: key.toString() },
      { method: "patch", action: "permissions" },
    );
  };

  return (
    <div className="w-full p-2 flex justify-between items-center">
      <span className="text-sm">{member.username}</span>
      <JollySelect
        selectedKey={selectedKey}
        onSelectionChange={handleSelectionChange}
        className={"min-w-28"}
      >
        <SelectItem id="view">Can View</SelectItem>
        <SelectItem id="edit">Can Edit</SelectItem>
        <SelectItem id="none">Blocked</SelectItem>
      </JollySelect>
    </div>
  );
}

interface FolderMenuProps {
  folders: Folder[];
}
function FolderMenu({ folders }: FolderMenuProps) {
  const submit = useSubmit();
  return (
    <JollyMenu items={folders} label={"Move..."} variant={"outline"}>
      {(item) => (
        <MenuItem onAction={() => submit({ folderId: item.id }, { method: "patch" })}>
          {item.name}
        </MenuItem>
      )}
    </JollyMenu>
  );
}
