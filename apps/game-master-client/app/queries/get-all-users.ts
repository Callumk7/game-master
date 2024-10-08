import { useQuery } from "@tanstack/react-query";
import { clientApi } from "~/lib/queries";

export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ["users", "all"],
		queryFn: async () => clientApi.users.getAllUsers(),
	});
};
