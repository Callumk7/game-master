import {
  FileIcon,
  GearIcon,
  ImageIcon,
  Pencil2Icon,
  Share1Icon,
  StarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Form, useFetcher, useNavigate, useSubmit } from "@remix-run/react";
import type { Folder, Permission, User, UserPermission, Visibility } from "@repo/api";
import { type ChangeEvent, type Key, useRef, useState } from "react";
import { SubmenuTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { Toolbar } from "~/components/ui/toolbar";
import { useGetGameWithMembers } from "~/queries/get-game-with-members";
import { useAppData } from "~/routes/_app/route";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import {
  JollyMenu,
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuSection,
} from "./ui/menu";
import { Popover, PopoverDialog, PopoverTrigger } from "./ui/popover";
import { JollySelect, SelectItem } from "./ui/select";

interface EntityToolbarProps {
  entityOwnerId: string;
  gameId: string;
  entityVisibility: Visibility;
  permissions: UserPermission[];
  userPermissionLevel: Permission;
  folders: Folder[] | undefined;
  setIsEditDialogOpen: (isDialogOpen: boolean) => void;
}
export function EntityToolbar({
  entityOwnerId,
  gameId,
  entityVisibility,
  permissions,
  userPermissionLevel,
  folders,
  setIsEditDialogOpen,
}: EntityToolbarProps) {
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  const { userId } = useAppData();
  // fetch game members here, there is no reason that this won't work with each entity
  const gameWithMembersQuery = useGetGameWithMembers(gameId);
  let members: User[] = [];

  if (gameWithMembersQuery.status === "success") {
    members = gameWithMembersQuery.data.members.filter(
      (member) => member.id !== entityOwnerId,
    );
  }

  const hasEditPermission = userPermissionLevel === "edit";
  const isOwner = userId === entityOwnerId;

  return (
    <>
      <Toolbar>
        <EntityMenu
          ownerId={userId}
          hasEditPermission={hasEditPermission}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setIsDuplicateDialogOpen={setIsDuplicateDialogOpen}
          folders={folders}
        />
        {isOwner ? (
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
      </Toolbar>
      <DuplicateEntityDialog
        isOpen={isDuplicateDialogOpen}
        setIsOpen={setIsDuplicateDialogOpen}
      />
    </>
  );
}

interface EntityMenuProps {
  ownerId: string;
  hasEditPermission: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDuplicateDialogOpen: (isOpen: boolean) => void;
  folders: Folder[] | undefined;
}

export function EntityMenu({
  ownerId,
  hasEditPermission,
  setIsEditDialogOpen,
  setIsDuplicateDialogOpen,
  folders,
}: EntityMenuProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const fetcher = useFetcher();
  const {
    fileName,
    fileInputRef,
    simulateInputClick,
    handleFileChange,
    handleSubmitCleanup,
  } = useCustomUploadButton();
  return (
    <>
      <fetcher.Form
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleSubmitCleanup}
        action="images"
      >
        <input
          type="file"
          name="image"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <input type="hidden" value={ownerId} name="ownerId" />
        {fileName ? (
          <div className="flex items-center gap-2">
            <Button type="submit" variant={"secondary"}>
              Upload
            </Button>
          </div>
        ) : null}
      </fetcher.Form>
      <JollyMenu label="Menu" variant="outline" className="min-w-36">
        <MenuSection>
          <MenuHeader>Controls</MenuHeader>
          <MenuItem onAction={() => setIsEditDialogOpen(true)}>
            <Pencil2Icon className="mr-2" /> <span>Edit</span>
          </MenuItem>
          <MenuItem onAction={simulateInputClick}>
            <ImageIcon className="mr-2" /> <span>Upload Cover Image</span>
          </MenuItem>
          <MenuItem>
            <StarIcon className="mr-2" /> <span>Favourite</span>
          </MenuItem>
          <MenuItem
            isDisabled={!hasEditPermission}
            onAction={() => navigate("settings", { relative: "path" })}
          >
            <GearIcon className="mr-2" /> <span>Settings</span>
          </MenuItem>
          <MenuItem onAction={() => setIsDuplicateDialogOpen(true)}>
            <Share1Icon className="mr-2" /> <span>Duplicate</span>
          </MenuItem>
          {hasEditPermission && folders ? (
            <SubmenuTrigger>
              <MenuItem>
                <FileIcon className="mr-2" />
                <span>Move..</span>
              </MenuItem>
              <MenuPopover>
                <Menu items={folders}>
                  {(item) => (
                    <MenuItem
                      onAction={() => submit({ folderId: item.id }, { method: "patch" })}
                    >
                      {item.name}
                    </MenuItem>
                  )}
                </Menu>
              </MenuPopover>
            </SubmenuTrigger>
          ) : null}
        </MenuSection>
        <MenuSection>
          <MenuHeader>Danger Zone</MenuHeader>
          <MenuItem
            isDisabled={!hasEditPermission}
            onAction={() => submit({}, { method: "delete" })}
          >
            <TrashIcon className="mr-2" /> <span>Delete</span>
          </MenuItem>
        </MenuSection>
      </JollyMenu>
    </>
  );
}

const useCustomUploadButton = () => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.[0]) {
      const { name } = files[0];
      setFileName(name);
    } else {
      handleSubmitCleanup();
    }
  };

  const handleSubmitCleanup = () => {
    setFileName("");
  };

  return {
    fileName,
    fileInputRef,
    simulateInputClick,
    handleFileChange,
    handleSubmitCleanup,
  };
};

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
      <Popover crossOffset={-150}>
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
