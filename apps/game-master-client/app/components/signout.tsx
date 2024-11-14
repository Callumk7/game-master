import { useAppData } from "~/routes/_app/route";
import { Button } from "./ui/button";
import { useState } from "react";

export function SignoutButton() {
  const { userData } = useAppData();
  const [label, setLabel] = useState(userData.username);
  return (
    <form method="POST" action="/logout">
      <Button
        variant={label === "Logout?" ? "destructive" : "outline"}
        type="submit"
        onHoverStart={() => setLabel("Logout?")}
        onHoverEnd={() => setLabel(userData.username)}
        className={"w-20"}
      >
        {label}
      </Button>
    </form>
  );
}
