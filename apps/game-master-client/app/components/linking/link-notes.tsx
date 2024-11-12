import { Popover, PopoverDialog, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import type { BasicEntity } from "@repo/api";
import { GridList, GridListItem } from "../ui/grid-list";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { useSubmit } from "@remix-run/react";

interface LinkNotesPopoverProps {
  allNotes: BasicEntity[];
  entityNotes: BasicEntity[];
}

export function LinkNotesPopover({ allNotes, entityNotes }: LinkNotesPopoverProps) {
  const submit = useSubmit();
  const [selectedNotes, setSelectedNotes] = useState(entityNotes.map((note) => note.id));
  const handleSelectionChange = (selection: Selection) => {
    if (selection !== "all") {
      setSelectedNotes([...selection] as string[]);
    }
  };
  const handleConfirm = (close: () => void) => {
    submit({ noteIds: selectedNotes }, { method: "PUT", encType: "application/json" });
    close();
  };

  return (
    <PopoverTrigger>
      <Button variant={"outline"} size={"sm"}>Edit</Button>
      <Popover>
        <PopoverDialog className="space-y-2">
          {({ close }) => (
            <>
              <GridList
                className={"border-0"}
                selectionMode="multiple"
                items={allNotes}
                selectedKeys={selectedNotes}
                onSelectionChange={handleSelectionChange}
              >
                {(item) => <GridListItem>{item.name}</GridListItem>}
              </GridList>
              <Button onPress={() => handleConfirm(close)}>Confirm</Button>
            </>
          )}
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  );
}
