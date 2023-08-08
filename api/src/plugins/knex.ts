import fp from 'fastify-plugin';
import knex from 'knex';
import knexConfig from '../config/knex';

const knexConnector = async (srv, options = {}) => {
	const db = knex(knexConfig);
	srv.decorate('knex', db);
};

module.exports = fp(knexConnector);

