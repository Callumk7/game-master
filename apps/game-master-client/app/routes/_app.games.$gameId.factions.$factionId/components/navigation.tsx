import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Toolbar } from "~/components/ui/toolbar";
import { factionHref } from "~/util/generate-hrefs";

interface FactionNavigationProps {
  factionId: string;
  gameId: string;
}

export function FactionNavigation({ factionId, gameId }: FactionNavigationProps) {
  const navigate = useNavigate();
  return (
    <nav>
      <Toolbar>
        <Button variant={"link"} onPress={() => navigate(factionHref(gameId, factionId))}>
          Overview
        </Button>
        <Button
          variant={"link"}
          onPress={() => navigate("members", { relative: "path" })}
        >
          Members
        </Button>
        <Button
          variant={"link"}
          onPress={() => navigate("relations", { relative: "path" })}
        >
          Relations
        </Button>
      </Toolbar>
    </nav>
  );
}
