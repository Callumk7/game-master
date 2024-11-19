import { useNavigate, useParams } from "@remix-run/react";

export const getGameParam = () => {
	const navigate = useNavigate();
	const { gameId } = useParams<"gameId">();

	if (!gameId) {
		navigate("/");
		return "";
	}

	return gameId;
};
