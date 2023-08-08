// Create a custom error class that extends the base CustomError
export class CustomError extends Error {
	code;
	message;
	constructor(code: number, message: string) {
		super(`Error (Code ${code}): ${message}`);
		this.code = code;
		this.message = message;
	}
}

export class NoInputError extends CustomError{
	constructor() {
		super(500, `Input is null or undefined`);
	}
}

export class InvalidCredentialsError extends CustomError{
	constructor() {
		super(500, `Invalid credentials`);
	}
}