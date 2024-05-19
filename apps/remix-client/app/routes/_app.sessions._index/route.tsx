import { Header } from "~/components/typeography";
import { SessionsTable } from "./components/sessions-table";
import { useAppData } from "../_app/route";

export default function SessionIndex() {
	const { allSessions } = useAppData();
	return (
		<div>
			<Header>Sessions</Header>
			<SessionsTable sessions={allSessions} />
		</div>
	);
}
