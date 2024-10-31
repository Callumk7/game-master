export class DatabaseError extends Error {
	constructor(message = "Database Error") {
		super(message);
		this.name = "DatabaseError";
	}
}
