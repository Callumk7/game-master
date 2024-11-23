import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

type SuccessRedirectOptions = {
	onSuccess?: (message: string) => void;
	preserveSearchParams?: boolean;
};

export function useSuccessRedirect({
	onSuccess,
	preserveSearchParams = false,
}: SuccessRedirectOptions = {}) {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (searchParams.get("success") === "true") {
			const message =
				searchParams.get("message") ?? "Task was completed successfully";

			// Show toast
			toast(message);

			// Call optional success callback
			onSuccess?.(message);

			// Clean up search params
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.delete("success");
			newSearchParams.delete("message");

			if (preserveSearchParams && newSearchParams.toString()) {
				setSearchParams(newSearchParams);
			} else {
				setSearchParams({});
			}
		}
	}, [searchParams, setSearchParams, onSuccess, preserveSearchParams]);
}
