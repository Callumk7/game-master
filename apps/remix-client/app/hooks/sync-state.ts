import { useState } from "react";

type StateFunction = () => void;

export const useStateSync = <T>(data: T, stateFunction: StateFunction) => {
	const [prevData, setPrevData] = useState(data);
	if (data !== prevData) {
		setPrevData(data);
		stateFunction();
	}
};
