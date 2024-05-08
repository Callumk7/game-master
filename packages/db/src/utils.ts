export const itemOrArrayToArray = <T>(input: T | T[] | undefined): T[] => {
	let output: T[] = [];

	if (input) {
		if (Array.isArray(input)) {
			output = input;
		} else {
			output.push(input);
		}
	}

	return output;
};
