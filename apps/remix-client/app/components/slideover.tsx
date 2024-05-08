import {
	ModalOverlay,
	ModalOverlayProps as AriaModalOverlayProps,
	Modal,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const overlayStyles = tv({
	base: "fixed top-0 left-0 w-full h-[--visual-viewport-height] isolate z-20 bg-black/[15%] flex items-center justify-center p-4 text-center backdrop-blur-lg",
	variants: {
		isEntering: {
			true: "animate-in fade-in-0 duration-100 ease-out",
		},
		isExiting: {
			true: "animate-out fade-out-0 duration-100 ease-in",
		},
	},
});

const slideoverStyles = tv({
	base: "fixed bottom-0 right-0 top-0 w-3/4 rounded-2xl bg-grade-1 backdrop-blur-2xl backdrop-saturate-200 forced-colors:bg-[Canvas] text-left align-middle text-grade-12 shadow-2xl bg-clip-padding border border-grade-6 entering:duration-100 entering:ease-out entering:animate-in entering:slide-in-from-right exiting:duration-100 exiting:animate-out exiting:slide-out-to-right",
	variants: {
		size: {
			wide: "w-3/4",
			half: "w-1/2",
			narrow: "w-1/3",
		},
	},
});

interface ModalOverlayProps extends AriaModalOverlayProps {
	size?: "wide" | "half" | "narrow";
	className?: string;
}
export function SlideOver({ className, size, ...props }: ModalOverlayProps) {
	return (
		<ModalOverlay {...props} className={overlayStyles}>
			<Modal {...props} className={slideoverStyles({ className, size })} />
		</ModalOverlay>
	);
}
