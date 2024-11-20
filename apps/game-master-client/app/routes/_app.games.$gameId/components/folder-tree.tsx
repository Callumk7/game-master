import type { EntityType, FolderWithDatedEntities } from "@repo/api";
import { useMemo } from "react";
import { Link } from "~/components/ui/link";
import { Tree, TreeItem, TreeItemContent } from "~/components/ui/tree";
import { hrefFor } from "~/util/generate-hrefs";

type TreeEntry = {
  id: string;
  name: string;
  type: EntityType | "folders";
  children?: TreeEntry[] | undefined;
};

interface FolderTreeProps {
  gameId: string;
  folders: FolderWithDatedEntities[];
}

export function FolderTree({ folders, gameId }: FolderTreeProps) {
  const mappedFolders = useMappedFolders(folders);

  return (
    <Tree
      items={mappedFolders}
      defaultExpandedKeys={mappedFolders.map((f) => f.id)}
      aria-label="Sidebar folders"
    >
      {function renderItem(item) {
        return (
          <TreeItem
            textValue={item.name}
            aria-label="Sidebar items"
            renderItem={renderItem}
            itemChildren={item.children}
          >
            <TreeItemContent itemLength={item.children?.length}>
              {item.type !== "folders" ? (
                <Link
                  href={hrefFor(item.type, gameId, item.id)}
                  variant={"link"}
                  className="py-0 pl-0 text-wrap"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </TreeItemContent>
          </TreeItem>
        );
      }}
    </Tree>
  );
}

const useMappedFolders = (folders: FolderWithDatedEntities[]) => {
  return useMemo(() => {
    const mappedFolders = [];
    for (const folder of folders) {
      mappedFolders.push(mapFolderToTree(folder));
    }
    return mappedFolders;
  }, [folders]);
};

const mapFolderToTree = (folder: FolderWithDatedEntities): TreeEntry => {
  const children: TreeEntry[] = [
    ...folder.notes.map(({ id, name }) => ({
      id,
      name,
      type: "notes" as const,
      children: [],
    })),
    ...folder.characters.map(({ id, name }) => ({
      id,
      name,
      type: "characters" as const,
      children: [],
    })),
    ...folder.factions.map(({ id, name }) => ({
      id,
      name,
      type: "factions" as const,
      children: [],
    })),
    ...(folder.children?.map(mapFolderToTree) || []),
  ];

  return { id: folder.id, name: folder.name, type: "folders" as const, children };
};
