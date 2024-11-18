import type { Game } from "@repo/api";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { useAppData } from "../_app/route";
import { HomeNavigation } from "./components/home-navigation";

export default function Index() {
  const { userGames, userData } = useAppData();
  return (
    <div className="font-sans p-4">
      <HomeNavigation user={userData} />
      <div className="flex flex-col gap-1">
        {userGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="p-5 w-fit">
      <Link key={game.id} href={`/games/${game.id}`} variant={"link"} className={"pl-0"}>
        <span className="text-lg font-black tracking-wide">{game.name}</span>
      </Link>
      <p className="text-sm whitespace-pre-wrap">{game.description}</p>
    </Card>
  );
}
