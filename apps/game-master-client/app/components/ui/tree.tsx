import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "callum-util";
import {
  UNSTABLE_Tree as AriaTree,
  UNSTABLE_TreeItem as AriaTreeItem,
  UNSTABLE_TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps as AriaTreeItemContentProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps as AriaTreeProps,
  Button,
  Collection,
  composeRenderProps,
} from "react-aria-components";

function Tree<T extends object>({ className, children, ...props }: AriaTreeProps<T>) {
  return (
    <AriaTree
      className={composeRenderProps(className, (className) =>
        cn(className, "group overflow-auto w-full p-1 outline-none flex flex-col gap-1"),
      )}
      {...props}
    >
      {children}
    </AriaTree>
  );
}

interface TreeItemProps<T extends object> extends AriaTreeItemProps<T> {
  renderItem: (item: T) => JSX.Element;
  itemChildren?: T[];
}
const TreeItem = <T extends object>({
  className,
  children,
  renderItem,
  itemChildren,
  ...props
}: TreeItemProps<T>) => {
  return (
    <AriaTreeItem
      className={composeRenderProps(className, (className) =>
        cn(
          "[--padding:20px] pl-[calc((var(--tree-item-level)-1)*20px+var(--padding))] data-[has-child-rows]:[--padding:0px] flex items-center gap-2 min-h-7 rounded-md outline-none cursor-default text-popover-foreground relative",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <Collection items={itemChildren}>{renderItem}</Collection>
    </AriaTreeItem>
  );
};

interface TreeItemContentProps extends AriaTreeItemContentProps {
  itemLength?: number;
}
const TreeItemContent = ({ children, itemLength, ...props }: TreeItemContentProps) => {
  return (
    <AriaTreeItemContent {...props}>
      {composeRenderProps(children, (children, renderProps) => (
        <div className="flex gap-2 items-center w-full">
          {itemLength && itemLength > 0 ? (
            <Button
              slot="chevron"
              className={cn(
                "inline-flex items-center h-7 w-7 justify-center rounded-md",
                {
                  "outline-none ring-1 ring-ring": renderProps.isFocused,
                },
              )}
            >
              <ChevronDownIcon
                className={cn("-rotate-90 transition-transform duration-200", {
                  "rotate-0": renderProps.isExpanded,
                })}
              />
            </Button>
          ) : null}
          <div>{children}</div>
        </div>
      ))}
    </AriaTreeItemContent>
  );
};

export { Tree, TreeItem, TreeItemContent };
