import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance } from "tippy.js";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { MentionList } from "../components/mention-list";
import type { MentionItem } from "~/types/mentions";

export const suggestion: Partial<SuggestionOptions<MentionItem>> = {
	allowSpaces: true,
	render: () => {
		let component: ReactRenderer<
			ReturnType<NonNullable<SuggestionOptions["render"]>>,
			SuggestionProps<MentionItem>
		>;
		let popup: Instance;

		return {
			onStart: (props) => {
				component = new ReactRenderer(MentionList, {
					props,
					editor: props.editor,
				});

				if (!props.clientRect) {
					return;
				}

				popup = tippy(document.body as Element, {
					getReferenceClientRect: props.clientRect as () => DOMRect,
					appendTo: () => document.body,
					content: component.element,
					showOnCreate: true,
					interactive: true,
					trigger: "manual",
					placement: "bottom-start",
				});
			},

			onUpdate(props) {
				component.updateProps(props);

				if (!props.clientRect) {
					return;
				}

				popup.setProps({
					getReferenceClientRect: props.clientRect as () => DOMRect,
				});
			},

			onKeyDown(props) {
				if (props.event.key === "Escape") {
					popup.hide();

					return true;
				}

				return !!component?.ref?.onKeyDown?.(props);
			},

			onExit() {
				popup.destroy();
				component.destroy();
			},
		};
	},
};
