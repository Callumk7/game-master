import { GearIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useAppData } from "~/routes/_app/route";
import { Button } from "./ui/button";
import { Link } from "./ui/link";
import { Toolbar } from "./ui/toolbar";

export function SignoutButton() {
  const { userData } = useAppData();
  const [label, setLabel] = useState(userData.username);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <Toolbar className="self-end">
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
