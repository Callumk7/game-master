import { useLoaderData } from "@remix-run/react";
import { MemberSearchDialog } from "./components/member-search-dialog";
import { MemberTable } from "./components/member-table";
import type { loader } from "./route";

export function MembersRoute() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <MemberSearchDialog memberIds={game.members.map((member) => member.id)} />
      <MemberTable members={game.members} />
    </div>
  );
}
