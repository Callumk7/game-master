export function getContentType(request: Request): string | null {
	return request.headers.get("Content-Type");
}
