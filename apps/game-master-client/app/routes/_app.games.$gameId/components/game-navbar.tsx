import { useParams } from "@remix-run/react";
import { Link } from "~/components/ui/link";
import { GameSettingsMenu } from "./game-settings-menu";

const createLinks = (gameId: string) => {
	return [
		{
			label: "Notes",
			href: `/games/${gameId}/notes`,
		},
		{
			label: "Characters",
			href: `/games/${gameId}/characters`,
		},
		{
			label: "Factions",
			href: `/games/${gameId}/factions`,
		},
	];
};

export function GameNavbar() {
	const params = useParams();
	const links = createLinks(params.gameId!);
	return (
		<nav className="flex w-full justify-between items-center">
			<div className="flex gap-4">
				{links.map((link) => (
					<Link key={link.label} href={link.href} variant={"ghost"}>
						{link.label}
					</Link>
				))}
			</div>
			<GameSettingsMenu gameId={params.gameId!} />
		</nav>
	);
}
