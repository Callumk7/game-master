import { GearIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useAppData } from "~/routes/_app/route";
import { Button } from "./ui/button";
import { Link } from "./ui/link";
import { Toolbar } from "./ui/toolbar";
import { useAlligator } from "alligator-auth";

export function SignoutButton() {
  const { userData } = useAppData();
  const [label, setLabel] = useState(userData.username);

  const auth = useAlligator();

  const handleLogout = async () => {
    await auth.logout();
  };

  return (
    <Toolbar>
      <Button
        variant={label === "Logout?" ? "destructive" : "outline"}
        type="submit"
        onHoverStart={() => setLabel("Logout?")}
        onHoverEnd={() => setLabel(userData.username)}
        onPress={handleLogout}
        className={"w-24"}
      >
        {label}
      </Button>
      <Link size={"icon"} variant={"outline"} href={`/user/${userData.id}`}>
        <GearIcon />
      </Link>
    </Toolbar>
  );
}
