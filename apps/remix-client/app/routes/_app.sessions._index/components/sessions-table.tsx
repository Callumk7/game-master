import type { Session } from "@repo/db";
import { TableBody } from "react-aria-components";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";

interface SessionsTableProps {
	sessions: Session[];
}

export function SessionsTable({ sessions }: SessionsTableProps) {
	return (
		<Table>
			<TableHeader>
				<Column isRowHeader>Name</Column>
				<Column isRowHeader>Number</Column>
			</TableHeader>
			<TableBody items={sessions}>
				{(item) => (
					<Row>
						<Cell>{item.name}</Cell>
						<Cell>{item.sessionNumber}</Cell>
					</Row>
				)}
			</TableBody>
		</Table>
	);
}
