import { env } from '../config/env';

module.exports = async function (fastify, opts) {
	fastify.get('/', async function (req, res) {
		res.send({ message: `${env.APP_NAME} backend` });
	});
};