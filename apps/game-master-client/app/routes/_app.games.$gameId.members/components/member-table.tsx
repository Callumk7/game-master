import { TrashIcon } from "@radix-ui/react-icons";
import { Form, useFetcher } from "react-router";
import type { GameMember, Role } from "@repo/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Key } from "react";
import { Button } from "~/components/ui/button";
import { JollySelect, SelectItem } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const helper = createColumnHelper<GameMember>();

const columns = [
  helper.accessor("firstName", {
    cell: (info) => info.cell.getValue(),
    header: () => "First Name",
  }),
  helper.accessor("lastName", {
    cell: (info) => info.cell.getValue(),
    header: () => "Last Name",
  }),
  helper.accessor("email", {
    cell: (info) => info.cell.getValue(),
    header: () => "Email",
  }),
  helper.accessor("role", {
    header: () => "Role",
    cell: (info) => (
      <RoleSelect initRole={info.cell.getValue()} userId={info.row.original.id} />
    ),
  }),
  helper.display({
    id: "controls",
    header: () => "Controls",
    cell: (info) => (
      <Form method="DELETE">
        <Button
          type="submit"
          name="userId"
          value={info.row.original.id}
          variant={"destructive"}
          size={"icon"}
        >
          <TrashIcon />
        </Button>
      </Form>
    ),
  }),
];

interface MemberTableProps {
  members: GameMember[];
}

export function MemberTable({ members }: MemberTableProps) {
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface RoleSelectProps {
  userId: string;
  initRole: Role;
}

export function RoleSelect({ userId, initRole }: RoleSelectProps) {
  const fetcher = useFetcher();

  const handleSelectChange = (key: Key) => {
    fetcher.submit({ userId, role: key.toString() }, { method: "patch" });
  };
  return (
    <JollySelect onSelectionChange={handleSelectChange} defaultSelectedKey={initRole}>
      <SelectItem id="admin">Admin</SelectItem>
      <SelectItem id="dm">Dungeon Master</SelectItem>
      <SelectItem id="player">Player</SelectItem>
      <SelectItem id="guest">Guest</SelectItem>
    </JollySelect>
  );
}
