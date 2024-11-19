import { useState } from "react";
import { useAppData } from "~/routes/_app/route";
import { Button } from "./ui/button";
import { Link } from "./ui/link";
import { GearIcon } from "@radix-ui/react-icons";

export function SignoutButton() {
  const { userData } = useAppData();
  const [label, setLabel] = useState(userData.username);
  return (
    <>
      <form method="POST" action="/logout">
        <Button
          variant={label === "Logout?" ? "destructive" : "outline"}
          type="submit"
          onHoverStart={() => setLabel("Logout?")}
          onHoverEnd={() => setLabel(userData.username)}
          className={"w-24"}
        >
          {label}
        </Button>
      </form>
      <Link size={"icon"} variant={"outline"} href={`/user/${userData.id}`}>
        <GearIcon />
      </Link>
    </>
  );
}
