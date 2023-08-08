import { InvalidKeyError, NoPrimaryKeyError} from '../errors/index';
import type { Schema } from '../../types';
/**
 * Validate if payloadkeys which fits to schema
 */
export function validateKeys( schema: Schema, keys: string[], requiresPrimaryKey?: boolean) : void {
	if (requiresPrimaryKey && !keys.includes(schema.primary)) {
		throw new NoPrimaryKeyError(schema.primary);
	}
	
	const fieldNames = schema.fields.map((field) => field.name);
  
	// Loop through the keys and throw InvalidKeyError if a key is not found in the fieldNames array
	for (const key of keys) {
		if (!fieldNames.includes(key)) {
			throw new InvalidKeyError(key);
		}
	}
}
