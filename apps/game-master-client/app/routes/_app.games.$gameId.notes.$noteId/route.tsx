import { useParams } from "@remix-run/react";
import { Text } from "~/components/ui/typeography";

export default function NotesRoute() {
  const { gameId, noteId } = useParams();
  return (
    <div className="p-4 space-y-4">
      <Text variant={"h1"}>{noteId}</Text>
      <Text variant={"h2"}>{gameId}</Text>
    </div>
  );
}
