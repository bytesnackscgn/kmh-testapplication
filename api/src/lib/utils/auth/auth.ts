/* eslint-disable no-useless-catch */
import type { Knex } from 'knex';
import type { AbstractControllerOptions, TokenPayload, LoginResult, Session, User } from '../../../types';
import jwt from 'jsonwebtoken';
//import { nanoid } from 'nanoid';
import { clone, cloneDeep } from 'lodash';
import { getAuthProvider } from './helper';
import { env } from '../../../config/env';
import { InvalidCredentialsError, InvalidProviderError, UserSuspendedError } from '../../errors/index';
import { secondsToMs } from '../../../../../shared/lib/converter';

export class AuthenticationService {
	knex: Knex;

	constructor(options: AbstractControllerOptions) {
		this.knex = options.knex;
	}

	/**
	 * Retrieve the tokens for a given user email.
	 *
	 * Password is optional to allow usage of this function within the SSO flow and extensions. Make sure
	 * to handle password existence checks elsewhere
	 */
	async login(
		providerName: string = env.API_DEFAULT_AUTH_PROVIDER,
		payload: Record<string, unknown>,
	): Promise<LoginResult> {
		const provider = getAuthProvider(providerName);

		let userId;

		try {
			userId = await provider.getUserID(cloneDeep(payload));
		} catch (err) {
			throw err;
		}

		const user = await this.knex
			.select<User>(
				'u.id',
				'u.email',
				'u.password',
				'u.status',
				'u.role',
				'u.permitted_views',
				'u.permitted_actions',
				'u.provider',
				'r.name'
			)
			.from('users as u')
			.leftJoin('roles as r', 'u.role', 'r.id')
			.where('u.id', userId)
			.first();

		if (user?.status !== 'active') {
			if (user?.status === 'suspended') {
				throw new UserSuspendedError();
			} else {
				throw new InvalidCredentialsError();
			}
		} else if (user.provider !== providerName) {
			throw new InvalidProviderError();
		}


		try {
			await provider.login(clone(user), cloneDeep(payload));
		} catch (e) {
			throw e;
		}

		const tokenPayload = {
			id: user.id,
			role: user.role,
			permitted_views: user.permitted_views,
			permitted_actions: user.permitted_actions,
		};

		const accessToken = jwt.sign(tokenPayload, env.API_JWT_SECRET as string, {
			expiresIn: env.API_JWT_TTL,
			issuer: env.API_JWT_ISSUER
		});
		const nanoid = await import('nanoid');
		const refreshToken = nanoid(64);
		const refreshTokenExpiration = new Date(Date.now() + secondsToMs(env.API_JWT_TTL));

		await this.knex('sessions').insert({
			token: refreshToken,
			user: user.id,
			expires: refreshTokenExpiration,
		});

		await this.knex('sessions').delete().where('expires', '<', new Date());
		await this.knex('users').update({ last_access: new Date() }).where({ id: user.id });

		return {
			accessToken,
			refreshToken,
			expires: secondsToMs(env.API_JWT_TTL),
			user: {
				id: user.id
			}
		};
	}

	async refresh(refreshToken: string): Promise<Record<string, unknown>> {
		if (!refreshToken) {
			throw new InvalidCredentialsError();
		}

		const record = await this.knex
			.select({
				session_expires: 's.expires',
				session_token: 's.token',
				user_id: 'u.id',
				user_email: 'u.email',
				user_password: 'u.password',
				user_status: 'u.status',
				user_provider: 'u.provider',
				user_role_id: 'r.id',
			})
			.from('sessions AS s')
			.leftJoin('users AS u', 's.user', 'u.id')
			.leftJoin('roles AS r', 'u.role', 'r.id')
			.where('s.token', refreshToken)
			.andWhere('s.expires', '>=', new Date())
			.first();

		if (!record || !record.user_id) {
			throw new InvalidCredentialsError();
		}

		if (record.user_id && record.user_status !== 'active') {
			await this.knex('sessions').where({ token: refreshToken }).del();

			if (record.user_status === 'suspended') {
				throw new UserSuspendedError();
			} else {
				throw new InvalidCredentialsError();
			}
		}
		
		//preperation for further authprovider
		/*
		if (record.user_id) {
			const provider = getAuthProvider(record.user_provider);
			
			await provider.refresh({
				id: record.user_id,
				first_name: record.user_first_name,
				last_name: record.user_last_name,
				email: record.user_email,
				password: record.user_password,
				status: record.user_status,
				provider: record.user_provider,
				role: record.role_id,
				permitted_views: record.user_permitted_views,
				permitted_actions: record.user_permitted_actions,
			});
		}
		*/

		const tokenPayload: TokenPayload = {
			id: record.user_id,
			role: record.role_id,
			permitted_views: record.user_permitted_views,
			permitted_actions: record.user_permitted_actions,
		};

		const accessToken = jwt.sign(tokenPayload, env.API_JWT_SECRET as string, {
			expiresIn: env.API_JWT_TTL,
			issuer: env.API_JWT_ISSUER
		});
		const nanoid = await import('nanoid');
		const newRefreshToken = nanoid(64);
		const refreshTokenExpiration = new Date(Date.now() + secondsToMs(env.API_JWT_TTL));

		await this.knex('sessions')
			.update({
				token: newRefreshToken,
				expires: refreshTokenExpiration,
			})
			.where({ token: refreshToken });

		return {
			accessToken,
			refreshToken,
			expires: secondsToMs(env.API_JWT_TTL),
			user: {
				id: record.user_id
			}
		};
	}

	async logout(refreshToken: string): Promise<void> {
		const record = await this.knex
			.select<User & Session>(
				'u.id'
			)
			.from('sessions as s')
			.innerJoin('users as u', 's.user', 'u.id')
			.where('s.token', refreshToken)
			.first();

		if (record) {
			//preperation for further authprovider
			/*
			const user = record;
			const provider = getAuthProvider(user.provider as string);
			await provider.logout(clone(user));
			*/
			await this.knex.delete().from('sessions').where('token', refreshToken);
		}
	}

	async verifyPassword(userID: string, password: string): Promise<void> {
		const user = await this.knex
			.select<User>(
				'id',
				'password',
				'provider',
			)
			.from('users')
			.where('id', userID)
			.first();

		if (!user) {
			throw new InvalidCredentialsError();
		}

		if(!user.provider){
			user.provider = 'local';
		}

		const provider = getAuthProvider(user.provider as string);
		await provider.verify(clone(user), password);
	}
}
