import { cn } from "callum-util";
import {
  UNSTABLE_Tree as AriaTree,
  UNSTABLE_TreeItem as AriaTreeItem,
  UNSTABLE_TreeItemContent as AriaTreeItemContent,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps as AriaTreeProps,
  Collection,
  composeRenderProps,
} from "react-aria-components";

function Tree<T extends object>({ className, ...props }: AriaTreeProps<T>) {
  return (
    <AriaTree
      className={composeRenderProps(className, (className) =>
        cn(
          className,
          "group overflow-auto w-full p-1 text-popover-foreground outline-none",
        ),
      )}
      {...props}
    />
  );
}

interface TreeItemProps<T> extends AriaTreeItemProps<T> {
  itemChildren: T[] | undefined;
  renderFunction: (item: T) => JSX.Element;
}
const TreeItem = <T extends object>({
  className,
  children,
  itemChildren,
  renderFunction,
  ...props
}: TreeItemProps<T>) => {
  return (
    <AriaTreeItem
      className={composeRenderProps(className, (className) =>
        cn("pl-[calc((var(--tree-item-level)-1)*10px)]", className),
      )}
      {...props}
    >
      <AriaTreeItemContent>{children}</AriaTreeItemContent>
      <Collection items={itemChildren}>{renderFunction}</Collection>
    </AriaTreeItem>
  );
};

const TreeItemContent = AriaTreeItemContent;

export { Tree, TreeItem, TreeItemContent };
