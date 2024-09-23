import type { BasicEntity, EntityType } from "@repo/api";
import type { ReactNode } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tab, TabList, TabPanel, Tabs } from "./ui/tabs";
import { useGameData } from "~/routes/_app.games.$gameId/route";
import { GridList, GridListItem } from "./ui/grid-list";
import { useListData } from "react-stately";
import type { GridListProps } from "react-aria-components";

interface LinkDialogProps {
  entityId: string;
  entityType: EntityType;
  trigger: ReactNode;
  linkedNotes: BasicEntity[];
  linkedChars: BasicEntity[];
  linkedFactions: BasicEntity[];
}

export function LinkDialog({
  entityId,
  entityType,
  trigger,
  linkedNotes,
  linkedChars,
  linkedFactions,
}: LinkDialogProps) {
  const { notes, characters, factions } = useGameData(); // full list of game entities
  const notesState = useListData({
    initialItems: notes,
    initialSelectedKeys: linkedNotes.map((note) => note.id),
  });
  const charactersState = useListData({
    initialItems: characters,
    initialSelectedKeys: linkedChars.map((char) => char.id),
  });
  const factionsState = useListData({
    initialItems: notes,
    initialSelectedKeys: linkedFactions.map((faction) => faction.id),
  });

  const handleSaveOnClosed = () => {};
  return (
    <DialogTrigger>
      {trigger}
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link</DialogTitle>
          </DialogHeader>
          <div>
            <Tabs>
              <TabList>
                <Tab id="notes">Notes</Tab>
                <Tab id="chars">Characters</Tab>
                <Tab id="factions">Factions</Tab>
              </TabList>
              <TabPanel id="notes">
                <EntityGridBox
                  items={notesState.items}
                  selectionMode="multiple"
                  selectedKeys={notesState.selectedKeys}
                  onSelectionChange={notesState.setSelectedKeys}
                />
              </TabPanel>
              <TabPanel id="chars">
                <EntityGridBox
                  items={charactersState.items}
                  selectionMode="multiple"
                  selectedKeys={charactersState.selectedKeys}
                  onSelectionChange={charactersState.setSelectedKeys}
                />
              </TabPanel>
              <TabPanel id="factions">
                <EntityGridBox
                  items={factionsState.items}
                  selectionMode="multiple"
                  selectedKeys={factionsState.selectedKeys}
                  onSelectionChange={factionsState.setSelectedKeys}
                />
              </TabPanel>
            </Tabs>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}

export function EntityGridBox<T extends BasicEntity>({
  items,
  ...props
}: GridListProps<T>) {
  return (
    <GridList items={items} {...props}>
      {(item) => <GridListItem>{item.name}</GridListItem>}
    </GridList>
  );
}
