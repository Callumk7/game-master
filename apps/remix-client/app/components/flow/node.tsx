// A powerful feature of React Flow is the ability to add custom nodes.
// Within your custom nodes you can render everything you want.
// You can define multiple source and target handles and render form inputs or charts for example.
// In this section we will implement a node with an input field that updates some text in another part of the application.

import { type ChangeEvent, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Link } from "../ui/link";

export function MainNode(props: NodeProps) {
	return (
		<>
			<div className="p-3 border rounded-lg border-amber-9">
				<Link href={`/${props.data.entityType}/${props.id}`}>{props.data.label}</Link>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</>
	);
}
