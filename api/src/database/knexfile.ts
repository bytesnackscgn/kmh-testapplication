import type { Knex } from 'knex';
import knexConfig from '../config/knex';

module.exports = {
	development: {
		...knexConfig
	},
	production: {
		...knexConfig
	},
} as Knex.Config;