import { ChevronDownIcon, FilePlusIcon } from "@radix-ui/react-icons";
import type {
  BasicEntity,
  EntityType,
  FolderWithDatedEntities,
  Game,
  GameWithDatedEntities,
} from "@repo/api";
import { Group } from "react-aria-components";
import { SignoutButton } from "~/components/signout";
import { Link } from "~/components/ui/link";
import { JollyMenu, MenuItem } from "~/components/ui/menu";
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSyncSelectedGameWithParams } from "./sync-selected-game";
import { Text } from "~/components/ui/typeography";
import { useMemo, useState } from "react";
import { ThemeToggle } from "~/lib/theme/dark-mode-context";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { JollyTextField } from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import { Form } from "@remix-run/react";
import { Tree, TreeItem } from "~/components/ui/tree";

interface GameSidebarProps {
  gamesWithAllEntities: GameWithDatedEntities[];
}

export function GameSidebar({ gamesWithAllEntities }: GameSidebarProps) {
  const { selectedGame, updateSelection } = useSyncSelectedGameWithParams();

  const { gameNotes, gameChars, gameFactions, gameFolders } = findGameEntities(
    gamesWithAllEntities,
    selectedGame,
  );

  return (
    <aside className="w-64 border-r fixed h-full overflow-y-auto p-4 space-y-4">
      <div className="flex justify-between items-end">
        <SignoutButton />
        <ThemeToggle />
      </div>
      <SidebarTools
        games={gamesWithAllEntities}
        selectedGame={selectedGame}
        setSelectedGame={updateSelection}
      />
      <div className="flex flex-col items-start space-y-4 divide-y w-full">
        <EntityGroup
          title="Notes"
          items={gameNotes}
          itemType="notes"
          selectedGame={selectedGame}
        />
        <EntityGroup
          title="Characters"
          items={gameChars}
          itemType="characters"
          selectedGame={selectedGame}
        />
        <EntityGroup
          title="Factions"
          items={gameFactions}
          itemType="factions"
          selectedGame={selectedGame}
        />
        <FolderTree folders={gameFolders} gameId={selectedGame} />
      </div>
    </aside>
  );
}

const findGameEntities = (
  gamesWithAllEntities: GameWithDatedEntities[],
  selectedGame: string,
) => {
  const notes =
    gamesWithAllEntities.find((game) => game.id === selectedGame)?.notes ?? [];
  const gameNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes]);

  const chars =
    gamesWithAllEntities.find((game) => game.id === selectedGame)?.characters ?? [];
  const gameChars = useMemo(() => {
    return [...chars].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [chars]);

  const factions =
    gamesWithAllEntities.find((game) => game.id === selectedGame)?.factions ?? [];
  const gameFactions = useMemo(() => {
    return [...factions].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [factions]);

  const folders =
    gamesWithAllEntities.find((game) => game.id === selectedGame)?.folders ?? [];
  const gameFolders = useMemo(() => {
    return [...folders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [folders]);

  return {
    gameNotes,
    gameChars,
    gameFactions,
    gameFolders,
  };
};

interface EntityGroupProps {
  title: string;
  items: BasicEntity[];
  selectedGame: string;
  itemType: EntityType;
}

function EntityGroup({ title, items, selectedGame, itemType }: EntityGroupProps) {
  return (
    <div className="w-full py-1">
      <Text variant={"label"} id="title">
        {title}
      </Text>
      <Group className={"flex flex-col gap-y-2 items-start"} aria-labelledby="title">
        {items.map((note) => (
          <Link
            key={note.id}
            variant={"link"}
            href={`/games/${selectedGame}/${itemType}/${note.id}`}
            className={"text-wrap h-fit pl-0"}
          >
            {note.name}
          </Link>
        ))}
      </Group>
    </div>
  );
}

type TreeEntry = {
  id: string;
  name: string;
  type: EntityType | "folders";
  children?: TreeEntry[] | undefined;
};

interface FolderTreeProps {
  gameId: string;
  folders: FolderWithDatedEntities[];
}
function FolderTree({ folders, gameId }: FolderTreeProps) {
  const mapFolderToTree = (folder: FolderWithDatedEntities): TreeEntry => {
    const children: TreeEntry[] = [
      ...folder.notes.map(({ id, name }) => ({
        id,
        name,
        type: "notes" as const,
        children: [],
      })),
      ...folder.characters.map(({ id, name }) => ({
        id,
        name,
        type: "characters" as const,
        children: [],
      })),
      ...folder.factions.map(({ id, name }) => ({
        id,
        name,
        type: "factions" as const,
        children: [],
      })),
      ...(folder.children?.map(mapFolderToTree) || []),
    ];

    return { id: folder.id, name: folder.name, type: "folders" as const, children };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: incorrect rule.
  const mappedFolders = useMemo(() => {
    const mappedFolders: TreeEntry[] = [];
    for (const folder of folders) {
      mappedFolders.push(mapFolderToTree(folder));
    }
    return mappedFolders;
  }, [folders]);

  return (
    <Tree items={mappedFolders}>
      {function renderItems(item) {
        return (
          <TreeItem
            textValue={item.name}
            itemChildren={item.children}
            renderFunction={renderItems}
          >
            <div className="flex w-full gap-2 items-center">
              {item.children?.length ? (
                <Button size={"icon"} variant={"ghost"} slot="chevron">
                  <ChevronDownIcon />
                </Button>
              ) : null}
              <Link
                href={`/games/${gameId}/${item.type}/${item.id}`}
                variant={item.type !== "folders" ? "link" : "ghost"}
              >
                {item.name}
              </Link>
            </div>
          </TreeItem>
        );
      }}
    </Tree>
  );
}

interface SidebarToolsProps {
  selectedGame: string;
  setSelectedGame: (key: string) => void;
  games: Game[];
}

function SidebarTools({ selectedGame, setSelectedGame, games }: SidebarToolsProps) {
  return (
    <Group className={"flex gap-2 w-full"} aria-label="Game tools">
      <Select
        selectedKey={selectedGame}
        onSelectionChange={(key) => setSelectedGame(key.toString())}
        className={"flex-1 min-w-0"}
        aria-label="Game select dropdown"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopover>
          <SelectListBox items={games}>
            {(item) => <SelectItem href={`/games/${item.id}`}>{item.name}</SelectItem>}
          </SelectListBox>
        </SelectPopover>
      </Select>
      <NewEntityMenu selectedGame={selectedGame} />
    </Group>
  );
}

interface NewEntityMenuProps {
  selectedGame: string;
}
function NewEntityMenu({ selectedGame }: NewEntityMenuProps) {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  return (
    <>
      <JollyMenu
        label={<FilePlusIcon />}
        size={"icon"}
        variant={"outline"}
        aria-label="New item menu"
      >
        <MenuItem href={"/games/new"}>Game</MenuItem>
        <MenuItem href={`/games/${selectedGame}/notes/new`}>Note</MenuItem>
        <MenuItem href={`/games/${selectedGame}/characters/new`}>Character</MenuItem>
        <MenuItem href={`/games/${selectedGame}/factions/new`}>Faction</MenuItem>
        <MenuItem onAction={() => setIsNewFolderDialogOpen(true)}>Folder</MenuItem>
      </JollyMenu>
      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        setIsOpen={setIsNewFolderDialogOpen}
        selectedGame={selectedGame}
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
            <DialogHeader>
              <DialogTitle>Create a folder</DialogTitle>
            </DialogHeader>
            <JollyTextField label="Name" name="name" />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
            <input type="hidden" name="gameId" value={selectedGame} />
          </Form>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}
