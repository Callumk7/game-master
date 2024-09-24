/**
 * Has side effect: This function will append the form arg with the items arg
 */
export const appendFormWithArray = <T>(
	form: FormData,
	items: Iterable<T> | T[],
	fieldName: string,
) => {
	const array = Array.from(items);
	for (const item of array) {
		form.append(fieldName, String(item));
	}
};
