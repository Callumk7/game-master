import { useLoaderData } from "@remix-run/react";
import { useAppData } from "../_app/route";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { TableBody } from "react-aria-components";
import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { ChevronUpIcon } from "@radix-ui/react-icons";

export default function AppIndex() {
	const { allNotes, allSessions, allCharacters } = useAppData();
	return (
		<Container className="space-y-7">
			<Header>Recent Notes</Header>
			<Table aria-label="Notes table">
				<TableHeader>
					<Column isRowHeader>Name</Column>
					<Column isRowHeader>Created</Column>
				</TableHeader>
				<TableBody items={allNotes}>
					{(item) => (
						<Row>
							<Cell>{item.name}</Cell>
							<Cell>{item.createdAt.toLocaleString("gmt")}</Cell>
						</Row>
					)}
				</TableBody>
			</Table>
			<Header>Characters</Header>
			<Table aria-label="Character table">
				<TableHeader>
					<Column isRowHeader>Name</Column>
					<Column isRowHeader>Class</Column>
				</TableHeader>
				<TableBody items={allCharacters}>
					{(item) => (
						<Row>
							<Cell>{item.name}</Cell>
							<Cell>{item.class}</Cell>
						</Row>
					)}
				</TableBody>
			</Table>
		</Container>
	);
}
