import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Toolbar } from "~/components/ui/toolbar";

interface CharacterNavigationProps {
  charId: string;
  gameId: string;
}

// Using buttons instead of links so we can use Remix's navigate hook, to access
// relative path navigation
export function CharacterNavigation({ charId, gameId }: CharacterNavigationProps) {
  const navigate = useNavigate();
  return (
    <Toolbar>
      <Button
        onPress={() => navigate(`/games/${gameId}/characters/${charId}`)}
        variant={"link"}
      >
        Overview
      </Button>
      <Button onPress={() => navigate("factions", { relative: "path" })} variant={"link"}>
        Factions
      </Button>
      <Button onPress={() => navigate("relations", { relative: "path" })} variant={"link"}>
        Relations
      </Button>
    </Toolbar>
  );
}
