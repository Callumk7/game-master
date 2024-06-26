import {
	ModalOverlay,
	type ModalOverlayProps,
	Modal as RACModal,
} from "react-aria-components";
import { type VariantProps, tv } from "tailwind-variants";

const overlayStyles = tv({
	base: "fixed top-0 left-0 w-full h-[--visual-viewport-height] isolate z-20 bg-black/[15%] flex items-center justify-center p-4 text-center backdrop-blur-lg",
	variants: {
		isEntering: {
			true: "animate-in fade-in duration-200 ease-out",
		},
		isExiting: {
			true: "animate-out fade-out duration-200 ease-in",
		},
	},
});

const modalStyles = tv({
	base: "min-w-[40vw] rounded-2xl bg-grade-1 backdrop-blur-2xl backdrop-saturate-200 forced-colors:bg-[Canvas] text-left align-middle text-grade-12 shadow-2xl bg-clip-padding border border-grade-6",
	variants: {
		width: {
			fit: "w-fit",
			wide: "w-4/5",
		},
		height: {
			variable: "max-h-3/4",
			fixed: "h-lg",
		},
		isEntering: {
			true: "animate-in zoom-in-105 ease-out duration-200",
		},
		isExiting: {
			true: "animate-out zoom-out-95 ease-in duration-200",
		},
	},
	defaultVariants: {
		width: "fit",
		height: "variable",
	},
});

interface ModalProps extends ModalOverlayProps, VariantProps<typeof modalStyles> {
	className?: string;
}

export function Modal(props: ModalProps) {
	return (
		<ModalOverlay {...props} className={overlayStyles}>
			<RACModal
				{...props}
				className={modalStyles({
					width: props.width,
					height: props.height,
					className: props.className,
				})}
			/>
		</ModalOverlay>
	);
}
