import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Link } from "../ui/link";

export function InlineMention(props: NodeViewProps) {
	return (
		<NodeViewWrapper className="inline w-fit">
			<Link
				variant={"link"}
				href={props.node.attrs.href}
				className={"px-0 text-base font-normal"}
			>
				{props.node.attrs.label}
			</Link>
		</NodeViewWrapper>
	);
}
