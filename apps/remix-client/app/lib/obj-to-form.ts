export function objectToFormData(
	obj: Record<string, string | number | boolean>,
): FormData {
	const formData = new FormData();
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			formData.append(key, String(value));
		}
	}
	return formData;
}
