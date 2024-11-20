import type { CharacterWithFaction } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "~/components/ui/link";
import { characterHref, factionHref } from "~/util/generate-hrefs";
import { EditCharacterDialog } from "../forms/edit-character-dialog";
import { BaseTable } from "./base-table";
import { EntityRowControls } from "./shared";

interface CharacterTableProps {
  characters: CharacterWithFaction[];
}
export function CharacterTable({ characters }: CharacterTableProps) {
  const [isEditCharacterDialogOpen, setIsEditCharacterDialogOpen] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const selectedChar = characters.find((char) => char.id === selectedCharId);
  const table = useCharacterTable({
    data: characters,
    setIsEditCharacterDialogOpen,
    setSelectedCharId,
  });

  return (
    <>
      <BaseTable table={table} />
      {selectedChar && (
        <EditCharacterDialog
          character={selectedChar}
          isOpen={isEditCharacterDialogOpen}
          setIsOpen={setIsEditCharacterDialogOpen}
        />
      )}
    </>
  );
}

const h = createColumnHelper<CharacterWithFaction>();

interface CharacterTableHookProps {
  data: CharacterWithFaction[];
  setIsEditCharacterDialogOpen: (isOpen: boolean) => void;
  setSelectedCharId: (charId: string) => void;
}
const useCharacterTable = ({
  data,
  setIsEditCharacterDialogOpen,
  setSelectedCharId,
}: CharacterTableHookProps) => {
  const handleEdit = (charId: string) => {
    setSelectedCharId(charId);
    setIsEditCharacterDialogOpen(true);
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: Stable reference
  const columns = useMemo(() => {
    return [
      h.accessor("name", {
        header: "Name",
        cell: ({ cell, row }) => (
          <Link
            href={characterHref(row.original.gameId, row.original.id)}
            variant={"link"}
          >
            {cell.getValue()}
          </Link>
        ),
      }),
      h.accessor("race", {
        header: "Race",
        cell: ({ cell }) => cell.getValue(),
      }),
      h.accessor("characterClass", {
        header: "Class",
        cell: ({ cell }) => cell.getValue(),
      }),
      h.accessor("level", {
        header: "Level",
        cell: ({ cell }) => cell.getValue(),
      }),
      h.accessor("primaryFaction.name", {
        header: "Primary Faction",
        cell: ({ cell, row }) => {
          if (row.original.primaryFaction) {
            return (
              <Link
                variant={"link"}
                href={factionHref(row.original.gameId, row.original.primaryFaction?.id)}
              >
                {cell.getValue()}
              </Link>
            );
          }
        },
      }),
      h.accessor("userPermissionLevel", {
        header: "Permission Level",
        cell: ({ cell }) => cell.getValue(),
      }),
      h.display({
        id: "controls",
        header: "Controls",
        cell: ({ row }) => (
          <EntityRowControls entityId={row.original.id} handleEdit={handleEdit} />
        ),
      }),
    ];
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
};
