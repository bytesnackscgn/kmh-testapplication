import type { SchemaOverview } from './schema';
import type { Knex } from 'knex';

export type ProviderName = 'local';

export interface AuthDriverOptions {
	knex: Knex;
	schema?: SchemaOverview;
}

export type Role = {
	id: string;
	name: 'admin' | 'editor' | 'guest';
};

export type User = {
	id?: string;
	date_created?: string;
	status?: 'active' | 'suspended' | 'invited';
	first_name?: string;
	last_name?: string;
	email?: string;
	password?: string;
	role?: string;
	provider?: ProviderName,
	token?: string;
	password_reset_token?: string | null;
	permitted_views?: object | null;
	permitted_actions?: object | null;
};

export interface Session {
	token: string;
	expires: Date;
}

export type TokenPayload = {
	id?: string | unknown;
	role: string | unknown;
	permitted_views: object | unknown;
	permitted_actions: object | unknown;
};

export type LoginResult = {
	accessToken: string;
	refreshToken: string;
	expires: string | number;
	user?: User;
};

export type LocalAuthDriverPayload = {
	email: string;
	password: string;
}