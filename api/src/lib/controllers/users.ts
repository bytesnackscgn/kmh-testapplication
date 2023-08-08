import type { AbstractControllerOptions, Item, User } from '../../types';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '../utils/auth/jwt';
import { env } from '../../config/env';
import { ForbiddenError, InvalidPayloadError, RecordNotUniqueError, NoPrimaryKeyError} from '../errors/index';
import { CustomError } from '../../../../shared/lib/errors';
import { constructURL } from '../utils/url';
import { ItemsController } from './items';
import { MailUtil } from './mail/index';
import { isEmpty } from '../../../../shared/lib/validator';
import { getHash } from '../utils/hash';

export class UsersController extends ItemsController {
	constructor(options: AbstractControllerOptions) {
		super('users', options);
		this.knex = options.knex;
		this.accountability = options.accountability || null;
		this.schema = options.schema;
	}

	/**
	 * User email has to be unique case-insensitive. This is an additional check to make sure that
	 * the email is unique regardless of casing
	 */
	private async checkUniqueEmails(emails: string[]): Promise<void> {
		emails = emails.map((email) => email.toLowerCase());

		const duplicates = emails.filter((value, index, array) => array.indexOf(value) !== index);

		if (duplicates.length) {
			throw new RecordNotUniqueError('checkUniqueEmails', 'email');
		}

		const query = this.knex
			.select('email')
			.from('users')
			.whereRaw(`LOWER(??) IN (${emails.map(() => '?')})`, ['email', ...emails]);

		const results = await query;

		if (results.length) {
			throw new RecordNotUniqueError('users', 'email');
		}
	}

	/**
	 * Check if the provided password matches the strictness as configured in
	 */
	private checkPasswordPolicy(passwords: string[]): void {
		const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		const regex = new RegExp(pattern);

		for (const password of passwords) {
			if (!regex.test(password)) {
				throw new CustomError(400,'Password policy Error, password should contain: min. one Number, lowercase & uppercase letter and one special charachter and at least 8 characters');
			}
		}
	}

	private async checkRemainingAdminExistence(excludeKeys: string[]): Promise<void> {
		// Make sure there's at least one admin user left after this deletion is done
		const admins = await this.knex
			.count('*', { as: 'count' })
			.from('users')
			.whereNotIn('users.id', excludeKeys)
			.andWhere({ 'roles.name': 'admin' })
			.leftJoin('roles', 'users.role', 'roles.id')
			.first();

		const count = +(admins?.count || 0);

		if (count === 0) {
			throw new CustomError(500,'You can\'t remove the last admin user from the role');
		}
	}

	/**
	 * Make sure there's at least one active admin user when updating user status
	 */
	private async checkRemainingActiveAdmin(excludeKeys: string[]): Promise<void> {
		const admins = await this.knex
			.count('*', { as: 'count' })
			.from('users')
			.whereNotIn('users.id', excludeKeys)
			.andWhere({ 'roles.name': 'admin' })
			.andWhere({ 'users.status': 'active' })
			.leftJoin('roles', 'users.role', 'roles.id')
			.first();

		const count = +(admins?.count || 0);

		if (count === 0) {
			throw new CustomError(500, 'You can\'t change the active status of the last admin user');
		}
	}

	/**
	 * Get basic information of user identified by email
	 */
	private async getUserByEmail(email: string): Promise<User> {
		return await this.knex
			.select('id', 'role', 'status', 'password')
			.from('users')
			.where('email', email.toLowerCase())
			.first();
	}

	/**
	 * Create url for inviting users
	 */
	private inviteUrl(email: string, url: string | null): string {
		const payload = { email, scope: 'invite' };

		const token = jwt.sign(payload, env.API_JWT_SECRET, { expiresIn: '7d', issuer: env.API_JWT_ISSUER });
		const inviteURL = url ? constructURL(url): constructURL(env.APP_PUBLIC_URL ,'auth/accept-invite',{
			token
		});

		return inviteURL;
	}

	/**
	 * Create a new user
	 */
	override async createOne(data: Partial<Item>): Promise<Partial<Item>> {
		const result = await this.createMany([data]);
		return result[0];
	}

	/**
	 * Create multiple new users
	 */
	override async createMany(data: Partial<Item>[]): Promise<Partial<Item>[]> {
		const emails : string[]= data['map']((payload) => payload['email']).filter((email) => email) as string[];
		const passwords : string[]= data['map']((payload) => payload['password']).filter((password) => password) as string[];

		if (emails.length) {
			await this.checkUniqueEmails(emails);
		}

		if (passwords.length) {
			this.checkPasswordPolicy(passwords);
		}

		return await super.createMany(data);
	}

	/**
	 * Update a single user by primary key
	 */
	override async updateOne(data: Partial<User>): Promise<Partial<Item>> {
		if (!data?.id) {
			throw new NoPrimaryKeyError('id');
		}

		if (data.role) {
			const roleId = data.role;

			const newRole = await this.knex.select('name').from('roles').where('id', roleId).first();

			if (newRole?.name === 'admin') {
				await this.checkRemainingAdminExistence([data.id] as string[]);
			}else if (data?.status !== undefined && data?.status !== 'active') {
				await this.checkRemainingActiveAdmin([data.id] as string[]);
			}
		}

		if (data?.email) {
			await this.checkUniqueEmails([data.email] as string[]);
		}

		if (data?.password) {
			this.checkPasswordPolicy([data.password] as string[]);
		}

		if (data?.provider) {
			if (this.accountability && this.accountability.admin !== true) {
				throw new InvalidPayloadError('You can\'t change the "provider" value manually');
			}
		}

		return await super.updateOne(data);
	}

