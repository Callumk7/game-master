import { cn } from "callum-util";
import {
  Toolbar as AriaToolbar,
  type ToolbarProps,
  composeRenderProps,
} from "react-aria-components";

export function Toolbar(props: ToolbarProps) {
  return (
    <AriaToolbar
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cn(
          "flex gap-2",
          /* Orientation */
          "data-[orientation=vertical]:flex-col",
          className,
        ),
      )}
    />
  );
}
