import type { Knex } from 'knex';
import type { SQLError } from './dialects/types';
import { getDatabaseClient } from '../../utils/db';
import { logger } from '../../../config/fastify';
import { extractError as postgres } from './dialects/postgres';

/**
 * Translates an error thrown by any of the databases into a pre-defined Exception. Currently
 * supports:
 * - Invalid Foreign Key
 * - Not Null Violation
 * - Record Not Unique
 * - Value Out of Range
 * - Value Too Long
 */
export function translateDatabaseError(knex: Knex, error: SQLError){
	const client = getDatabaseClient(knex);
	let defaultError: unknown;

	switch (client) {
	case 'postgres':
		defaultError = postgres(error);
		break;
	}

	logger.error('database.error', defaultError);

	return defaultError;
}
