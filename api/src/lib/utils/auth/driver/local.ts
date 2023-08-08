import type { User, LocalAuthDriverPayload } from '../../../../types';
import { InvalidCredentialsError } from '../../../../../../shared/lib/errors';
import { AuthDriver } from './authdriver';
import argon2 from 'argon2';

export class LocalAuthDriver extends AuthDriver {
	constructor(options){
		super(options);
		this.knex = options.knex;
	}

	async getUserID(payload: LocalAuthDriverPayload): Promise<string> {
		if (!payload['email']) {
			throw new InvalidCredentialsError();
		}

		const user = await this.knex
			.select('id')
			.from('users')
			.where('email', payload['email'].toLowerCase())
			.first();

		if (!user) {
			throw new InvalidCredentialsError();
		}

		return user.id;
	}

	async verify(user: User, password?: string): Promise<void> {
		if (!user.password || !(await argon2.verify(user.password, password as string))) {
			throw new InvalidCredentialsError();
		}
	}

	override async login(user: User, payload: Record<string, string>): Promise<void> {
		await this.verify(user, payload.password);
	}
}