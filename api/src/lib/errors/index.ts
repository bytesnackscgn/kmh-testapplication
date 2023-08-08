import { CustomError } from '../../../../shared/lib/errors';

export class InvalidKeyError extends CustomError{
	constructor(key: string) {
		super(403, `Key '${key}' is not valid`);
	}
}

export class InvalidForeignKeyError extends CustomError{
	constructor(collection, key) {
		super(400, `Invalid foreign key '${key}' in ${collection}`);
	}
}

export class NotNullViolationError extends CustomError{
	constructor(collection, key) {
		super(400, `NotNullViolationErrorextends in ${collection} with key ${key}' `);
	}
}

export class ValueTooLongError extends CustomError{
	constructor(collection, key) {
		super(400, `Value is too long in ${collection} on column ${key}' `);
	}
}

export class ValueOutOfRangeError extends CustomError{
	constructor(collection, key) {
		super(400, `Value is out of range in ${collection} on column ${key}' `);
	}
}

export class InvalidPayloadError extends CustomError{
	constructor(error: string) {
		super(403, error);
	}
}

export class ForbiddenError extends CustomError{
	constructor(message: string) {
		super(403, `Forbidden: ${message}`);
	}
}

export class NoPrimaryKeyError extends CustomError{
	constructor(key: string) {
		super(500, `Key ${key} is missing`);
	}
}

export class NotFoundItemError extends CustomError{
	constructor(collection: string, id: string) {
		super(404, `Not found item with id ${id} in table ${collection}`);
	}
}

export class FilteringError extends CustomError{
	constructor(collection: string, id: string) {
		super(500, `Filter id ${id} in table ${collection}`);
	}
}

export class RecordNotUniqueError extends CustomError{
	constructor(collection: string, key: string) {
		super(400, `Record is not unique in key ${key} in table ${collection}`);
	}
}

export class ServiceUnavailableError extends CustomError{
	constructor(service: string, message: string) {
		super(500, `Service or Util ${service} is not available. ${message}`);
	}
}

export class ExpiredError extends CustomError{
	constructor(scope: string) {
		super(400, `${scope} is expired`);
	}
}

export class InvalidTokenError extends CustomError{
	constructor() {
		super(400, 'Invalid Token');
	}
}

export class NotMaintainedTransporterError extends CustomError{
	constructor() {
		super(500, 'The provided E-Mail Transporter is not provided');
	}
}

export class InvalidCredentialsError extends CustomError{
	constructor() {
		super(403, 'Invalid user credentials');
	}
}

export class InvalidProviderError extends CustomError{
	constructor() {
		super(403, 'Invalid provider');
	}
}

export class UserSuspendedError extends CustomError{
	constructor() {
		super(403, 'User suspended');
	}
}

export class ContainsNullValuesError extends CustomError{
	constructor(collection: string, key: string) {
		super(400, `${collection}:Cannot insert the value NULL into column ${key}`);
	}
}