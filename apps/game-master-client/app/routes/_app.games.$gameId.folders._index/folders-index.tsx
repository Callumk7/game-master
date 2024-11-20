import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { Container } from "~/components/container";
import { FolderTable } from "~/components/tables/folder-table";
import { CreateFolderSlideover } from "~/components/forms/create-folder-dialog";

export default function FolderIndex() {
  const { folders, gameId } = useTypedLoaderData<typeof loader>();
  return (
    <Container>
      <CreateFolderSlideover gameId={gameId} folders={folders} />
      <FolderTable folders={folders} />
    </Container>
  );
}
