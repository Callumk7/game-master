import type { User } from "@repo/api";
import { SignoutButton } from "~/components/signout";
import { Link } from "~/components/ui/link";

interface HomeNavigationProps {
  user: User;
}

export function HomeNavigation({ user }: HomeNavigationProps) {
  return (
    <nav className="flex items-center py-1">
      <SignoutButton />
      <Link href="/games/new" variant={"link"}>
        Create Game
      </Link>
      <Link href="/user" variant={"link"}>
        {user.username}'s Settings
      </Link>
    </nav>
  );
}