	/**
	 * Update many users by primary key
	 */
	override async updateMany(data: Partial<User>[]): Promise<Partial<Item>[]> {
		const updatedItems: Partial<Item>[] = await this.knex.transaction(async (trx) => {
			const items: Partial<Item>[] = [];

			for (const payload of data) {
				const newItem = await this.updateOne(payload);
				items[items.length] = newItem;
			}

			return items;
		});

		return await updatedItems;
	}

	/**
	 * Delete a single user by primary key
	 */
	override async deleteOne(id: string): Promise<string> {
		await this.checkRemainingAdminExistence([id]);
		return await super.deleteOne(id);
	}

	/**
	 * Delete multiple users by primary key
	 */
	override async deleteMany(ids: string[]): Promise<string[]> {
		const deletedItems: string[] = await this.knex.transaction(async (trx) => {
			const items: string[] = [];

			for (const id of ids) {
				const deletedItem = await this.deleteOne(id);
				items[items.length] = deletedItem;
			}

			return items;
		});

		return await deletedItems;
	}

	async inviteUser(email: string | string[], role: string, url: string | null, subject?: string | null): Promise<void> {
		if (!url || env['API_USER_INVITE_URL_ALLOW_LIST'].indexOf(url)  === -1) {
			throw new InvalidPayloadError(`Url "${url}" can't be used to invite users`);
		}

		const emails = Array.isArray(email) ? email : [email];

		const mail = new MailUtil();

		for (const email of emails) {
			// Check if user is known
			const user = await this.getUserByEmail(email);

			const isUserEmpty = isEmpty(user);
			const isUserInvited = user?.status === 'invited';

			//Create user if `isUserEmpty`is true
			if (isUserEmpty) {
				await this.createOne({ email, role, status: 'invited' });
			} else if (isUserInvited && user.role !== role) {
				// For known users update role if changed
				await this.updateOne({id: user.id, role: role});
			}

			// Send invite for new and already invited users
			if (isUserEmpty || isUserInvited) {
				await mail.send({
					to: email,
					subject: subject ?? `You have been invited to ${env.APP_NAME}`,
					template: {
						name: 'user-invitation',
						data: {
							url: this.inviteUrl(email, url),
							email,
						},
					},
				});
			}
		}
	}

	async acceptInvite(token: string, password: string): Promise<void> {
		const { email, scope } = verifyJWT(token, env.API_JWT_SECRET) as {
			email: string;
			scope: string;
		};

		if (scope !== 'invite') throw new ForbiddenError('Something went wrong with the invitation');

		const user = await this.getUserByEmail(email);

		if (user?.status !== 'invited') {
			throw new InvalidPayloadError(`Email address ${email} hasn't been invited`);
		}

		await this.updateOne({ 
			id: user.id, 
			password,
			status: 'active'
		});
	}

	async requestPasswordReset(email: string, url: string | null, subject?: string | null): Promise<void> {
		const user = await this.getUserByEmail(email);

		if (user?.status !== 'active') {
			throw new ForbiddenError('The user is not active');
		}

		if (url && env?.API_PASSWORD_RESET_URL_ALLOW_LIST.indexOf(url) === -1) {
			throw new InvalidPayloadError(`Url "${url}" can't be used to reset passwords`);
		}

		const mail = new MailUtil();

		const payload = { email, scope: 'password-reset', hash: getHash(user.password, env.API_HASH_SALT) };
		const token = jwt.sign(payload, env.API_JWT_SECRET, { expiresIn: '1d', issuer: env.API_JWT_ISSUER });

		const acceptURL = url ? constructURL(url, null,{
			token
		}) : constructURL(env.APP_PUBLIC_URL,'auth/reset-password',{
			token
		});

		await mail.send({
			to: email,
			subject: subject ? subject : 'Password Reset Request',
			template: {
				name: 'password-reset',
				data: {
					url: acceptURL,
					email,
				},
			},
		});
	}

	async resetPassword(token: string, password: string): Promise<void> {
		const { email, scope, hash } = jwt.verify(token, env.API_JWT_SECRET, { issuer: env.API_JWT_ISSUER }) as {
			email: string;
			scope: string;
			hash: string;
		};

		if (scope !== 'password-reset' || !hash) throw new ForbiddenError('Invalid token');
		
		await this.checkPasswordPolicy([password]);
		
		const user = await this.getUserByEmail(email);

		if (user?.status !== 'active' || hash !== getHash(user.password, env.API_HASH_SALT)) {
			throw new ForbiddenError('User is not active or wrong token');
		}

		// Allow unauthenticated update
		const service = new UsersController({
			knex: this.knex,
			schema: this.schema,
			accountability: {
				...(this.accountability ?? { role: null }),
				admin: true, // We need to skip permissions checks for the update call below
			},
		});

		await service.updateOne({ 
			id: user.id,
			password,
			status: 'active'
		});
	}
}