import { Handle, Position, type NodeProps } from "reactflow";
import { Link } from "../ui/link";
import type { NodeData } from "./utils";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { cn } from "callum-util";

interface BaseNodeProps extends NodeProps<NodeData> {
	className?: string;
	label: string;
	topHandle?: boolean;
	bottomHandle?: boolean;
}

function BaseNode({
	className,
	label,
	topHandle,
	bottomHandle,
	...props
}: BaseNodeProps) {
	return (
		<>
			{topHandle && <Handle type="target" position={Position.Top} />}
			<div
				className={cn(
					"p-3 pr-6 border rounded-lg bg-grade-1 border-amber-9 relative",
					className,
				)}
			>
				<DragHandleDots2Icon className="absolute top-2 w-5 h-5 right-2 drag-handle" />
				<p className="text-xs font-thin text-grade-10 italic py-1">{label}</p>
				<Link className={"text-sm"} href={`/${props.data.entityType}/${props.id}`}>
					{props.data.label}
				</Link>
			</div>
			{bottomHandle && <Handle type="source" position={Position.Bottom} />}
		</>
	);
}

export function FactionNode(props: NodeProps<NodeData>) {
	return (
		<BaseNode
			label="Faction"
			topHandle
			bottomHandle
			className="border-primary-9"
			{...props}
		/>
	);
}

export function CharacterNode(props: NodeProps<NodeData>) {
	return (
		<BaseNode
			label="Character"
			topHandle
			bottomHandle
			className="border-jade-9"
			{...props}
		/>
	);
}
export function SessionNode(props: NodeProps<NodeData>) {
	return <BaseNode label="Session" bottomHandle {...props} />;
}
export function NoteNode(props: NodeProps<NodeData>) {
	return <BaseNode label="Note" topHandle bottomHandle {...props} />;
}
