import { Handle, Position, type NodeProps } from "reactflow";
import { Link } from "../ui/link";
import type { NodeData } from "./utils";

export function FactionNode(props: NodeProps<NodeData>) {
	return (
		<>
			<Handle type="target" position={Position.Top} />
			<div className="p-3 border rounded-lg border-amber-9">
				<p className="text-xs font-thin text-grade-10 italic py-1">Faction</p>
				<Link className={"text-sm"} href={`/${props.data.entityType}/${props.id}`}>
					{props.data.label}
				</Link>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</>
	);
}

export function CharacterNode(props: NodeProps<NodeData>) {
	return (
		<>
			<Handle type="target" position={Position.Top} />
			<div className="p-3 border rounded-lg border-jade-9">
				<p className="text-xs font-thin text-grade-10 italic py-1">Character</p>
				<Link href={`/${props.data.entityType}/${props.id}`}>{props.data.label}</Link>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</>
	);
}
export function SessionNode(props: NodeProps<NodeData>) {
	return (
		<>
			<div className="p-3 border rounded-lg border-primary-9">
				<p className="text-xs font-thin text-grade-10 italic py-1">Session</p>
				<Link href={`/${props.data.entityType}/${props.id}`}>{props.data.label}</Link>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</>
	);
}
export function NoteNode(props: NodeProps<NodeData>) {
	return (
		<>
			<Handle type="target" position={Position.Top} />
			<div className="p-3 border rounded-lg border-primary-7">
				<p className="text-xs font-thin text-grade-10 italic py-1">Note</p>
				<Link href={`/${props.data.entityType}/${props.id}`}>{props.data.label}</Link>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</>
	);
}
