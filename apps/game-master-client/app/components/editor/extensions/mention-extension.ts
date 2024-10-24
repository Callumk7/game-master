import { default as MentionExtension } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { InlineMention } from "../components/mention";

export const CustomMention = MentionExtension.extend({
	addAttributes() {
		return {
			href: {
				default: "href",
			},
			label: {
				default: "default-label",
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "mention-component",
			},
		];
	},
	renderHTML({ HTMLAttributes, node }) {
		return [
			"mention-component",
			mergeAttributes(
				{ href: node.attrs.href, label: node.attrs.label },
				HTMLAttributes,
			),
		];
	},
	addNodeView() {
		return ReactNodeViewRenderer(InlineMention);
	},
});
