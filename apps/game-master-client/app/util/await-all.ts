// biome-ignore lint/suspicious/noExplicitAny: Generic any solved with use of K
export async function resolve<T extends any[]>(
	...promises: { [K in keyof T]: Promise<T[K]> }
): Promise<T> {
	return Promise.all(promises);
}
