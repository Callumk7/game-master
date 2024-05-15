import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useFactionRouteData } from "../_app.factions.$factionId/route";

export default function FactionIndex() {
	return (
		<div>
			<MemberTable />
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
