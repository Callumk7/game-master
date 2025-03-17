import { FilePlusIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import type { BasicEntityWithDates, EntityType, GameWithDatedEntities } from "@repo/api";
import { useState } from "react";
import { SignoutButton } from "~/components/signout";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { Link } from "~/components/ui/link";
import { JollyMenu, MenuItem } from "~/components/ui/menu";
import { JollyTextField } from "~/components/ui/textfield";
import { Text } from "~/components/ui/typeography";
import { ThemeToggle } from "~/lib/theme/dark-mode-context";
import { hrefFor } from "~/util/generate-hrefs";
import { FolderTree } from "./folder-tree";

interface GameSidebarProps {
  gameWithSidebarData: GameWithDatedEntities;
}

export function GameSidebar({ gameWithSidebarData }: GameSidebarProps) {
  const gameNotes = gameWithSidebarData.notes;
  const gameChars = gameWithSidebarData.characters;
  const gameFactions = gameWithSidebarData.factions;
  const gameFolders = gameWithSidebarData.folders;

  return (
    <aside className="overflow-y-auto fixed p-4 space-y-4 w-64 h-full border-r">
      <div className="flex justify-between items-end">
        <SignoutButton />
        <ThemeToggle />
      </div>
      <NewEntityMenu gameId={gameWithSidebarData.id} className="flex-none my-auto" />
      <div className="flex flex-col gap-y-4 items-start">
        <FolderTree gameId={gameWithSidebarData.id} folders={gameFolders ?? []} />
        <SidebarSection items={gameNotes} type="notes" label="Notes" />
        <SidebarSection items={gameChars} type="characters" label="Characters" />
        <SidebarSection items={gameFactions} type="factions" label="Factions" />
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  type: EntityType;
  items: BasicEntityWithDates[];
  label: string;
}
export function SidebarSection({ type, items, label }: SidebarSectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="pl-4 w-full">
      <Text variant={"label"} id="label">
        {label}
      </Text>
      <hr />
      <nav aria-labelledby="label" className="flex flex-col items-start mt-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={hrefFor(type, item.gameId, item.id)}
            variant={"link"}
            className={"pl-0"}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

interface NewEntityMenuProps {
  className?: string;
  gameId: string;
}
function NewEntityMenu({ gameId, className }: NewEntityMenuProps) {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  return (
    <>
      <JollyMenu
        label={<FilePlusIcon />}
        size={"icon"}
        variant={"outline"}
        aria-label="New item menu"
        className={className}
      >
        <MenuItem href={"/games/new"}>Game</MenuItem>
        <MenuItem href={`/games/${gameId}/notes/new`}>Note</MenuItem>
        <MenuItem href={`/games/${gameId}/characters/new`}>Character</MenuItem>
        <MenuItem href={`/games/${gameId}/factions/new`}>Faction</MenuItem>
        <MenuItem onAction={() => setIsNewFolderDialogOpen(true)}>Folder</MenuItem>
      </JollyMenu>
      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        setIsOpen={setIsNewFolderDialogOpen}
        selectedGame={gameId}
      />
    </>
  );
}

interface NewFolderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedGame: string;
}

export function NewFolderDialog({
  isOpen,
  setIsOpen,
  selectedGame,
}: NewFolderDialogProps) {
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        {({ close }) => (
          <Form onSubmit={close} method="post" action={`/games/${selectedGame}/folders`}>
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>Create a folder</DialogTitle>
              </DialogHeader>
              <JollyTextField label="Name" name="name" />
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </div>
            <input type="hidden" name="gameId" value={selectedGame} />
          </Form>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}
