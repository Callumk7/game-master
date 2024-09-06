import { useParams } from "@remix-run/react";

export default function GameRoute() {
	const { gameId } = useParams();
	return <p>{gameId}</p>
}
