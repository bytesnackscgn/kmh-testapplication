import type { Knex } from 'knex';
import type {DatabaseClient} from '../../types';

export function getDatabaseClient(database: Knex): DatabaseClient {
	switch (database.client.constructor.name) {
	case 'Client_PG':
		return 'postgres';
	}

	throw new Error('Couldn\'t extract database client');
}