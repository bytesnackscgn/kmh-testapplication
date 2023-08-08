import type { Knex } from 'knex';
import type { AuthDriverOptions, User } from '../../../../types';

export abstract class AuthDriver {
	knex: Knex;

	constructor(options: AuthDriverOptions) {
		this.knex = options.knex;
	}

	/**
	 * Get user id for a given provider payload
	 *
	 * @param payload Any data that the user might've provided
	 * @throws InvalidCredentialsError
	 * @return User id of the identifier
	 */
	abstract getUserID(payload: Record<string, unknown>): Promise<string>;

	/**
	 * Verify user password
	 *
	 * @param user User information
	 * @param password User password
	 * @throws InvalidCredentialsError
	 */
	abstract verify(user: User, password?: string): Promise<void>;

	/**
	 * Check with the (external) provider if the user is allowed enter the app
	 *
	 * @param _user User information
	 * @param _payload Any data that the user might've provided
	 * @throws InvalidCredentialsError
	 * @returns Data to be stored with the session
	 */
	async login(_user: User, _payload: Record<string, unknown>): Promise<void> {
		return;
	}

	/**
	 * Handle user session refresh
	 *
	 * @param _user User information
	 * @throws InvalidCredentialsError
	 */
	async refresh(_user: User): Promise<void> {
		return;
	}

	/**
	 * Handle user session termination
	 *
	 * @param _user User information
	 */
	async logout(_user: User): Promise<void> {
		return;
	}
}