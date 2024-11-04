import { Link } from "~/components/ui/link";
import { useAppData } from "../_app/route";

export default function Index() {
  const { userGames } = useAppData();
  return (
    <div className="font-sans p-4">
      <div className="flex flex-col gap-1">
        {userGames.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            {game.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
