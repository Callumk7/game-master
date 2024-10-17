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

// biome-ignore lint/suspicious/noExplicitAny: Generic any solved with use of K
export async function resolve<T extends any[]>(...promises: { [K in keyof T]: Promise<T[K]> }): Promise<T> {
  return Promise.all(promises);
}

