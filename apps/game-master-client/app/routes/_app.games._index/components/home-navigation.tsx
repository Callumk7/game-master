import { SignoutButton } from "~/components/signout";
import { Link } from "~/components/ui/link";

export function HomeNavigation() {
  return (
    <nav className="flex items-center py-1 gap-1">
      <SignoutButton />
      <Link href="/games/new" variant={"outline"}>
        Create Game
      </Link>
    </nav>
  );
}
