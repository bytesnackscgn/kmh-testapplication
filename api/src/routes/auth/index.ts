'use strict';
import { InvalidPayloadError } from '../../lib/errors';
import { AuthenticationService } from '../../lib/utils/auth/auth';
import Joi from 'joi';
import { UsersController } from '../../lib/controllers/users';

module.exports = async function (fastify, opts) {
	fastify.post('/login ', async function (req, res) {
		const userLoginSchema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			mode: Joi.string().valid('json'),
		}).unknown();

		const authenticationService = new AuthenticationService({
			knex: fastify.knex
		});

		const { error } = userLoginSchema.validate(req.body);

		if (error) {
			throw new InvalidPayloadError( error.message );
		}

		const mode = req.body.mode || 'json';
		const provider = req.body.provider || 'local';

		const { accessToken, refreshToken, expires } = await authenticationService.login(provider, req.body);

		const payload = {
			data: { access_token: accessToken, expires },
		};

		if (mode === 'json') {
			payload.data['refresh_token'] = refreshToken;
		}

		res.send(payload);
	});

	fastify.post('/refresh ', async function (req, res) {  
		const authenticationService = new AuthenticationService({
			knex: fastify.knex
		});

		const currentRefreshToken = req.body.refresh_token;

		if (!currentRefreshToken) {
			throw new InvalidPayloadError('"refresh_token" is required in the JSON payload');
		}

		const mode = req.body.mode || 'json';

		const { accessToken, refreshToken, expires } = await authenticationService.refresh(currentRefreshToken);

		const payload = {
			data: { access_token: accessToken, expires },
		};

		if (mode === 'json') {
			payload['data']['refresh_token'] = refreshToken;
		}

		res.send(payload);
	});

	fastify.post('/logout ', async function (req, res) {  
		const authenticationService = new AuthenticationService({
			knex: fastify.knex
		});

		const currentRefreshToken = req.body.refresh_token;

		if (!currentRefreshToken) {
			throw new InvalidPayloadError('"refresh_token" is required in the JSON payload');
		}

		await authenticationService.logout(currentRefreshToken);

		res.send({
			state: true
		});
	});

	fastify.post('/password/request', async function (req, res) {  
		if (typeof req.body.email !== 'string') {
			throw new InvalidPayloadError('"email" field is required');
		}

		const service = new UsersController({ schema: fastify.schema });

		await service.requestPasswordReset(req.body.email, req.body.reset_url || null);

		res.send({
			state: true
		});
	});

	fastify.post('/password/reset', async function (req, res) {  
		if (typeof req.body.token !== 'string') {
			throw new InvalidPayloadError('"token" field is required');
		}

		if (typeof req.body.password !== 'string') {
			throw new InvalidPayloadError('"password" field is required');
		}

		const service = new UsersController({ schema: fastify.schema });
		await service.resetPassword(req.body.token, req.body.password);
		
		res.send({
			state: true
		});
	});
};