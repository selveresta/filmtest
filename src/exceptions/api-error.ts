export default class ApiError extends Error {
	public readonly status: number;
	public readonly errors: any[];

	constructor(status: number, message: string, errors: any[] = []) {
		super(message);
		this.status = status;
		this.errors = errors;

		Object.setPrototypeOf(this, ApiError.prototype);
	}

	static UnauthorizedError(): ApiError {
		return new ApiError(401, "User unauthorized");
	}

	static BadRequest(message: string, errors: any[] = []): ApiError {
		return new ApiError(400, message, errors);
	}
}
