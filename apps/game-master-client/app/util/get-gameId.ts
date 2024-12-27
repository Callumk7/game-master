import { useNavigate, useParams } from "react-router";

export const getGameParam = () => {
	const navigate = useNavigate();
	const { gameId } = useParams<"gameId">();

	if (!gameId) {
		navigate("/");
		return "";
	}

	return gameId;
};
