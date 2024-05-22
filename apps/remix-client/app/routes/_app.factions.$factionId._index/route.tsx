import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/text-field";
import { Form } from "@remix-run/react";

export default function FactionIndex() {
	return (
		<div className="grid grid-cols-5 gap-2">
			<div className="col-span-1">
				<Button size="sm" variant="outline">
					Edit
				</Button>
				<MemberTable />
			</div>
			<div className="col-span-4">
				<EditMemberRoleForm />
			</div>
		</div>
	);
}

function MemberTable() {
	const { faction } = useFactionRouteData();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{faction.members.map((char) => (
					<TableRow key={char.characterId}>
						<TableCell>{char.character.name}</TableCell>
						<TableCell>{char.role}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function EditMemberRoleForm() {
	const { faction } = useFactionRouteData();
	return (
		<Form className="flex flex-col gap-4">
			{faction.members.map((member) => (
				<TextField
					key={member.characterId}
					label={member.character.name}
					name={member.characterId}
				/>
			))}
			<Button type="submit">Submit</Button>
		</Form>
	);
}
