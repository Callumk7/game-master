import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
	userEmail: string;
	id: number;
	token: string;
};

export function useAppSession() {
	return useSession<SessionUser>({
		password: "ChangeThisBeforeShippingToProdOrYouWillBeFired",
	});
}
