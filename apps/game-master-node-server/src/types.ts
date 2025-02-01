import type { UserData } from "alligator-auth/dist/types";

export type Variables = {
	jwtPayload: {
		userId: string;
	};
	user: UserData;
};
