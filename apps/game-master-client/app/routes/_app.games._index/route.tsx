import type { Game } from "@repo/api";
import { Layout } from "~/components/layout";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { useAppData } from "../_app/route";
import { HomeNavigation } from "./components/home-navigation";

export default function Index() {
  const { userGames } = useAppData();
  return (
    <Layout width="wide">
      <HomeNavigation />
      <div className="flex flex-wrap gap-1">
        {userGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </Layout>
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
