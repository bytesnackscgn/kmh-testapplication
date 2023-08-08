import type { ApiEnv, HexColorCode } from '../types';
import dotenv from 'dotenv'; 
import path from 'path';

console.info('DOTENV',process.env.NODE_ENV);

let envPath;
if (process.env.NODE_ENV === 'production') {
	envPath = '../../../.env.production';
} else if (process.env.NODE_ENV === 'staging') {
	envPath = '.../../../.env.staging';
} else {
	envPath = '../../../.env.development';
}

dotenv.config({path: path.resolve(__dirname,envPath) });

export const env: ApiEnv = {
	API_DEBUG: process.env.API_DEBUG ? process.env.API_DEBUG === 'true': true,
	API_HOST: process.env.API_HOST ?? '127.0.0.1',
	API_PORT: process.env.API_PORT ? Number.parseInt(process.env.API_PORT) : 3000,
	API_BODY_LIMIT: process.env.API_BODY_LIMIT ? Number.parseInt(process.env.API_BODY_LIMIT) : 16777216,
	API_HASH_SALT: process.env.API_HASH_SALT,
	API_JWT_SECRET: process.env.API_JWT_SECRET,
	API_JWT_TTL: process.env.API_JWT_TTL ? Number.parseInt(process.env.API_JWT_TTL) : 3600,
	API_JWT_ISSUER: process.env.API_JWT_ISSUER ?? 'kmh-testapplication',
	API_DEFAULT_AUTH_PROVIDER: process.env?.API_DEFAULT_AUTH_PROVIDER ? process.env?.API_DEFAULT_AUTH_PROVIDER.toLowerCase() : 'local',
	API_PASSWORD_RESET_URL_ALLOW_LIST: process.env?.API_PASSWORD_RESET_URL_ALLOW_LIST ? process.env.API_PASSWORD_RESET_URL_ALLOW_LIST.split(',') : [], 
	API_USER_INVITE_URL_ALLOW_LIST: process.env?.API_USER_INVITE_URL_ALLOW_LIST ? process.env.API_USER_INVITE_URL_ALLOW_LIST.split(',') : [],
	API_EMAIL_TRANSPORT: process.env?.API_EMAIL_TRANSPORT ? process.env?.API_EMAIL_TRANSPORT.toLowerCase() : 'sendmail',
	API_EMAIL_FROM_NAME: process.env.API_EMAIL_FROM_NAME,
	API_EMAIL_FROM_EMAIL: process.env.API_EMAIL_FROM_EMAIL,
	API_EMAIL_SENDMAIL_PATH: process.env?.API_EMAIL_SENDMAIL_PATH ?? '/usr/sbin/sendmail',
	API_SMTP_HOST: process.env?.API_SMTP_HOST,
	API_SMTP_PORT: process.env?.API_SMTP_PORT ? Number.parseInt(process.env.API_SMTP_PORT) : 465,
	API_SMTP_USER: process.env?.API_SMTP_USER,
	API_SMTP_PASSWORD: process.env?.API_SMTP_PASSWORD,
	API_SMTP_SECURE: process.env?.API_SMTP_SECURE === 'true',
	API_SMTP_IGNORE_TLS: process.env?.API_SMTP_IGNORE_TLS ? process.env.API_SMTP_IGNORE_TLS === 'true' : false,
	API_DB_CLIENT: process.env.API_DB_CLIENT,
	API_DB_HOST: process.env.API_DB_HOST,
	API_DB_USER: process.env.API_DB_USER,
	API_DB_NAME: process.env.API_DB_NAME,
	API_DB_PASSWORD: process.env.API_DB_PASSWORD,
	API_DB_PORT: Number.parseInt(process.env.API_DB_PORT),
	API_DB_POOL_MAX: process.env.API_DB_POOL_MAX ? Number.parseInt(process.env.API_DB_POOL_MAX) : 10,
	API_DB_SSL: process.env.API_DB_POOL_MAX ? process.env.API_DEBUG === 'true' : false,
	APP_NAME: process.env.APP_NAME ?? 'kmh-testapplication',
	APP_PUBLIC_URL: process.env.APP_PUBLIC_URL,
	APP_PRIMARY_COLOR: process.env?.APP_PRIMARY_COLOR as HexColorCode ?? '#00657e',
};

console.log('ENV',env);

export function getEnv() : ApiEnv{ return env; }