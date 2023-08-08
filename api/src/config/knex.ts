import { logger } from './fastify';
import { env } from './env';

const log = {
	warn: (msg) => logger.warn(msg),
	error: (msg) => logger.error(msg),
	deprecate: (msg) => logger.info(msg),
	debug: (msg) => logger.debug(msg),
};

export default {
	client: env.API_DB_CLIENT,
	connection: {
		host: env.API_DB_HOST,
		port: env.API_DB_PORT,
		database: env.API_DB_NAME,
		user: env.API_DB_USER,
		password: env.API_DB_PASSWORD,
		ssl: env.API_DB_SSL ? { rejectUnauthorized: false } : false,
	},
	log: !env.API_DEBUG ? null : log,
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: 'knex_migrations',
	},
	timezone: 'UTC'
};