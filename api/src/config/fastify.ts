import loggerConfig from './logger';
import { env } from './env';
import fastify from 'fastify';
import app from '../app';
import qs from 'fast-querystring';

const srv = fastify({
	logger: !env.API_DEBUG ? false : ( loggerConfig[`${process.env.NODE_ENV}`] ?? true ),
	bodyLimit: env.API_BODY_LIMIT ?? 16777216,
	pluginTimeout: 10000,
	querystringParser: (str) => qs.parse(str),
});

export const logger = srv.log;

export function run (){
	srv.register(app);
	srv.listen({
		host: env.API_HOST,
		port: env.API_PORT
	}, (err, address) => {
		if (err) {
			srv.log.error(err, address);
			process.exit(1);
		}
		srv.log.info(`server listening on ${address}`);
	});
}